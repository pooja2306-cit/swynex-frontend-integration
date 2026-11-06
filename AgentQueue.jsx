import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../api/tickets";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function AgentQueue() {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTickets(await getTickets({ status, priority }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [status, priority]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h2 className="page-title">Agent Queue</h2>

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {loading && <Loading text="Loading tickets..." />}
      {error && <ErrorMessage error={error} onRetry={load} />}

      {!loading && !error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Created</th></tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan="5" className="empty">No tickets match these filters.</td></tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id}>
                    <td>#{t.id}</td>
                    <td><Link to={`/tickets/${t.id}`}>{t.title}</Link></td>
                    <td><span className={`badge status-${t.status}`}>{t.status.replace("_", " ")}</span></td>
                    <td><span className={`badge priority-${t.priority}`}>{t.priority}</span></td>
                    <td>{t.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}