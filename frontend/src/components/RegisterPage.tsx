import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth-pages.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error during registration");
        return data;
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="btn-muin-back">
          ←
        </Link>
        <h2 className="auth-title">REGISTER</h2>
        <p className="auth-subtitle">JOIN THE CLAN</p>

        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label>YOUR USERNAME</label>
            <input
              type="text"
              className="muin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. shin_obi"
            />
          </div>

          <div className="input-group">
            <label>EMAIL</label>
            <input
              type="email"
              className="muin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@email.com"
            />
          </div>

          <div className="input-group">
            <label>PASSWORD</label>
            <input
              type="password"
              className="muin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="input-group">
            <label>CONFIRM PASSWORD</label>
            <input
              type="password"
              className="muin-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-muin-black-full">
            CREATE ACCOUNT
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link to="/login" className="muin-link">
              LOG IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
