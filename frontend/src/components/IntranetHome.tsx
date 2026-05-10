import { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/intranet-home.css";

interface ScheduleEntry {
  time: string;
  activity: string;
  role: "admin" | "employee"; // admin puede ver ambos, employee solo employee
}

const IntranetHome = () => {
  const { customer } = useUser();

  // Enlace del video - puedes cambiar esto en el código
  const VIDEO_URL = "https://www.youtube.com/embed/placeholder";

  // Datos de ejemplo del horario
  // Puedes reemplazar esto con una llamada a API
  const scheduleData: ScheduleEntry[] = [
    { time: "08:00 AM", activity: "Team Standup", role: "admin" },
    { time: "09:00 AM", activity: "Customer Support - Shift 1", role: "employee" },
    { time: "10:00 AM", activity: "Product Review Meeting", role: "admin" },
    { time: "11:00 AM", activity: "Customer Support - Shift 2", role: "employee" },
    { time: "12:00 PM", activity: "Lunch Break", role: "employee" },
    { time: "01:00 PM", activity: "Strategy Planning", role: "admin" },
    { time: "02:00 PM", activity: "Customer Support - Shift 3", role: "employee" },
    { time: "03:00 PM", activity: "Project Updates", role: "admin" },
    { time: "04:00 PM", activity: "Training Session", role: "employee" },
    { time: "05:00 PM", activity: "End of Shift", role: "employee" },
  ];

  // Datos de ejemplo del calendario de vacaciones
  const holidaysData = [
    { date: "2026-05-25", name: "Holiday 1", description: "Holiday description" },
    { date: "2026-06-15", name: "Holiday 2", description: "Holiday description" },
    { date: "2026-07-20", name: "Holiday 3", description: "Holiday description" },
  ];

  // Filtrar horario según rol
  const filteredSchedule = scheduleData.filter((entry) => {
    if (customer?.role === "admin") {
      return true; // Admin ve todo
    }
    return entry.role === "employee"; // Employee solo ve employee
  });

  // Generar calendario simple
  const generateCalendar = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendar();
  const monthName = new Date().toLocaleString("en-US", { month: "long" });
  const year = new Date().getFullYear();

  return (
    <div className="intranet-container">
      <div className="intranet-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Welcome, {customer?.email || "(username)"}</h1>
        </section>

        {/* Video Section */}
        <section className="video-section">
          <div className="video-placeholder">
            <iframe
              width="100%"
              height="350"
              src={VIDEO_URL}
              title="Explanatory video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* Weekly Schedule Section */}
        <section className="schedule-section">
          <div className="schedule-header">
            <h2>Weekly Schedule</h2>
            <span className="schedule-info">
              {customer?.role === "admin" ? "Admin & Employee Schedule" : "Employee Schedule"}
            </span>
          </div>
          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Activity</th>
                  {customer?.role === "admin" && <th>Role</th>}
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((entry, index) => (
                  <tr key={index}>
                    <td className="time-cell">{entry.time}</td>
                    <td className="activity-cell">{entry.activity}</td>
                    {customer?.role === "admin" && (
                      <td className="role-cell">
                        <span className={`role-badge ${entry.role}`}>{entry.role}</span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Holiday Calendar Section */}
        <section className="holiday-section">
          <div className="calendar-container">
            <h3>Holiday calendar</h3>
            <div className="calendar">
              <div className="calendar-header">
                <button type="button" className="nav-button">
                  ←
                </button>
                <h4>
                  {monthName} {year}
                </h4>
                <button type="button" className="nav-button">
                  →
                </button>
              </div>

              <div className="calendar-weekdays">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="calendar-days">
                {calendarDays.map((day, index) => {
                  const isHoliday = holidaysData.some(
                    (h) =>
                      h.date ===
                      `${year}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  );
                  return (
                    <div
                      key={index}
                      className={`calendar-day ${isHoliday ? "holiday" : ""} ${!day ? "empty" : ""}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color normal"></div>
                  <span>Normal day</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color holiday"></div>
                  <span>Holiday</span>
                </div>
              </div>
            </div>
          </div>

          <div className="holidays-list">
            <h3>Upcoming Holidays</h3>
            <ul>
              {holidaysData.map((holiday, index) => (
                <li key={index}>
                  <strong>{holiday.name}</strong>
                  <p>{holiday.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IntranetHome;
