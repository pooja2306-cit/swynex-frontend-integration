export default function ErrorMessage({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className="alert alert-error">
      <strong>{error.message}</strong>
      {error.details && error.details.length > 0 && (
        <ul>
          {error.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      {onRetry && (
        <div>
          <button className="btn btn-small" onClick={onRetry}>Try again</button>
        </div>
      )}
    </div>
  );
}