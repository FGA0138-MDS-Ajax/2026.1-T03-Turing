import { BookOpen, FileText, Bell, Settings } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProfessorLayout } from '../../components/professor/ProfessorLayout';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ProfessorDashboard.css';
import '../../styles/dashboard-shared.css'

//substituir por chamadas à API quando backend estiver pronto

const STAT_CARDS = [
  { label: 'Conteúdos ativos', value: '-',  icon: BookOpen,  color: '#C07A30' },
  { label: 'Atividades criadas', value: '-', icon: FileText, color: '#C45C2E' },
];

const ATIVIDADES_RECENTES = [
  { id: 1, titulo: '-', disciplina: '-' },
];

const DUVIDAS_RECENTES = [
  { id: 1, aluno: '--',    titulo: '--',    disciplina: '-', tempo: '- min atrás',   respondida: false },
];

function StatCard({ label, value, icon: Icon, color, loading }) {
  return (
    <div className="ad-stat-card">
      <div className="ad-stat-info">
        <span className="ad-stat-label">{label}</span>
        <span className="ad-stat-value">
          {loading ? <span className="ad-stat-skeleton" /> : value}
        </span>
      </div>
      <div className="ad-stat-icon" style={{ background: color }}>
        <Icon size={22} color="#fff" />
      </div>
    </div>
  );
}

function AtividadeItem({ titulo, disciplina }) {
  return (
    <div className="prof-atividade-item">
      <div className="prof-atividade-icon">
        <FileText size={16} color="#2F5D62" />
      </div>
      <div className="prof-atividade-info">
        <span className="prof-atividade-titulo">{titulo}</span>
        <span className="profgit-atividade-disciplina">{disciplina}</span>
      </div>
    </div>
  );
}

function DuvidaItem({ aluno, titulo, disciplina, tempo, respondida, conteudoId }) {
  const navigate = useNavigate();
  return (
    <div className="ad-duvida-item">
      <div className="ad-duvida-info">
        <span className="ad-duvida-aluno">{aluno}</span>
        <span className="ad-duvida-titulo">{titulo}</span>
        <span className="ad-duvida-meta">{disciplina} • {tempo}</span>
      </div>
      <span 
        className={`ad-duvida-badge ${respondida ? 'ad-duvida-badge--respondida' : 'ad-duvida-badge--pendente'}`}
        onClick={!respondida && conteudoId ? () => navigate(`/professor/conteudos/${conteudoId}/forum`) : undefined}
        style={!respondida ? { cursor: 'pointer' } : {}}
      >
        {respondida ? '✓ Respondida' : 'Responder'}
      </span>
    </div>
  );
}

function formatarTempo(iso) {
  if (!iso) return '—';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}


