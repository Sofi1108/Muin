import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import IntranetLayout from "./IntranetLayout";
import "../styles/intranet-home.css";

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface CalendarEvent {
  id_evento: number;
  id_usuario: number;
  titulo: string;
  descripcion: string | null;
  fecha_evento: string; // "YYYY-MM-DD"
  hora_evento: string | null; // "HH:MM:SS" o null
  es_publico: boolean;
  autor: string;
}

interface EventFormData {
  titulo: string;
  descripcion: string;
  hora_evento: string;
  es_publico: boolean;
}

const API = "http://localhost:3000";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toDateStr = (year: number, month: number, day: number) => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

const hasEventEnded = (fechaStr: string, horaStr: string | null): boolean => {
  const now = new Date();
  if (horaStr) {
    const [h, m] = horaStr.split(":").map(Number);
    const eventDT = new Date(`${fechaStr}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`);
    return now > eventDT;
  }
  // Sin hora: termina al final del día
  const dayEnd = new Date(`${fechaStr}T23:59:59`);
  return now > dayEnd;
};

const formatHora = (horaStr: string | null) => {
  if (!horaStr) return null;
  const [h, m] = horaStr.split(":");
  return `${h}:${m}`;
};

// ─── Iconos SVG (estética de línea negra, sin emojis) ────────────────────────
const IconGlobe = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="4.5" ry="10" />
    <line x1="2.5" y1="8.5" x2="21.5" y2="8.5" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2.5" y1="15.5" x2="21.5" y2="15.5" />
  </svg>
);

const IconLock = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    <line x1="12" y1="17" x2="12" y2="19" strokeWidth="1.8" />
  </svg>
);

const IconClock = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 15.5 14" />
  </svg>
);

