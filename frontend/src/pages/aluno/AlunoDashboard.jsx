import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AlunoLayout } from '../../components/aluno/AlunoLayout';
import { listarConteudos, listarDisciplinas } from '../../services/disciplinasService';
import api from '../../services/api';
import './AlunoDashboard.css';

// Dados estáticos por enquanto
const ATIVIDADES_RECENTES = [
  { id: 1, titulo: 'Exercícios de Geometria', disciplina: 'Geometria',    status: 'concluida', tempo: '2 dias atrás' },
  { id: 2, titulo: 'Solos e relevos',         disciplina: 'Geomorfologia', status: 'andamento', tempo: 'Ontem' },
];

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

function AtividadeRecenteItem({ atividade }) {
  return (
    <div className="ad-atividade-item">
      <div className={`ad-atividade-icone ad-atividade-icone--${atividade.status}`}>
        {atividade.status === 'concluida'
          ? <CheckCircle size={16} />
          : <Clock size={16} />
        }
      </div>
      <div className="ad-atividade-info">
        <span className="ad-atividade-nome">{atividade.titulo}</span>
        <span className="ad-atividade-disciplina">{atividade.disciplina}</span>
        <div className="ad-atividade-rodape">
          <span className={`ad-atividade-badge ad-atividade-badge--${atividade.status}`}>
            {atividade.status === 'concluida' ? 'Concluída' : 'Em Andamento'}
          </span>
          <span className="ad-atividade-tempo">{atividade.tempo}</span>
        </div>
      </div>
    </div>
  );
}

export function AlunoDashboard() {
  const { user } = useAuth();

  const [stats, setStats]                     = useState({ disciplinasAtivas: null });
  const [conteudosRecentes, setConteudosRecentes] = useState([]);
  const [disciplinas, setDisciplinas]         = useState([]);
  const [loadingStats, setLoadingStats]       = useState(true);
  const [erroStats, setErroStats]             = useState(null);

  const carregar = useCallback(async () => {
    setLoadingStats(true);
    setErroStats(null);
    try {
      const [conteudosRes, disciplinasRes, matriculasRes] = await Promise.all([
        listarConteudos(),
        listarDisciplinas(),
        api.get('/api/matriculas/'),
      ]);

      const conteudos  = Array.isArray(conteudosRes.data)   ? conteudosRes.data   : [];
      const todasDisc  = Array.isArray(disciplinasRes.data) ? disciplinasRes.data : [];
      const matriculas = Array.isArray(matriculasRes.data)  ? matriculasRes.data  : [];

      setStats({ disciplinasAtivas: conteudos.length });
      setDisciplinas(todasDisc);

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
    <AlunoLayout>
      <div className="gs-topbar">
        <h1 className="gs-page-title">Dashboard do Aluno</h1>
        <p className="gs-page-subtitle">
          Bem-vindo de volta, {user?.nome?.split(' ')[0] || 'Aluno'}! Aqui está um resumo das suas atividades.
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
          label="Tarefas em andamento"
          value={5}
          icon={Clock}
          color="#C46A3C"
          loading={false}
        />
        <StatCard
          label="Tarefas Concluídas"
          value={23}
          icon={CheckCircle}
          color="#2F5D62"
          loading={false}
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
          <h2 className="ad-painel-titulo">Atividades Recentes</h2>
          <div className="ad-painel-lista">
            {ATIVIDADES_RECENTES.map(a => (
              <AtividadeRecenteItem key={a.id} atividade={a} />
            ))}
          </div>
        </div>
      </section>
    </AlunoLayout>
  );
}