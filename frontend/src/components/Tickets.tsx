import React, { useEffect, useState } from "react";
import IntranetLayout from "./IntranetLayout";
import "../styles/ticket-form.css";

interface Ticket {
  id: number;
  assignedTo: number;
  description: string;
  email: string;
  status: string;
}

interface User {
  id: number;
  role: string;
}

const Tickets: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Fetch current user
  useEffect(() => {
    fetch("http://localhost:3000/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.customer))
      .catch(console.error);
  }, []);

  // Fetch user's tickets
  const loadTickets = () => {
    fetch("http://localhost:3000/api/tickets/my", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTickets(data);
        } else {
          console.error("Backend did not return an array:", data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (user) loadTickets();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedToId || !description || !email) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ assignedToId: Number(assignedToId), description, email }),
      });
      if (!res.ok) throw new Error("Error al crear ticket");
      setAssignedToId("");
      setDescription("");
      setEmail("");
      loadTickets();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Error al actualizar estado");
      loadTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <IntranetLayout title="Tickets (Incidencias)" subtitle="Reporta y gestiona incidencias laborales.">
      <div className="work-capsules-page">
        <section className="work-capsules-hero">
          <span className="hero-label">Tickets</span>
          <h1>Incidencias</h1>
          <p>{user?.role === "cliente" ? "Visualiza tus incidencias." : "Reporta una nueva incidencia."}</p>
        </section>
        <main className="work-capsules-main">
          {user && user.role !== "cliente" && (
            <section className="section-card">
              <h2>Crear Incidencia</h2>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form onSubmit={handleSubmit} className="ticket-form">
                <label>
                  ID del empleado/administrador asignado:
                  <input
                    type="number"
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Descripción de la incidencia:
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                  />
                </label>
                <label>
                  Tu correo electrónico:
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <button type="submit" className="primary-button" style={{ width: "fit-content" }}>
                  Enviar
                </button>
              </form>
            </section>
          )}
          <section className="section-card" style={{ marginTop: user?.role === "cliente" ? "0" : "2rem" }}>
            <h2>Mis Incidencias</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ccc" }}>ID</th>
                  <th style={{ borderBottom: "1px solid #ccc" }}>Asignado a</th>
                  <th style={{ borderBottom: "1px solid #ccc" }}>Descripción</th>
                  <th style={{ borderBottom: "1px solid #ccc" }}>Correo</th>
                  <th style={{ borderBottom: "1px solid #ccc" }}>Estado</th>
                  {user && <th style={{ borderBottom: "1px solid #ccc" }}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.assignedTo}</td>
                    <td>{t.description}</td>
                    <td>{t.email}</td>
                    <td>
                      {t.status === "en curso" ? "En Curso" : 
                       t.status === "resuelto" ? "Resuelto" : 
                       t.status === "cerrado" ? "Cerrado" : 
                       t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </td>
                    {user && (
                      <td>
                        {t.assignedTo === user.id && (
                          <select
                            value={t.status}
                            onChange={(e) => handleStatusChange(t.id, e.target.value)}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en curso">En Curso</option>
                            <option value="resuelto">Resuelto</option>
                            <option value="cerrado">Cerrado</option>
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </IntranetLayout>
  );
};

export default Tickets;