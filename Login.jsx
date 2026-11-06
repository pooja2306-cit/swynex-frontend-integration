import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => navigate("/tickets"), 1000);
  };

  return (
    <div className="card auth-card">
      <h2>Welcome back</h2>
      {success && <div className="alert alert-success">Logged in successfully! Redirecting...</div>}
      <form className="form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" placeholder="Enter your password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn" type="submit">Log in</button>
      </form>
      <p className="auth-footer">No account? <Link to="/register">Register</Link></p>
    </div>
  );
}