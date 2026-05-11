import { useState, useEffect } from "react";
import "../styles/clock-in.css";

export default function ClockInPage() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [note, setNote] = useState("");

  const checkStatus = () => {
    fetch("http://localhost:3000/api/clock/status", { credentials: "include" })
      .then(res => res.json())
      .then(data => setIsClockedIn(data.isClockedIn))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleClock = () => {
    const type = isClockedIn ? "out" : "in";
    fetch("http://localhost:3000/api/clock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type, note })
    })
      .then(res => res.json())
      .then(() => {
        setNote("");
        checkStatus();
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Control de Presencia</h2>
      <div className="clock-section">
        <h3>{isClockedIn ? "Estás trabajando" : "No estás trabajando"}</h3>
        <textarea 
          placeholder="Añadir nota opcional (retraso, incidencia...)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button 
          onClick={handleClock}
          className={`clock-btn ${isClockedIn ? "clock-btn-out" : "clock-btn-in"}`}
        >
          {isClockedIn ? "Fichar Salida" : "Fichar Entrada"}
        </button>
      </div>
    </div>
  );
}