export function ProfessorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({ conteudosAtivos: null, atividadesCriadas: null });
  const [loadingStats, setLoadingStats] = useState(true);
  const [erroStats, setErroStats] = useState(null);
  const [atividadesRecentes, setAtividadesRecentes] = useState([]);
  const [duvidasRecentes, setDuvidasRecentes]       = useState([]);

  const iniciais = user?.nome
    ? user.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'P';

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    setErroStats(null);
    try {
      const [conteudosRes, materiaisRes, professoresRes, mensagensRes] = await Promise.all([
        api.get('/api/disciplinas/conteudos/'),
        api.get('/api/disciplinas/materiais/'),
        api.get('/api/usuarios/professores/'),
        api.get('/api/interacoes/mensagens/'),
      ]);

      // Isolado: se der 403, não derruba o resto do dashboard
      let foruns = [];
      try {
        const forunsRes = await api.get('/api/interacoes/foruns/');
        foruns = Array.isArray(forunsRes.data) ? forunsRes.data : forunsRes.data?.results ?? [];
      } catch (forumErr) {
        console.error('Não foi possível carregar fóruns:', forumErr);
      }

      const conteudos = Array.isArray(conteudosRes.data) ? conteudosRes.data : [];
      const materiais = Array.isArray(materiaisRes.data) ? materiaisRes.data : [];
      const todasMensagens = Array.isArray(mensagensRes.data)
        ? mensagensRes.data
        : mensagensRes.data?.results ?? [];

      const meusConteudos = conteudos.filter((c) =>
        Array.isArray(c.professores) && c.professores.some(
          (p) => p === user?.user_id || p?.id === user?.user_id
        )
      );

      const forumParaConteudo = foruns.reduce((acc, f) => {
        acc[f.id] = f.conteudo;
        return acc;
      }, {});

      const meusMateriais = materiais;
      const perguntas = todasMensagens.filter(m => m.resposta_para === null);
      const respostas = todasMensagens.filter(m => m.resposta_para !== null);

      const perguntasComStatus = perguntas.map(p => ({
        ...p,
        respondida: respostas.some(r => r.resposta_para === p.id),
      }));

      setStats({
        conteudosAtivos: meusConteudos.filter(c => c.status === 'ativo').length,
        atividadesCriadas: meusMateriais.length,
      });

      const atividadesRecentes = [...meusMateriais]
        .sort((a, b) => new Date(b.data_create) - new Date(a.data_create))
        .slice(0, 5)
        .map(m => {
          const conteudo = meusConteudos.find(c => c.id === m.conteudo);
          return { id: m.id, titulo: m.nome, disciplina: conteudo?.nome || '—' };
        });

      const duvidasRecentes = [...perguntasComStatus]
        .sort((a, b) => new Date(b.data_create) - new Date(a.data_create))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          aluno: p.autor_nome || '—',
          titulo: p.texto?.slice(0, 60) + (p.texto?.length > 60 ? '...' : ''),
          tempo: formatarTempo(p.data_create),
          respondida: p.respondida,
          conteudoId: forumParaConteudo[p.forum],
        }));

      setAtividadesRecentes(atividadesRecentes);
      setDuvidasRecentes(duvidasRecentes);

    } catch (err) {
      console.error(err);
      setErroStats('Não foi possível carregar as estatísticas.');
    } finally {
      setLoadingStats(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);


  return (
    <ProfessorLayout>
      <div className="gs-topbar">
        <h1 className="gs-page-title">Dashboard do Professor</h1>
        <p className="gs-page-subtitle">
          Bem-vindo de volta, {user?.nome?.split(' ')[0] || 'Professor'}! Gerencie seus conteúdos e materiais.
        </p>
      </div>



      {erroStats && (
        <div className="ad-erro-banner">{erroStats}</div>
      )}


      <section className="ad-stats-grid">
        <StatCard
          label="Conteúdos ativos"
          value={stats.conteudosAtivos ?? 0}
          icon={BookOpen}
          color="#C07A30"
          loading={loadingStats}
        />
        <StatCard
          label="Atividades criadas"
          value={stats.atividadesCriadas ?? 0}
          icon={FileText}
          color="#C45C2E"
          loading={loadingStats}
        />
      </section>

      <section className="ad-paineis">

        <div className="ad-painel">
          <h2 className="ad-painel-titulo">Atividades recentes</h2>
          <div className="ad-painel-lista">
            {loadingStats && <p className="ad-estado">Carregando...</p>}
            {!loadingStats && atividadesRecentes.length === 0 && (
              <p className="ad-estado">Nenhum material criado ainda.</p>
            )}
            {!loadingStats && atividadesRecentes.map((item) => (
              <AtividadeItem key={item.id} titulo={item.titulo} disciplina={item.disciplina} />
            ))}
          </div>
        </div>

        <div className="ad-painel">
          <h2 className="ad-painel-titulo">Dúvidas recentes</h2>
          <div className="ad-painel-lista">
            {loadingStats && <p className="ad-estado">Carregando...</p>}
            {!loadingStats && duvidasRecentes.length === 0 && (
              <p className="ad-estado">Nenhuma dúvida recente.</p>
            )}
            {!loadingStats && duvidasRecentes.map((item) => (
              <DuvidaItem key={item.id} {...item} />
            ))}
          </div>
        </div>

      </section>
    </ProfessorLayout>
  );
}