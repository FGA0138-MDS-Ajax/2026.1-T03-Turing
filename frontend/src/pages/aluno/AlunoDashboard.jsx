import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listarConteudos, listarDisciplinas, listarMateriais, listarMinhasMensagens } from '../../services/disciplinasService';
import api from '../../services/api';
import '../../styles/dashboard-shared.css'

function StatCard({ label, value, icon: Icon, color, loading }) {
  return (
    <div className="ad-stat-card">
      <div className="ad-stat-info">
        <span className="ad-stat-label">{label}</span>
        <span className="ad-stat-value">
          {loading ? <span className="ad-stat-skeleton" /> : (value ?? 0)}
        </span>
      </div>
      <div className="ad-stat-icon" style={{ background: color }}>
        <Icon size={24} color="#fff" />
      </div>
    </div>
  );
}

function ConteudoRecenteItem({ matricula, disciplinas }) {
  const navigate = useNavigate();
  const conteudo  = matricula.conteudo_detalhes;
  const disciplina = disciplinas.find(d => d.id === matricula.disciplina_id);

  return (
    <div
      className="ad-recente-item"
      onClick={() => navigate(`/aluno/conteudos/${matricula.conteudo}`)}
      role="button"
      tabIndex={0}
    >
      <div className="ad-recente-icone">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
          <line x1="7" y1="8"  x2="17" y2="8"  stroke="currentColor" strokeWidth="1.5"/>
          <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="ad-recente-info">
        <span className="ad-recente-nome">{conteudo?.nome || '—'}</span>
        <span className="ad-recente-disciplina">{disciplina?.nome || '—'}</span>
        {matricula.professores_nomes?.length > 0 && (
          <span className="ad-recente-prof">• {matricula.professores_nomes[0]}</span>
        )}
      </div>
    </div>
  );
}

function MaterialDisponivel({ material }) {
  const url = material.link || (
    material.arquivo
      ? (material.arquivo.startsWith('http') ? material.arquivo : `http://localhost:8000${material.arquivo}`)
      : null
  );

  const icones = {
    video: { bg: '#EEF5FF', cor: '#2672CE' },
    pdf: { bg: '#FEF0F0', cor: '#D94040' },
    link: { bg: '#F0FDF4', cor: '#2D7A46' },
    apresentacao: { bg: '#FEF3E0', cor: '#C07A30' },
    imagem: { bg: '#F5F0FF', cor: '#7C3AED' },
    documento: { bg: '#F0F4FF', cor: '#2655CE' },
  };
  const estilo = icones[material.tipo] || icones.documento;

  return (
    <div className="ad-material-item">
      <div className="ad-material-icone" style={{ background: estilo.bg, color: estilo.cor }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
            stroke="currentColor" strokeWidth="1.8" fill="none" />
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.8" fill="none" />
        </svg>
      </div>
      <div className="ad-material-info">
        <span className="ad-material-nome">{material.nome}</span>
        <span className="ad-material-tipo">{material.tipo}</span>
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="ad-material-btn">
          Abrir
        </a>
      )}
    </div>
  );
}

export function AlunoDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({ disciplinasAtivas: null, perguntasFeitas: null, perguntasRespondidas: null });
  const [conteudosRecentes, setConteudosRecentes] = useState([]);
  const [disciplinas, setDisciplinas]         = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [loadingStats, setLoadingStats]       = useState(true);
  const [erroStats, setErroStats]             = useState(null);

  const carregar = useCallback(async () => {
    setLoadingStats(true);
    setErroStats(null);
    try {
      const [conteudosRes, disciplinasRes, matriculasRes, materiaisRes, mensagensRe] = await Promise.all([
        listarConteudos(),
        listarDisciplinas(),
        api.get('/api/matriculas/'),
        listarMateriais(),
        listarMinhasMensagens(),
      ]);

      const conteudos  = Array.isArray(conteudosRes.data)   ? conteudosRes.data   : [];
      const todasDisc  = Array.isArray(disciplinasRes.data) ? disciplinasRes.data : [];
      const matriculas = Array.isArray(matriculasRes.data)  ? matriculasRes.data  : [];
      const todosMat  = Array.isArray(materiaisRes.data)   ? materiaisRes.data   : [];
      const disciplinasUnicas = new Set(conteudos.map(c => c.disciplina)).size;
      const todasMensagens = Array.isArray(mensagensRes.data) ? mensagensRes.data : [];
      const perguntasFeitas = todasMensagens.filter(m => m.resposta_para === null).length;
      const perguntasRespondidas = todasMensagens.filter(m =>
        m.resposta_para === null &&
        todasMensagens.some(r => r.resposta_para === m.id)
      ).length;

      setStats({ disciplinasAtivas: disciplinasUnicas, perguntasFeitas, perguntasRespondidas, });
      setDisciplinas(todasDisc);
      setMateriais(todosMat.slice(0, 5)); 

      const recentes = [...matriculas]
        .sort((a, b) => new Date(b.matriculado_em) - new Date(a.matriculado_em))
        .slice(0, 3);
      setConteudosRecentes(recentes);
    } catch (err) {
      console.error(err);
      setErroStats('Não foi possível carregar os dados.');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  return (
    <>
      <div className="gs-topbar">
        <h1 className="gs-page-title">Dashboard do Aluno</h1>
        <p className="gs-page-subtitle">
          Bem-vindo de volta, {user?.nome?.split(' ')[0] || 'Aluno'}! Aqui está um resumo dos seus conteúdos e materiais.
        </p>
      </div>

      {erroStats && <div className="ad-erro-banner">{erroStats}</div>}

      <section className="ad-stats-grid">
        <StatCard
          label="Disciplinas Ativas"
          value={stats.disciplinasAtivas}
          icon={BookOpen}
          color="#D9A441"
          loading={loadingStats}
        />
        <StatCard
          label="Perguntas feitas"
          value={stats.perguntasFeitas}
          icon={MessageCircle}
          color="#C46A3C"
          loading={loadingStats}
        />
        <StatCard
          label="Perguntas respondidas"
          value={stats.perguntasRespondidas}
          icon={CheckCircle}
          color="#2F5D62"
          loading={loadingStats}
        />
      </section>

      <section className="ad-paineis">
        <div className="ad-painel">
          <h2 className="ad-painel-titulo">Conteúdos acessados recentemente</h2>
          <div className="ad-painel-lista">
            {loadingStats && <p className="ad-estado">Carregando...</p>}
            {!loadingStats && conteudosRecentes.length === 0 && (
              <p className="ad-estado">Nenhum conteúdo acessado ainda.</p>
            )}
            {!loadingStats && conteudosRecentes.map(m => (
              <ConteudoRecenteItem key={m.id} matricula={m} disciplinas={disciplinas} />
            ))}
          </div>
        </div>

        <div className="ad-painel">
          <h2 className="ad-painel-titulo">Materiais disponíveis</h2>
          <div className="ad-painel-lista">
            {loadingStats && <p className="ad-estado">Carregando...</p>}
            {!loadingStats && materiais.length === 0 && (
              <p className="ad-estado">Nenhum material disponível ainda.</p>
            )}
            {!loadingStats && materiais.map(m => (
              <MaterialDisponivel key={m.id} material={m} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}