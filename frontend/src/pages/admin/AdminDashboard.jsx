import { Users, GraduationCap, BookOpen, Layers, FileText, Bell, Settings } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { RecentActivity } from '../../components/admin/RecentActivity';
import { LoadingSpinner } from '../../components/admin/LoadingSpinner';
import { ErrorBanner } from '../../components/admin/ErrorBanner';
import { useAdminContext } from '../../context/AdminContext';
import { useAdminStats } from '../../hooks/useAdminStats';
import { useRecentActivity } from '../../hooks/useRecentActivity';
import { useAuth } from '../../context/AuthContext';
import '../../components/admin/admin.css';

const STAT_CONFIG = [
  {
    key: 'totalUsuarios',
    label: 'Total de Usuários',
    icon: Users,
    color: '#C45C2E',
  },
  {
    key: 'professoresAtivos',
    label: 'Professores Ativos',
    icon: GraduationCap,
    color: '#D4722A',
  },
  {
    key: 'alunosMatriculados',
    label: 'Alunos Matriculados',
    icon: BookOpen,
    color: '#C06030',
  },
  {
    key: 'disciplinasAtivas',
    label: 'Disciplinas Ativas',
    icon: Layers,
    color: '#7A5C3A',
  },
  {
    key: 'conteudosAtivos',
    label: 'Conteúdos Ativos',
    icon: FileText,
    color: '#6B5040',
  },
];

export function AdminDashboard() {
  const { user } = useAuth();
  const {
    stats,
    activity,
    loadingStats,
    loadingActivity,
    errorStats,
    errorActivity,
  } = useAdminContext();

  useAdminStats();
  useRecentActivity();

  return (
    <AdminLayout>
       <div className="gs-topbar">
        <h1 className="gs-page-title">Dashboard do Administrador</h1>
        <p className="gs-page-subtitle">
          Visão geral do sistema
        </p>
      </div>


      <section className="gs-stats-section">
        {loadingStats ? (
          <LoadingSpinner />
        ) : (
          <>
            <ErrorBanner message={errorStats} />
            <div className="gs-stats-grid">
              {STAT_CONFIG.map(({ key, label, icon, color }) => (
                <StatCard
                  key={key}
                  label={label}
                  value={stats?.[key]}
                  icon={icon}
                  color={color}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <RecentActivity
        items={activity}
        loading={loadingActivity}
        error={errorActivity}
      />
    </AdminLayout>
  );
}