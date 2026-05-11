//--PENDIENTE DE CSS --PENDIENTE DE AÑADIR A LA PAGINA

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext.tsx";

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
      body: JSON.stringify({ identifier, password }),
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
    <div className="auth-page">
      <h2>Log In here</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleLogin} className="auth-form">
        <div>
          <label>Mail or Username:</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Log in
        </button>
      </form>
      <p className="auth-footer">
        Don't have an account? <Link to="/register">Register now</Link>
      </p>
    </div>
  );
}
