import React, { useEffect, useState } from "react";
import IntranetLayout from "./IntranetLayout";
import { useUser } from "../context/UserContext";
import "../styles/ticket-form.css";

interface Ticket {
  id: number;
  assignedToId: number | null;
  assignedToName?: string;
  assignedToLastName?: string;
  description: string;
  email: string;
  status: string;
  acciones?: string;
}

interface User {
  id: number;
  role: string;
  email: string;
}

const Tickets: React.FC = () => {
  const { customer: user } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  // States to manage inline edits of status and actions for assignee
  const [editedActions, setEditedActions] = useState<Record<number, string>>({});
  const [editedStatuses, setEditedStatuses] = useState<Record<number, string>>({});
  const [saveLoading, setSaveLoading] = useState<Record<number, boolean>>({});

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
    if (user) {
      loadTickets();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedToId || !description || !user?.email) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (Number(assignedToId) < 1) {
      setError("El ID del empleado/administrador asignado debe ser mayor que 0.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ assignedToId: Number(assignedToId), description, email: user.email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear ticket");
      }
      setAssignedToId("");
      setDescription("");
      setError("");
      loadTickets();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSaveActionsAndStatus = async (ticketId: number) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const newStatus = editedStatuses[ticketId] !== undefined ? editedStatuses[ticketId] : ticket.status;
    const newActions = editedActions[ticketId] !== undefined ? editedActions[ticketId] : (ticket.acciones || "");

    setSaveLoading((prev) => ({ ...prev, [ticketId]: true }));
    try {
      const res = await fetch(`http://localhost:3000/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus, acciones: newActions }),
      });
      if (!res.ok) throw new Error("Error al actualizar la incidencia");
      
      // Clear local edits state for this ticket since it has been saved to backend
      setEditedStatuses((prev) => {
        const next = { ...prev };
        delete next[ticketId];
        return next;
      });
      setEditedActions((prev) => {
        const next = { ...prev };
        delete next[ticketId];
        return next;
      });

      loadTickets();
      alert("Incidencia actualizada con éxito.");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la incidencia.");
    } finally {
      setSaveLoading((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  // Helper for badge color styles based on status
  const getBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    let bg = "#e0e0e0";
    let color = "#333";
    if (s === "pendiente") {
      bg = "#ffebee";
      color = "#c62828";
    } else if (s === "en curso") {
      bg = "#e3f2fd";
      color = "#1565c0";
    } else if (s === "resuelto") {
      bg = "#e8f5e9";
      color = "#2e7d32";
    } else if (s === "cerrado") {
      bg = "#efebe9";
      color = "#4e342e";
    }
    return {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "12px",
      backgroundColor: bg,
      color: color,
      fontSize: "12px",
      fontWeight: "bold" as const,
      textTransform: "uppercase" as const
    };
  };

  return (
    <IntranetLayout title="Tickets (Incidencias)" subtitle="Reporta y gestiona incidencias laborales.">
      <div className="work-capsules-page">
        <section className="work-capsules-hero">
          <span className="hero-label">Tickets</span>
          <h1>Incidencias</h1>
          <p>Reporta una nueva incidencia.</p>
        </section>
        <main className="work-capsules-main">
          {user && (
            <section className="section-card">
              <h2>Crear Incidencia</h2>
              {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
              <form onSubmit={handleSubmit} className="ticket-form">
                <label>
                  ID del empleado/administrador asignado:
                  <input
                    type="number"
                    min="1"
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
                <div style={{ marginBottom: "1.2rem" }}>
                  <span style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "var(--text-primary, #000)" }}>
                    Tu correo electrónico:
                  </span>
                  <div style={{ 
                    padding: "10px 14px", 
                    backgroundColor: "#f9f9f9", 
                    border: "1px solid #ddd", 
                    borderRadius: "8px", 
                    color: "#333", 
                    fontWeight: "500",
                    fontSize: "0.95rem",
                    display: "inline-block"
                  }}>
                    {user?.email || "Cargando..."}
                  </div>
                </div>
                <button type="submit" className="primary-button" style={{ width: "fit-content" }}>
                  Enviar
                </button>
              </form>
            </section>
          )}
          <section className="section-card" style={{ marginTop: "2rem" }}>
            <h2>Mis Incidencias</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "10px", textAlign: "left" }}>ID</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Asignado a</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Descripción</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Correo</th>
                  <th style={{ borderBottom: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Estado</th>
                  {user && <th style={{ borderBottom: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px 10px", verticalAlign: "top" }}>{t.id}</td>
                    <td style={{ padding: "12px 10px", verticalAlign: "top", fontWeight: "600" }}>
                      {t.assignedToName
                        ? `${t.assignedToName} ${t.assignedToLastName || ""}`.trim()
                        : "No asignado"}
                    </td>
                    <td style={{ padding: "12px 10px", verticalAlign: "top" }}>{t.description}</td>
                    <td style={{ padding: "12px 10px", verticalAlign: "top" }}>{t.email}</td>
                    <td style={{ padding: "12px 10px", verticalAlign: "top" }}>
                      <span style={getBadgeStyle(t.status)}>
                        {t.status === "en curso" ? "En Curso" : 
                         t.status === "resuelto" ? "Resuelto" : 
                         t.status === "cerrado" ? "Cerrado" : 
                         t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </td>
                    {user && (
                      <td style={{ padding: "12px 10px", verticalAlign: "top", width: "250px" }}>
                        {t.assignedToId === user.id ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <select
                              value={editedStatuses[t.id] !== undefined ? editedStatuses[t.id] : t.status}
                              onChange={(e) => setEditedStatuses((prev) => ({ ...prev, [t.id]: e.target.value }))}
                              style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                backgroundColor: "#fff",
                                color: "#333",
                                cursor: "pointer",
                                outline: "none",
                                width: "100%"
                              }}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="en curso">En Curso</option>
                              <option value="resuelto">Resuelto</option>
                              <option value="cerrado">Cerrado</option>
                            </select>
                            
                            <textarea
                              placeholder="Escribe las acciones realizadas..."
                              value={editedActions[t.id] !== undefined ? editedActions[t.id] : (t.acciones || "")}
                              onChange={(e) => setEditedActions((prev) => ({ ...prev, [t.id]: e.target.value }))}
                              rows={3}
                              style={{
                                padding: "8px 10px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                fontSize: "13px",
                                fontFamily: "inherit",
                                resize: "vertical",
                                outline: "none",
                                width: "100%"
                              }}
                            />
                            
                            <button
                              onClick={() => handleSaveActionsAndStatus(t.id)}
                              disabled={saveLoading[t.id]}
                              style={{
                                alignSelf: "flex-start",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#8b0000",
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "background-color 0.2s"
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#a30000")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#8b0000")}
                            >
                              {saveLoading[t.id] ? "Guardando..." : "Guardar"}
                            </button>
                          </div>
                        ) : (
                          <div style={{ fontSize: "14px", color: "#555", fontStyle: t.acciones ? "normal" : "italic" }}>
                            {t.acciones || "Sin acciones registradas aún"}
                          </div>
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