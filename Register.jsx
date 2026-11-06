import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="card auth-card">
      <h2>Create your account</h2>
      {success && (
        <div className="alert alert-success">
          Registered successfully! You can now <Link to="/login">log in</Link>.
        </div>
      )}
      <form className="form" onSubmit={handleSubmit}>
        <label>Full name</label>
        <input type="text" placeholder="Your name" value={name}
          onChange={(e) => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" placeholder="you@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" placeholder="Create a password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn" type="submit">Register</button>
      </form>
      <p className="auth-footer">Already registered? <Link to="/login">Log in</Link></p>
    </div>
  );
}