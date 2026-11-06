import { useState } from "react";
import { Link } from "react-router-dom";
import { createTicket } from "../api/tickets";
import ErrorMessage from "../components/ErrorMessage";

export default function NewTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setCreated(null);
    try {
      const ticket = await createTicket({ title, description, priority });
      setCreated(ticket);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card auth-card" style={{ maxWidth: 560 }}>
      <h2>Create a new ticket</h2>

      {created && (
        <div className="alert alert-success">
          Ticket #{created.id} created successfully!{" "}
          <Link to={`/tickets/${created.id}`}>View ticket</Link>
        </div>
      )}
      <ErrorMessage error={error} />

      <form className="form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" placeholder="Short summary of the issue" value={title}
          onChange={(e) => setTitle(e.target.value)} disabled={submitting} />
        <label>Description</label>
        <textarea rows="5" placeholder="Describe your issue in detail" value={description}
          onChange={(e) => setDescription(e.target.value)} disabled={submitting} />
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} disabled={submitting}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit ticket"}
        </button>
      </form>
    </div>
  );
}