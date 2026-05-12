import { useState, useEffect } from "react";
import "../styles/clock-history.css";

export default function ClockHistory() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/clock/history", { credentials: "include" })
      .then(res => res.json())
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="clock-history">
      <h2>Historial de Fichajes</h2>
      <table className="clock-history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {history.map(h => (
            <tr key={h.id}>
              <td>#{h.id}</td>
              <td className={h.type === "in" ? "clock-type-in" : "clock-type-out"}>
                {h.type === "in" ? "Entrada" : "Salida"}
              </td>
              <td>{new Date(h.recorded_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
