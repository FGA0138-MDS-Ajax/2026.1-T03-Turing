import './admin.css';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBanner } from './ErrorBanner';

function ActivityAvatar({ name, type }) {
  const initials = (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const colors = {
    professor: '#C45C2E',
    aluno: '#6B8E6B',
    sistema: '#5A7A9A',
    default: '#8B7355',
  };

  const bg = colors[type] || colors.default;

  return (
    <div className="gs-activity-avatar" style={{ background: colors[type] || colors.default }}>
      {initials}
    </div>
  );
}

function StatusBadge({ subject }) {
  if (!subject) return null;
  const cor = subject.includes('Pendente')
    ? { bg: 'var(--gs-pendent-bg)', color: 'var(--gs-pendent-text)' }
    : subject.includes('análise')
    ? { bg: 'var(--gs-analise-bg)', color: 'var(--gs-analise-text)' }
    : { bg: 'var(--gs-recusado-bg)', color: 'var(--gs-recusado-text)' };

  return (
    <span
      className="gs-activity-badge"
      style={{ background: cor.bg, color: cor.color }}
    >
      {subject.replace(/^[^ ]+ /, '')}
    </span>
  );
}

export function RecentActivity({ items = [], loading, error }) {
  return (
    <section className="gs-activity-card">
      <div className="gs-activity-header">
        <h2 className="gs-activity-title">Denúncias</h2>
          {items.length > 0 && (
          <span className="gs-activity-count">{items.length} registro{items.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {loading && <LoadingSpinner />}
      <ErrorBanner message={error} />

      {!loading && !error && items.length === 0 && (
        <p className="gs-activity-empty">Nenhuma denúncia registrada.</p>
      )}

      <ul className="gs-activity-list">
        {items.map((item) => (
          <li key={item.id} className="gs-activity-item">
            <ActivityAvatar name={item.actor} type={item.type} />
            <div className="gs-activity-info">
              <span className="gs-activity-actor">{item.actor}</span>
              <span className="gs-activity-desc">{item.description}</span>
            </div>
            <div className="gs-activity-right">
              <StatusBadge subject={item.subject} />
              <span className="gs-activity-time">{item.timeAgo}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}