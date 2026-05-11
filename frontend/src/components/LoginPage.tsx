import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext.tsx";
import "../styles/auth-pages.css";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setCustomer } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ identifier, Contrasena: password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
        return data;
      })
      .then((data) => {
        setCustomer(data.customer);
        navigate("/");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">LOG IN</h2>
        <p className="auth-subtitle">ENTER YOUR NINDO</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>MAIL OR USERNAME</label>
            <input
              type="text"
              className="muin-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="e.g. naruto_uzumaki"
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

          <button type="submit" className="btn-muin-black-full">
            SIGN IN
          </button>
        </form>

        <div className="auth-footer">
          <p>
            DON'T HAVE AN ACCOUNT?{" "}
            <Link to="/register" className="muin-link">
              REGISTER NOW
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
