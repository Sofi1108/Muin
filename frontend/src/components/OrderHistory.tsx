import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/order-history.css";
import "../styles/auth.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch("http://localhost:3000/api/orders/my", {
      credentials: "include",
      headers,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Error ${res.status}`);
        }
        return data;
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error al cargar historial:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="orders-page">
      <button className="btn-back" onClick={() => navigate("/")}>
        ← Volver al catálogo
      </button>
      <h2>Mis Pedidos</h2>
      {error ? (
        <p className="orders-error" style={{ color: "#ff5252", fontWeight: "bold" }}>
          Error al cargar pedidos: {error}
        </p>
      ) : orders.length === 0 ? (
        <p className="orders-empty">No tienes pedidos todavía.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function OrderRow({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleExpand = () => {
    if (!expanded && items.length === 0) {
      setLoading(true);
      fetch(`http://localhost:3000/api/orders/${order.id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setItems(data.items || []))
        .finally(() => setLoading(false));
    }
    setExpanded(!expanded);
  };

  return (
    <>
      <tr
        className={expanded ? "order-row-expanded" : ""}
        onClick={toggleExpand}
      >
        <td>
          #{order.id} {expanded ? "▼" : "▶"}
        </td>
        <td>{new Date(order.created_at).toLocaleString()}</td>
        <td>{order.status}</td>
        <td style={{ textAlign: "right" }}>
          ${Number(order.total).toFixed(2)}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={4} className="order-detail-cell">
            {loading ? (
              <p>Cargando productos...</p>
            ) : (
              <ul>
                {items.map((i, idx) => (
                  <li key={idx}>
                    <span>
                      {i.quantity}x <b>{i.name}</b>
                    </span>
                    <span>Subtotal: ${Number(i.subtotal).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
