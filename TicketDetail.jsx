import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTicket, updateTicket, deleteTicket } from "../api/tickets";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTicket(await getTicket(id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (e) => {
    setSaving(true);
    setActionError(null);
    try {
      setTicket(await updateTicket(id, { status: e.target.value }));
    } catch (err) {
      setActionError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this ticket? This cannot be undone.")) return;
    setSaving(true);
    setActionError(null);
    try {
      await deleteTicket(id);
      navigate("/tickets");
    } catch (err) {
      setActionError(err);
      setSaving(false);
    }
  };

  return (
    <div>
      <p><Link to="/tickets">&larr; Back to tickets</Link></p>

      {loading && <Loading text="Loading ticket..." />}
      {error && <ErrorMessage error={error} onRetry={error.status === 404 ? undefined : load} />}

      {!loading && ticket && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>#{ticket.id} {ticket.title}</h2>
          <p>{ticket.description}</p>
          <span className={`badge status-${ticket.status}`}>{ticket.status.replace("_", " ")}</span>
          <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
          <p className="meta">Created: {ticket.createdAt} | Last updated: {ticket.updatedAt}</p>

          <ErrorMessage error={actionError} />

          <div className="row-actions">
            <label htmlFor="status">Status:</label>
            <select id="status" style={{ maxWidth: 200 }} value={ticket.status}
              onChange={handleStatusChange} disabled={saving}>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
              {saving ? "Please wait..." : "Delete ticket"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}