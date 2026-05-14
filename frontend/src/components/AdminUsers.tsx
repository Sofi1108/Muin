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
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>ID</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Usuario</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem", textAlign: "left" }}>Email</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem", textAlign: "center" }}>Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.5rem", textAlign: "left" }}>{u.id}</td>
                    <td style={{ padding: "0.5rem", textAlign: "left" }}>{u.username}</td>
                    <td style={{ padding: "0.5rem", textAlign: "left" }}>{u.email}</td>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>
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
