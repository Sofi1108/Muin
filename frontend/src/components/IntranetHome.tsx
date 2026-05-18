import { useState } from "react";
import { useUser } from "../context/UserContext";
import IntranetLayout from "./IntranetLayout";
import "../styles/intranet-home.css";

const IntranetHome = () => {
  const { customer } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const currentMonthName = monthNames[currentMonth];

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const scheduleData = [
    { time: "08:00 AM", activity: "Apertura de Tienda y Briefing", role: "admin" },
    { time: "09:00 AM", activity: "Gestión de Pedidos Online", role: "empleado" },
    { time: "10:30 AM", activity: "Reunión Estratégica Mensual", role: "admin" },
    { time: "11:30 AM", activity: "Recepción de Mercancía", role: "empleado" },
    { time: "01:30 PM", activity: "Pausa para Almuerzo", role: "empleado" },
    { time: "03:00 PM", activity: "Control de Inventario y Calidad", role: "admin" },
    { time: "04:30 PM", activity: "Atención al Cliente Premium", role: "empleado" },
    { time: "06:00 PM", activity: "Cierre de Caja y Reportes", role: "admin" },
  ];

  const holidaysData = [
    {
      name: "15 de Agosto",
      description: "Asunción de la Virgen (Festivo Nacional).",
    },
    {
      name: "12 de Octubre",
      description: "Fiesta Nacional de España.",
    },
    {
      name: "2 de Noviembre",
      description: "Traslado de Todos los Santos.",
    },
    {
      name: "7 de Diciembre",
      description: "Traslado del Día de la Constitución.",
    },
    {
      name: "8 de Diciembre",
      description: "Inmaculada Concepción.",
    },
    {
      name: "25 de Diciembre",
      description: "Natividad del Señor.",
    },
  ];

  const generateCalendar = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const todayDate = today.getDate();

  const filteredSchedule = scheduleData.filter(
    (e) => customer?.role === "admin" || e.role === "empleado",
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
          <h1>Panel Principal</h1>
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
                  <button className="nav-button" onClick={prevMonth}>←</button>
                  <h4>{currentMonthName} {currentYear}</h4>
                  <button className="nav-button" onClick={nextMonth}>→</button>
                </div>
                <div className="calendar-grid">
                  {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
                    <div className="weekday" key={d}>
                      {d}
                    </div>
                  ))}
                  {generateCalendar().map((day, i) => {
                    const isToday = day && isCurrentMonth && day === todayDate;
                    return (
                      <div
                        key={i}
                        className={`calendar-day ${!day ? "empty" : ""} ${isToday ? "today" : ""}`}
                      >
                        {day}
                      </div>
                    );
                  })}
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
