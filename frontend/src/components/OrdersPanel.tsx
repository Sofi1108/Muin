import { useState, useEffect } from "react";
import "../styles/orders-panel.css";

export default function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/orders", { credentials: "include" })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const updateStatus = (id: number, status: string) => {
    fetch(`http://localhost:3000/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(data => {
      if (data.order) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      }
    });
  };

  return (
    <div className="orders-panel">
      <h2>Gestión de Pedidos</h2>
      <table className="orders-panel-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente ID</th>
            <th>Dirección</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{o.customer_id}</td>
              <td>{o.address}</td>
              <td>${Number(o.total).toFixed(2)}</td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                  <option value="pendiente">Pendiente</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
