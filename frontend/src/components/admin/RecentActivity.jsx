import './admin.css';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBanner } from './ErrorBanner';

function ActivityAvatar({ name, type }) {
  const initials = name
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
    <div className="gs-activity-avatar" style={{ background: bg }}>
      {initials}
    </div>
  );
}

export function RecentActivity({ items = [], loading, error }) {
  return (
    <section className="gs-activity-card">
      <h2 className="gs-activity-title">Atividades Recentes</h2>

      {loading && <LoadingSpinner />}
      <ErrorBanner message={error} />

      {!loading && !error && items.length === 0 && (
        <p className="gs-activity-empty">Nenhuma atividade recente.</p>
      )}

      <ul className="gs-activity-list">
        {items.map((item) => (
          <li key={item.id} className="gs-activity-item">
            <ActivityAvatar name={item.actor} type={item.type} />
            <div className="gs-activity-info">
              <span className="gs-activity-actor">{item.actor}</span>
              <span className="gs-activity-desc">{item.description}</span>
              <span className="gs-activity-sub">{item.subject}</span>
            </div>
            <span className="gs-activity-time">{item.timeAgo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}