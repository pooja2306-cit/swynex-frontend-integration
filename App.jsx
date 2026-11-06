import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyTickets from "./pages/MyTickets";
import NewTicket from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetail";
import AgentQueue from "./pages/AgentQueue";

export default function App() {
  return (
    <div style={{ maxWidth: 700, margin: "20px auto", padding: 16 }}>
      <nav style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <strong>QuickDesk</strong>
        <Link to="/login">Login</Link>
        <Link to="/tickets">My Tickets</Link>
        <Link to="/tickets/new">New Ticket</Link>
        <Link to="/agent/queue">Agent Queue</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<MyTickets />} />
        <Route path="/tickets/new" element={<NewTicket />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/agent/queue" element={<AgentQueue />} />
      </Routes>
    </div>
  );
}