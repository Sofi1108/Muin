import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { useUser } from "../context/UserContext";
import HeroSectionSmall from "./HeroSectionSmall";
import "../styles/profile-page.css";
import "../styles/order-history.css";

export default function ProfilePage() {
  const { customer, setCustomer } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/orders/my", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const ordersList = Array.isArray(data) ? data : [];
        setOrders(ordersList);
        if (ordersList.length > 0) setSelectedOrder(ordersList[0]);
      })
      .catch((err) => console.error("Error al cargar pedidos:", err));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setCustomer(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Error al desconectar:", error);
    }
  };

  // Función para determinar la clase de los puntos de estado
  const getStatusClass = (step: string) => {
    if (!selectedOrder) return "";
    const status = selectedOrder.status.toLowerCase();

    const levels: Record<string, number> = {
      pendiente: 1,
      enviado: 2,
      entregado: 3,
    };
    const currentLevel = levels[status] || 0;

    if (step === "CONFIRMED" && currentLevel >= 1) return "active";
    if (step === "SENDING" && currentLevel >= 2) return "active";
    if (step === "DELIVERED" && currentLevel >= 3) return "active";
    return "";
  };

  return (
    <div className="profile-page-container">
      <HeroSectionSmall />

      <div className="profile-content-wrapper">
        <div className="profile-main-section">
          <div className="profile-avatar-column">
            <div className="avatar-circle-large">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>

          <div className="profile-info-column">
            <span className="material-symbols-outlined" id="edit-icon">
              edit
            </span>
            <div className="profile-info-header">
              <h2>
                Hola, {customer?.firstName || customer?.name || "Usuario"}
              </h2>
            </div>

            <div className="info-grid-container">
              <div className="info-capsule">
                <label>Nombre Completo</label>
                <p>
                  {customer
                    ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                    : "No disponible"}
                </p>
              </div>

              <div className="info-capsule">
                <label>Nombre de Usuario</label>
                <p>@{customer?.name || "username"}</p>
              </div>

              <div className="info-capsule">
                <label>Correo Electrónico</label>
                <p>{customer?.email || "email@ejemplo.com"}</p>
              </div>

              <div className="info-capsule">
                <label>Rol de Cuenta</label>
                <p className="role-badge-text">{customer?.role || "cliente"}</p>
              </div>
            </div>

            <div className="profile-button-group">
              <button className="btn-muin-black">VER PEDIDOS</button>
              <button className="btn-muin-white-outline" onClick={handleLogout}>
                CERRAR SESIÓN
              </button>
              {customer?.role === "admin" || customer?.role === "empleado" ? (
                <button className="btn-intranet-red">
                  <Link to="/intranet" className="btn-muin-red-solid">
                    INTRANET
                  </Link>
                </button>
              ) : null}
            </div>
          </div>
        </div>
        {/* SECCIÓN INFERIOR: ORDER STATUS DINÁMICO */}
        <div className="order-status-section">
          <h3>ORDER STATUS {selectedOrder && `#${selectedOrder.id}`}</h3>
          <div className="status-container">
            <div className="status-line"></div>
            <div className="status-points">
              <div className={`point ${getStatusClass("CONFIRMED")}`}>
                <span>CONFIRMED</span>
              </div>
              <div className={`point ${getStatusClass("SENDING")}`}>
                <span>SENDING</span>
              </div>
              <div className={`point ${getStatusClass("DELIVERED")}`}>
                <span>DELIVERED</span>
              </div>
            </div>
            <div className="status-icon-box">
              <span className="material-symbols-outlined">
                {selectedOrder?.status === "entregado"
                  ? "local_shipping"
                  : "package_2"}
              </span>
            </div>
          </div>
        </div>

        {/* TABLA DE PEDIDOS RECIENTES (Código B Integrado) */}
        <div className="profile-orders-table-container">
          <h3 className="recent-orders-title">Recent Orders</h3>
          {orders.length === 0 ? (
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
                {orders.slice(0, 5).map((o) => (
                  <OrderRow
                    key={o.id}
                    order={o}
                    isSelected={selectedOrder?.id === o.id}
                    onSelect={() => setSelectedOrder(o)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  isSelected,
  onSelect,
}: {
  order: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        className={`${expanded ? "order-row-expanded" : ""} ${isSelected ? "selected-row" : ""}`}
        onClick={onSelect}
        style={{ cursor: "pointer" }}
      >
        <td className="id-cell">
          <span className="expand-icon" onClick={handleToggle}>
            {expanded ? "▼" : "▶"}
          </span>
          #{order.id}
        </td>
        <td>{new Date(order.created_at).toLocaleDateString()}</td>
        <td>
          <span className={`status-badge ${order.status}`}>
            {order.status.toUpperCase()}
          </span>
        </td>
        <td style={{ textAlign: "right" }}>
          ${Number(order.total).toFixed(2)}
        </td>
      </tr>
      {expanded && (
        <tr className="detail-row">
          <td colSpan={4} className="order-detail-cell">
            {loading ? (
              <p>Cargando productos...</p>
            ) : (
              <div className="order-items-detail">
                {items.map((i, idx) => (
                  <div key={idx} className="item-line">
                    <span>
                      {i.quantity}x <b>{i.name}</b>
                    </span>
                    <span>${Number(i.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
