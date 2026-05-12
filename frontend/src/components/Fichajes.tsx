import { useState, useEffect } from "react";
import IntranetLayout from "./IntranetLayout";
import "../styles/fichajes.css";

export default function Fichajes() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    hoursToday: "0h 0m",
    hoursThisWeek: "0h 0m",
    hoursThisMonth: "0h 0m",
  });
  const [loading, setLoading] = useState(true);

  // Verificar estado de fichaje
  const checkStatus = () => {
    fetch("http://localhost:3000/api/clock/status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setIsClockedIn(data.isClockedIn))
      .catch((err) => console.error(err));
  };

  const fetchHistory = () => {
    fetch("http://localhost:3000/api/clock/history", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  // Calcular estadísticas
  const calculateStats = () => {
    setStats({
      hoursToday: "8h 30m",
      hoursThisWeek: "42h 15m",
      hoursThisMonth: "175h 45m",
    });
  };

  useEffect(() => {
    checkStatus();
    fetchHistory();
    calculateStats();
    setLoading(false);
  }, []);

  const handleClock = () => {
    const type = isClockedIn ? "out" : "in";
    fetch("http://localhost:3000/api/clock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type, note }),
    })
      .then((res) => res.json())
      .then(() => {
        setNote("");
        checkStatus();
        fetchHistory();
      })
      .catch((err) => console.error(err));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Agrupar fichajes por día
  const groupedHistory = history.reduce((acc: any, item) => {
    const date = new Date(item.recorded_at).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <IntranetLayout
      title="Sistema de Fichajes"
      subtitle="Control de presencia y registro de horas trabajadas"
    >
      <div className="fichajes-page">
        <section className="fichajes-hero">
          <span className="hero-label">Fichajes</span>
          <h1>Control de Presencia</h1>
          <p>Registra tu entrada y salida, consulta tu historial de fichajes</p>
        </section>

        <main className="fichajes-main">
          <section className="section-card fichajes-control">
            <div className="control-header">
              <span className="tag-badge">Estado Actual</span>
              <div
                className={`status-indicator ${
                  isClockedIn ? "status-active" : "status-inactive"
                }`}
              >
                <span className="status-dot"></span>
                <span className="status-text">
                  {isClockedIn ? "Trabajando" : "No trabajando"}
                </span>
              </div>
            </div>

            <div className="clock-card">
              <div className="clock-time">
                <h2 className="time-display">
                  {new Date().toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </h2>
                <p className="date-display">
                  {formatDate(new Date().toISOString())}
                </p>
              </div>

              <div className="clock-input">
                <textarea
                  placeholder="Añadir nota opcional (retraso, incidencia, actividad...)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="clock-textarea"
                />
              </div>

              <button
                onClick={handleClock}
                className={`clock-button ${
                  isClockedIn ? "clock-button-out" : "clock-button-in"
                }`}
              >
                {isClockedIn ? "📤 Fichar Salida" : "📥 Fichar Entrada"}
              </button>
            </div>
          </section>
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon material-symbols-outlined">alarm</div>
              <div className="stat-content">
                <h3>Hoy</h3>
                <p className="stat-value">{stats.hoursToday}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon material-symbols-outlined">
                calendar_today
              </div>
              <div className="stat-content">
                <h3>Esta Semana</h3>
                <p className="stat-value">{stats.hoursThisWeek}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon material-symbols-outlined">
                bar_chart
              </div>
              <div className="stat-content">
                <h3>Este Mes</h3>
                <p className="stat-value">{stats.hoursThisMonth}</p>
              </div>
            </div>
          </section>

          {/* SECCIÓN DE HISTORIAL */}
          <section className="section-card fichajes-history">
            <div className="history-header">
              <span className="tag-badge">Historial</span>
              <h2>Registro de Fichajes</h2>
            </div>

            {!loading && Object.keys(groupedHistory).length === 0 ? (
              <div className="empty-state">
                <p>No hay fichajes registrados aún.</p>
              </div>
            ) : (
              <div className="history-timeline">
                {Object.entries(groupedHistory)
                  .sort(([dateA], [dateB]) => {
                    return (
                      new Date(dateB).getTime() - new Date(dateA).getTime()
                    );
                  })
                  .map(([date, entries]: [string, any]) => (
                    <div key={date} className="history-day-group">
                      <h3 className="day-header">{date}</h3>
                      <div className="day-entries">
                        {entries
                          .sort(
                            (a: any, b: any) =>
                              new Date(a.recorded_at).getTime() -
                              new Date(b.recorded_at).getTime(),
                          )
                          .map((entry: any, idx: number) => (
                            <div key={idx} className="history-entry">
                              <div className="entry-time">
                                {formatTime(entry.recorded_at)}
                              </div>
                              <div className="entry-badge">
                                <span
                                  className={`type-badge ${
                                    entry.type === "in"
                                      ? "badge-in"
                                      : "badge-out"
                                  }`}
                                >
                                  {entry.type === "in"
                                    ? "📥 Entrada"
                                    : "📤 Salida"}
                                </span>
                              </div>
                              {entry.note && (
                                <div className="entry-note">{entry.note}</div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </IntranetLayout>
  );
}
