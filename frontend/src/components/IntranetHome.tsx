import { useUser } from "../context/UserContext";
import IntranetLayout from "./IntranetLayout";
import "../styles/intranet-home.css";

const IntranetHome = () => {
  const { customer } = useUser();

  const scheduleData = [
    { time: "08:00 AM", activity: "Reunión de Equipo", role: "admin" },
    {
      time: "09:00 AM",
      activity: "Atención al Cliente - Turno 1",
      role: "employee",
    },
    { time: "10:00 AM", activity: "Revisión de Producto", role: "admin" },
    { time: "12:00 PM", activity: "Pausa para Almuerzo", role: "employee" },
    { time: "03:00 PM", activity: "Actualización de Proyectos", role: "admin" },
  ];

  const holidaysData = [
    {
      name: "Festivo Local",
      description: "Día de la comunidad y descanso local.",
    },
    {
      name: "Festivo Nacional",
      description: "Festividad nacional obligatoria.",
    },
  ];

  const generateCalendar = () => {
    const days = [];
    for (let i = 0; i < 3; i++) days.push(null);
    for (let i = 1; i <= 31; i++) days.push(i);
    return days;
  };

  const filteredSchedule = scheduleData.filter(
    (e) => customer?.role === "admin" || e.role === "employee",
  );

  return (
    <IntranetLayout
      title="Área de Empleados"
      subtitle="Gestión de horarios, eventos y calendario laboral."
    >
      <div className="work-capsules-page">
        {/* SECCIÓN HERO */}
        <section className="work-capsules-hero">
          <span className="hero-label">Inicio</span>
          <h1>Bienvenido, {customer?.email?.split("@")[0] || "Usuario"}</h1>
          <p>
            Consulta tu horario semanal y los próximos días festivos de la
            empresa.
          </p>
        </section>

        <main className="work-capsules-main">
          {/* SECCIÓN DE HORARIOS */}
          <section className="section-card">
            <span className="tag-badge">Horarios</span>
            <div className="schedule-header">
              <h2>Horario Semanal</h2>
              <span className="schedule-info">Personal Muin</span>
            </div>
            <div className="schedule-table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Actividad</th>
                    {customer?.role === "admin" && <th>Rol</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.map((entry, i) => (
                    <tr key={i}>
                      <td className="time-cell">{entry.time}</td>
                      <td>{entry.activity}</td>
                      {customer?.role === "admin" && (
                        <td>
                          <span className={`role-badge ${entry.role}`}>
                            {entry.role === "admin"
                              ? "Administrador"
                              : "Empleado"}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CUADRÍCULA DE CALENDARIO Y FESTIVOS */}
          <div className="grid-two">
            <section className="section-card">
              <span className="tag-badge">Calendario</span>
              <h2>Calendario de Festivos</h2>
              <div className="calendar-widget">
                <div className="calendar-header-nav">
                  <button className="nav-button">←</button>
                  <h4>Mayo 2026</h4>
                  <button className="nav-button">→</button>
                </div>
                <div className="calendar-grid">
                  {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
                    <div className="weekday" key={d}>
                      {d}
                    </div>
                  ))}
                  {generateCalendar().map((day, i) => (
                    <div
                      key={i}
                      className={`calendar-day ${!day ? "empty" : ""} ${day === 25 ? "holiday" : ""}`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="section-card">
              <span className="tag-badge">Festivos</span>
              <h2>Próximos Festivos</h2>
              <ul className="rule-list">
                {holidaysData.map((h, i) => (
                  <li key={i} className="rule-item">
                    <span>
                      <strong>{h.name}</strong>
                      {h.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </IntranetLayout>
  );
};

export default IntranetHome;
