import { BookOpen, FileText, Bell, Settings } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProfessorLayout } from '../../components/professor/ProfessorLayout';
import api from '../../services/api';
import './ProfessorDashboard.css';

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
    <div className="prof-stat-card">
      <div className="prof-stat-info">
        <span className="prof-stat-label">{label}</span>
        <span className="prof-stat-value">
          {loading ? <span className="prof-stat-skeleton" /> : value}
        </span>
      </div>
      <div className="prof-stat-icon" style={{ background: color }}>
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
        <span className="prof-atividade-disciplina">{disciplina}</span>
      </div>
    </div>
  );
}

function DuvidaItem({ aluno, titulo, disciplina, tempo, respondida }) {
  return (
    <div className="prof-duvida-item">
      <div className="prof-duvida-info">
        <span className="prof-duvida-aluno">{aluno}</span>
        <span className="prof-duvida-titulo">{titulo}</span>
        <span className="prof-duvida-meta">{disciplina} • {tempo}</span>
      </div>
      <span className={`prof-duvida-badge ${respondida ? 'prof-duvida-badge--respondida' : ''}`}>
        {respondida ? '✓ Respondida' : 'Responder'}
      </span>
    </div>
  );
}

export function ProfessorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({ conteudosAtivos: null, atividadesCriadas: null });
  const [loadingStats, setLoadingStats] = useState(true);
  const [erroStats, setErroStats] = useState(null);

  const iniciais = user?.nome
    ? user.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'P';

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    setErroStats(null);
    try {
      const [conteudosRes, materiaisRes] = await Promise.all([
        api.get('/api/disciplinas/conteudos/'),
        api.get('/api/disciplinas/materiais/'),
      ]);

      const conteudos = Array.isArray(conteudosRes.data) ? conteudosRes.data : [];
      const materiais = Array.isArray(materiaisRes.data) ? materiaisRes.data : [];

      const conteudosDoProfessor = conteudos.filter((c) =>
        Array.isArray(c.professores) && c.professores.some(
          (p) => p === user?.user_id || p?.id === user?.user_id
        )
      );

      setStats({
        conteudosAtivos: conteudosDoProfessor.filter((c) => c.status === 'ativo').length,
        atividadesCriadas: materiais.length,
      });
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
      <header className="gs-topbar">
        <div>
          <h1 className="gs-page-title">Dashboard do Professor</h1>
          <p className="gs-page-subtitle">Gerencie seus conteúdos e materiais</p>
        </div>
        <div className="gs-topbar-right">
          <button className="gs-icon-btn" aria-label="Notificações">
            <Bell size={18} />
          </button>
          <button className="gs-icon-btn" aria-label="Configurações">
            <Settings size={18} />
          </button>
          <div className="gs-topbar-user">
            <div className="gs-topbar-avatar">{iniciais}</div>
            <div>
              <p className="gs-topbar-name">{user?.nome ?? 'professor'}</p>
              <p className="gs-topbar-role">Professor</p>
            </div>
          </div>
        </div>
      </header>


      {erroStats && (
        <div className="prof-erro-banner">{erroStats}</div>
      )}


      <section className="prof-stats-grid">
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

      <section className="prof-panels">

        <div className="prof-panel">
          <h2 className="prof-panel-title">Atividades recentes</h2>
          <div className="prof-panel-list">
            {ATIVIDADES_RECENTES.map((item) => (
              <AtividadeItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        <div className="prof-panel">
          <h2 className="prof-panel-title">Dúvidas recentes</h2>
          <div className="prof-panel-list">''
            {DUVIDAS_RECENTES.map((item) => (
              <DuvidaItem key={item.id} {...item} />
            ))}
          </div>
        </div>

      </section>
    </ProfessorLayout>
  );
}