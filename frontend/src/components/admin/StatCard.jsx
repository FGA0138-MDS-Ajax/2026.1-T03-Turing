import './admin.css';

export function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="gs-stat-card">
      <div className="gs-stat-icon" style={{ background: color }}>
        <Icon size={22} color="#fff" />
      </div>
      <p className="gs-stat-label">{label}</p>
      <p className="gs-stat-value">{value?.toLocaleString('pt-BR') ?? '—'}</p>
    </div>
  );
}