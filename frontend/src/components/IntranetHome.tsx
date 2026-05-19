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

  const isHoliday = (day: number | null) => {
    if (!day) return false;
    const holidays: Record<number, number[]> = {
      7: [15],      // Agosto (7) -> 15
      9: [12],      // Octubre (9) -> 12
      10: [2],      // Noviembre (10) -> 2
      11: [7, 8, 25] // Diciembre (11) -> 7, 8, 25
    };
    return holidays[currentMonth]?.includes(day) || false;
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
          <span className="hero-label">PORTAL</span>
          <h1>Panel de Inicio</h1>
          <p>
            Bienvenido al portal interno de la intranet de Muin. Aquí tienes tu horario y las novedades de la empresa.
          </p>
        </section>

        <main className="work-capsules-main">
          {/* HORARIO */}
          <section className="section-card">
            <span className="tag-badge">Horario</span>
            <h2>Horario Semanal</h2>
            <div className="schedule-table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Actividad / Tarea</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.map((item, index) => (
                    <tr key={index}>
                      <td className="time-cell">{item.time}</td>
                      <td>{item.activity}</td>
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
                    const isHolidayDay = isHoliday(day);
                    const isSundayDay = day && i % 7 === 0;

                    const classes = [
                      "calendar-day",
                      !day ? "empty" : "",
                      isToday ? "today" : "",
                      isSundayDay ? "sunday" : "",
                      isHolidayDay ? "holiday" : ""
                    ].filter(Boolean).join(" ");

                    return (
                      <div key={i} className={classes}>
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