const IconEdit = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconClose = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


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

  // ── Horario (sin cambios) ──────────────────────────────────────────────────
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

  // ── Festivos (sin cambios) ─────────────────────────────────────────────────
  const holidaysData = [
    { name: "15 de Agosto", description: "Asunción de la Virgen (Festivo Nacional)." },
    { name: "12 de Octubre", description: "Fiesta Nacional de España." },
    { name: "2 de Noviembre", description: "Traslado de Todos los Santos." },
    { name: "7 de Diciembre", description: "Traslado del Día de la Constitución." },
    { name: "8 de Diciembre", description: "Inmaculada Concepción." },
    { name: "25 de Diciembre", description: "Natividad del Señor." },
  ];

  // ── generateCalendar (sin cambios) ────────────────────────────────────────
  const generateCalendar = () => {
    const days: (number | null)[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  // ── isHoliday (sin cambios) ────────────────────────────────────────────────
  const isHoliday = (day: number | null) => {
    if (!day) return false;
    const holidays: Record<number, number[]> = {
      7: [15],
      9: [12],
      10: [2],
      11: [7, 8, 25]
    };
    return holidays[currentMonth]?.includes(day) || false;
  };

  const isSunday = (day: number | null) => {
    if (!day) return false;
    return new Date(currentYear, currentMonth, day).getDay() === 0;
  };

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const todayDate = today.getDate();

  const filteredSchedule = scheduleData.filter(
    (e) => customer?.role === "admin" || e.role === "empleado"
  );

  // ── Estado de eventos ──────────────────────────────────────────────────────
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  // selectedDay: día del calendario actualmente abierto (click para abrir, click fuera para cerrar)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // hoveredDay: día del calendario sobre el que está el cursor
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Cerrar tooltip al hacer click fuera del día seleccionado
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectedDay !== null) {
        const target = e.target as HTMLElement;
        if (!target.closest(".calendar-day.selected")) {
          setSelectedDay(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedDay]);

  // Modal de evento
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [modalDay, setModalDay] = useState<number | null>(null);
  const [form, setForm] = useState<EventFormData>({
    titulo: "",
    descripcion: "",
    hora_evento: "",
    es_publico: true,
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  // isDirty: true cuando el usuario ha modificado algún campo del formulario sin guardar
  const [isDirty, setIsDirty] = useState(false);

  // Modal de confirmación de borrado
  const [deleteConfirm, setDeleteConfirm] = useState<CalendarEvent | null>(null);

  // Cargar eventos al montar y al cambiar de mes
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API}/api/calendar/events`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setEvents(data);
    } catch {
      // silencioso
    }
  };

  // Eventos del día X del mes actual
  const eventsForDay = (day: number): CalendarEvent[] => {
    const dateStr = toDateStr(currentYear, currentMonth, day);
    return events.filter((e) => e.fecha_evento.startsWith(dateStr));
  };

  // ── Handlers Modal ─────────────────────────────────────────────────────────
  const openAddModal = (day: number) => {
    if (isHoliday(day) || isSunday(day)) {
      alert("No se pueden añadir eventos en domingos ni días festivos.");
      return;
    }
    setEditingEvent(null);
    setModalDay(day);
    setForm({ titulo: "", descripcion: "", hora_evento: "", es_publico: true });
    setFormError("");
    setIsDirty(false);
    setModalOpen(true);
    setSelectedDay(null); // cerrar tooltip al abrir modal
    setHoveredDay(null);
  };

  const openEditModal = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setModalDay(null);
    setForm({
      titulo: ev.titulo,
      descripcion: ev.descripcion || "",
      hora_evento: ev.hora_evento ? ev.hora_evento.slice(0, 5) : "",
      es_publico: ev.es_publico,
    });
    setFormError("");
    setIsDirty(false);
    setModalOpen(true);
    setSelectedDay(null); // cerrar tooltip al abrir modal
    setHoveredDay(null);
  };

  const closeModal = (force = false) => {
    // Si hay cambios sin guardar, preguntar antes de cerrar
    if (isDirty && !force) {
      if (!window.confirm("Tienes cambios sin guardar. ¿Seguro que quieres cerrar sin guardar?")) {
        return;
      }
    }
    setModalOpen(false);
    setEditingEvent(null);
    setModalDay(null);
    setFormError("");
    setIsDirty(false);
  };

  const handleFormChange = (field: keyof EventFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true); // marcar como modificado
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      setFormError("El título es obligatorio.");
      return;
    }
    if (form.hora_evento) {
      const parts = form.hora_evento.split(":");
      if (parts.length === 2) {
        const h = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
          setFormError("La hora introducida no es válida (los minutos deben estar entre 00 y 59).");
          return;
        }
      } else {
        setFormError("El formato de la hora no es válido.");
        return;
      }
    }
    setSaving(true);
    setFormError("");

    try {
      let fecha: string;
      if (editingEvent) {
        fecha = editingEvent.fecha_evento.slice(0, 10);
      } else {
        fecha = toDateStr(currentYear, currentMonth, modalDay!);
      }

      const body = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        fecha_evento: fecha,
        hora_evento: form.hora_evento || null,
        es_publico: form.es_publico,
      };

      const url = editingEvent
        ? `${API}/api/calendar/events/${editingEvent.id_evento}`
        : `${API}/api/calendar/events`;
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Error al guardar el evento.");
        return;
      }
      setIsDirty(false); // limpiar antes de cerrar para no disparar el confirm
      closeModal(true); // forzar cierre omitiendo la confirmación de cambios sin guardar
      await fetchEvents();
    } catch {
      setFormError("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/calendar/events/${deleteConfirm.id_evento}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error al borrar evento:", res.status, errorData.error || res.statusText);
        alert(`Error al borrar el evento: ${errorData.error || res.statusText}`);
      } else {
        setDeleteConfirm(null);
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error de red al borrar evento:", error);
      alert("Error de conexión al intentar borrar el evento.");
    } finally {
      setSaving(false);
    }
  };

  const canEdit = (ev: CalendarEvent) =>
    ev.id_usuario === (customer as any)?.id;

  const canDelete = (ev: CalendarEvent) =>
    ev.id_usuario === (customer as any)?.id ||
    (customer?.role === "admin" && ev.es_publico === true);

  // ── Render ─────────────────────────────────────────────────────────────────
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
                      <td>
                        <div className="schedule-activity-container">
                          <span className="schedule-activity-text">{item.activity}</span>
                          <span className={`schedule-badge ${item.role}`}>
                            {item.role === "admin" ? "Administrador" : "Empleado"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CUADRÍCULA DE CALENDARIO Y FESTIVOS */}
          <div className="grid-two">
            <section className="section-card calendar-card">
              <span className="tag-badge">Calendario</span>
              <h2>Calendario de Festivos y Eventos</h2>
              <div className="calendar-widget">
                <div className="calendar-header-nav">
                  <button className="nav-button" onClick={prevMonth}>←</button>
                  <h4>{currentMonthName} {currentYear}</h4>
                  <button className="nav-button" onClick={nextMonth}>→</button>
                </div>
                <div className="calendar-grid" ref={calendarRef}>
                  {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
                    <div className="weekday" key={d}>{d}</div>
                  ))}
                  {generateCalendar().map((day, i) => {
                    const isToday = day && isCurrentMonth && day === todayDate;
                    const isHolidayDay = isHoliday(day);
                    const isSundayDay = isSunday(day);
                    const dayEvents = day ? eventsForDay(day) : [];
                    const hasEvents = dayEvents.length > 0;

                    const hoveredDayHasEvents = hoveredDay ? eventsForDay(hoveredDay).length > 0 : false;
                    const isTooltipOpen = !!(day && !modalOpen && !deleteConfirm && (
                      hoveredDay !== null && hoveredDayHasEvents
                        ? hoveredDay === day
                        : selectedDay === day
                    ));
                    const isPreview = !!(day && hoveredDay === day && selectedDay !== day);

                    const classes = [
                      "calendar-day",
                      !day ? "empty" : "",
                      isToday ? "today" : "",
                      isSundayDay ? "sunday" : "",
                      isHolidayDay ? "holiday" : "",
                      hasEvents ? "has-events" : "",
                      isTooltipOpen ? "selected" : "",
                    ].filter(Boolean).join(" ");

                    return (
                      <div
                        key={i}
                        className={classes}
                        onMouseEnter={() => {
                          if (day) setHoveredDay(day);
                        }}
                        onMouseLeave={() => {
                          setHoveredDay(null);
                        }}
                        onClick={() => {
                          if (!day) return;
                          // click en el mismo día abierto → cerrar; click en otro → abrir
                          setSelectedDay((prev) => (prev === day ? null : day));
                        }}
                      >
                        {day}
                        {hasEvents && <span className="event-dot" />}

                        {/* TOOLTIP */}
                        {isTooltipOpen && (
                          <div
                            className="day-tooltip"
                          >
                            <div className="tooltip-header">
                              <span className="tooltip-date">
                                {day} {currentMonthName}
                              </span>
                              {!isPreview && !isHolidayDay && !isSundayDay && (
                                <button
                                  className="tooltip-add-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openAddModal(day);
                                  }}
                                  title="Añadir nuevo evento"
                                >
                                  ＋
                                </button>
                              )}
                            </div>

                            {dayEvents.length === 0 ? (
                              (isHolidayDay || isSundayDay) ? (
                                <div className="tooltip-no-events-notice" style={{ padding: "8px", fontSize: "0.8rem", color: "#64748b", textAlign: "center", fontStyle: "italic" }}>
                                  No hay eventos (festivos y domingos no permiten eventos)
                                </div>
                              ) : (
                                <button
                                  className="tooltip-empty-add"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openAddModal(day);
                                  }}
                                >
                                  ＋ Añadir nuevo evento...
                                </button>
                              )
                            ) : (
                              <ul className="tooltip-event-list">
                                {dayEvents.map((ev) => {
                                  const ended = hasEventEnded(ev.fecha_evento.slice(0, 10), ev.hora_evento);
                                  
                                  if (isPreview) {
                                    return (
                                      <li key={ev.id_evento} className="tooltip-event-item preview-item">
                                        <div className="tei-top" style={{ justifyContent: "flex-start", gap: "6px" }}>
                                          <span className="tei-title" style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap" }}>
                                            {ev.titulo}
                                            {ended && (
                                              <span 
                                                className="preview-clock-icon" 
                                                style={{ 
                                                  marginLeft: "6px", 
                                                  display: "inline-flex", 
                                                  alignItems: "center", 
                                                  color: "#dc2626", 
                                                  verticalAlign: "middle" 
                                                }} 
                                                title="El evento ha terminado"
                                              >
                                                <IconClock size={13} />
                                              </span>
                                            )}
                                          </span>
                                        </div>
                                      </li>
                                    );
                                  }

                                  return (
                                    <li key={ev.id_evento} className="tooltip-event-item">
                                      <div className="tei-top">
                                        <span className="tei-title">{ev.titulo}</span>
                                        <span className={`tei-visibility ${ev.es_publico ? "public" : "private"}`}>
                                          {ev.es_publico ? <IconGlobe size={13} /> : <IconLock size={13} />}
                                        </span>
                                      </div>
                                      {ev.hora_evento && (
                                        <span className="tei-hora"><IconClock size={11} /> {formatHora(ev.hora_evento)}</span>
                                      )}
                                      {ev.descripcion && (
                                        <span className="tei-desc">{ev.descripcion}</span>
                                      )}
                                      <span className="tei-autor">Por {ev.autor}</span>
                                      {ended && (
                                        <span className="event-ended">El evento ha terminado</span>
                                      )}
                                      {(canEdit(ev) || canDelete(ev)) && (
                                        <div className="tei-actions">
                                          {canEdit(ev) && (
                                            <button
                                              className="tei-btn edit"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(ev);
                                              }}
                                            >
                                              <IconEdit size={12} /> Editar
                                            </button>
                                          )}
                                          {canDelete(ev) && (
                                            <button
                                              className="tei-btn delete"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirm(ev);
                                              }}
                                            >
                                              <IconTrash size={12} /> Borrar
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        )}
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

      {/* ── MODAL AÑADIR / EDITAR EVENTO ───────────────────────────────────── */}
      {modalOpen && (
        <div className="event-modal-overlay" onClick={() => closeModal()}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h3>{editingEvent ? "Editar evento" : "Nuevo evento"}</h3>
              <button className="modal-close-btn" onClick={() => closeModal()}><IconClose size={14} /></button>
            </div>

            <div className="event-modal-body">
              <label className="event-field">
                <span>Título <span className="required">*</span></span>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => handleFormChange("titulo", e.target.value)}
                  placeholder="Nombre del evento"
                  maxLength={200}
                />
              </label>

              <label className="event-field">
                <span>Descripción</span>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => handleFormChange("descripcion", e.target.value)}
                  placeholder="Descripción opcional..."
                  rows={3}
                />
              </label>

              <label className="event-field">
                <span>Hora (opcional)</span>
                <input
                  type="time"
                  value={form.hora_evento}
                  onChange={(e) => handleFormChange("hora_evento", e.target.value)}
                />
              </label>

              <div className="event-field visibility-toggle">
                <span>Visibilidad</span>
                <div className="toggle-group">
                  <button
                    type="button"
                    className={`toggle-btn ${form.es_publico ? "active" : ""}`}
                    onClick={() => handleFormChange("es_publico", true)}
                  >
                    <IconGlobe size={13} /> Público
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${!form.es_publico ? "active" : ""}`}
                    onClick={() => handleFormChange("es_publico", false)}
                  >
                    <IconLock size={13} /> Privado
                  </button>
                </div>
              </div>

              {formError && <p className="event-form-error">{formError}</p>}
            </div>

            <div className="event-modal-footer">
              <button className="modal-cancel-btn" onClick={() => closeModal()} disabled={saving}>
                Cancelar
              </button>
              <button className="modal-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar evento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMACIÓN BORRAR ──────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="event-modal-overlay" onClick={() => !saving && setDeleteConfirm(null)}>
          <div className="event-modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h3>¿Borrar evento?</h3>
              <button className="modal-close-btn" onClick={() => !saving && setDeleteConfirm(null)} disabled={saving}><IconClose size={14} /></button>
            </div>
            <div className="event-modal-body">
              <p className="confirm-text">
                ¿Seguro que quieres borrar el evento <strong>"{deleteConfirm.titulo}"</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="event-modal-footer">
              <button className="modal-cancel-btn" onClick={() => !saving && setDeleteConfirm(null)} disabled={saving}>
                Cancelar
              </button>
              <button className="modal-delete-btn" onClick={handleDeleteConfirm} disabled={saving}>
                {saving ? "Borrando..." : "Sí, borrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </IntranetLayout>
  );
};

export default IntranetHome;
