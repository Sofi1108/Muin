import { useState, useEffect } from "react";
import IntranetLayout from "./IntranetLayout";
import "../styles/orders-panel.css";

interface ShipmentOrder {
  id: number;
  customer_id: number;
  status: string;
  address: string;
  created_at: string;
  received_at?: string | null;
  total: number;
}

export default function ShipmentsPanel() {
  const [shipments, setShipments] = useState<ShipmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/orders", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar envíos");
        return res.json();
      })
      .then((data) => {
        setShipments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar envíos");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <IntranetLayout
      title="Envíos de Usuarios"
      subtitle="Revisa todos los pedidos y su estado de entrega"
    >
      <div className="orders-panel">
        <h2>Envíos</h2>
        {loading ? (
          <p>Cargando envíos...</p>
        ) : error ? (
          <p className="orders-empty">{error}</p>
        ) : shipments.length === 0 ? (
          <p className="orders-empty">No hay envíos registrados.</p>
        ) : (
          <table className="orders-panel-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Fecha Pedido</th>
                <th>Estado</th>
                <th>Fecha Recibido</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.received_at
                      ? new Date(order.received_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>${Number(order.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </IntranetLayout>
  );
}
