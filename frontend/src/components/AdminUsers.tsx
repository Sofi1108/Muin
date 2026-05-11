import { useState, useEffect } from "react";
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
    <div className="admin-section">
      <h2>Gestión de Usuarios</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th style={{ textAlign: "center" }}>Estado</th>
            <th style={{ textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ opacity: u.active ? 1 : 0.5 }}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role || "cliente"}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  <option value="cliente">Cliente</option>
                  <option value="empleado">Empleado</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td style={{ textAlign: "center" }}>
                <span
                  className={u.active ? "status-active" : "status-suspended"}
                >
                  {u.active ? "Activo" : "Suspendido"}
                </span>
              </td>
              <td style={{ textAlign: "center" }}>
                <button onClick={() => toggleStatus(u.id, u.active)}>
                  {u.active ? "Suspender" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
