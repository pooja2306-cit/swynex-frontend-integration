import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api/tickets";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTickets(await getTickets());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">My Tickets</h2>
        <Link className="btn" to="/tickets/new">+ New Ticket</Link>
      </div>

      {loading && <Loading text="Loading tickets..." />}
      {error && <ErrorMessage error={error} onRetry={load} />}

      {!loading && !error && tickets.length === 0 && (
        <div className="card empty">
          No tickets yet. <Link to="/tickets/new">Create your first ticket</Link>
        </div>
      )}

      {!loading && !error && tickets.map((t) => (
        <div className="card ticket-card" key={t.id}>
          <div>
            <h3><Link to={`/tickets/${t.id}`}>{t.title}</Link></h3>
            <p>{t.description}</p>
          </div>
          <div>
            <span className={`badge status-${t.status}`}>{t.status.replace("_", " ")}</span>
            <span className={`badge priority-${t.priority}`}>{t.priority}</span>
          </div>
        </div>
      ))}
    </div>
  );
}