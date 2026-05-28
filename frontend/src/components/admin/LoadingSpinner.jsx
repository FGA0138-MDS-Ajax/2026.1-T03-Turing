import './admin.css';

export function LoadingSpinner({ size = 32 }) {
  return (
    <div className="gs-spinner-wrap">
      <div
        className="gs-spinner"
        style={{ width: size, height: size }}
        role="status"
        aria-label="Carregando"
      />
    </div>
  );
}