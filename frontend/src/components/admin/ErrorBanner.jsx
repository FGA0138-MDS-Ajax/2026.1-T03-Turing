import './admin.css';

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="gs-error-banner" role="alert">
      <span>⚠ {message}</span>
      {onRetry && (
        <button className="gs-error-retry" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}