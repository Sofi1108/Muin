import { useState, useEffect } from "react";
import IntranetLayout from "./IntranetLayout";
import "../styles/admin-users.css";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/users", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  const changeRole = (id: number, role: string) => {
    fetch(`http://localhost:3000/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role }),
    }).then(() => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    });
  };

  const toggleStatus = (id: number, active: boolean) => {
    fetch(`http://localhost:3000/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ active: !active }),
    }).then(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: !active } : u)),
      );
    });
  };

  return (
    <IntranetLayout title="Gestión de Usuarios" subtitle="Administra los roles y estados de los usuarios.">
      <div className="work-capsules-page">
        <section className="work-capsules-hero">
          <span className="hero-label">Administración</span>
          <h1>Usuarios</h1>
          <p>Gestiona los permisos y accesos del sistema.</p>
        </section>
        <main className="work-capsules-main">
          <section className="section-card">
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>ID</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Usuario</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Email</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Rol</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem", textAlign: "center" }}>Estado</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ opacity: u.active ? 1 : 0.5, borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.5rem" }}>{u.id}</td>
                    <td style={{ padding: "0.5rem" }}>{u.username}</td>
                    <td style={{ padding: "0.5rem" }}>{u.email}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <select
                        value={u.role || "cliente"}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        style={{ padding: "0.2rem" }}
                      >
                        <option value="cliente">Cliente</option>
                        <option value="empleado">Empleado</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ textAlign: "center", padding: "0.5rem" }}>
                      <span
                        style={{
                          backgroundColor: u.active ? "#e8f5e9" : "#ffebee",
                          color: u.active ? "#2e7d32" : "#c62828",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {u.active ? "Activo" : "Suspendido"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center", padding: "0.5rem" }}>
                      <button 
                        onClick={() => toggleStatus(u.id, u.active)}
                        className="primary-button"
                        style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem" }}
                      >
                        {u.active ? "Suspender" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </IntranetLayout>
  );
}
