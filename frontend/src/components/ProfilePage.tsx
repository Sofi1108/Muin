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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    Nombre_Usuario: "",
    CorreoElectronico: "",
    DNI: "",
    Contrasena: ""
  });
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

  const handleEditClick = () => {
    if (customer) {
      setFormData({
        Nombre: customer.firstName || "",
        Apellido: customer.lastName || "",
        Nombre_Usuario: customer.name || "",
        CorreoElectronico: customer.email || "",
        DNI: customer.dni || "",
        Contrasena: "" // Siempre vacío al empezar
      });
      setIsEditing(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setCustomer({
          ...customer!,
          name: data.user.name,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          dni: data.user.dni
        });
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error connection to server");
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
            <span className="material-symbols-outlined" id="edit-icon" onClick={handleEditClick} style={{cursor: 'pointer'}}>
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
                <label>DNI</label>
                <p>{customer?.dni || "No disponible"}</p>
              </div>

              <div className="info-capsule">
                <label>Rol de Cuenta</label>
                <p className="role-badge-text">{customer?.role || "cliente"}</p>
              </div>
            </div>

            <div className="profile-button-group">
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
          <h3>
            ORDER STATUS{" "}
            {selectedOrder &&
              `#${orders.length - orders.findIndex((o) => o.id === selectedOrder.id)}`}
          </h3>
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
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o, index) => (
                  <OrderRow
                    key={o.id}
                    order={o}
                    displayId={orders.length - index}
                    isSelected={selectedOrder?.id === o.id}
                    onSelect={() => setSelectedOrder(o)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="edit-profile-overlay">
          <div className="edit-profile-modal">
            <div className="modal-header">
              <h2>EDIT PROFILE</h2>
              <button className="close-btn" onClick={() => setIsEditing(false)}>×</button>
            </div>
            <form onSubmit={handleSave} className="edit-profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={formData.Nombre} 
                    onChange={e => setFormData({...formData, Nombre: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={formData.Apellido} 
                    onChange={e => setFormData({...formData, Apellido: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={formData.Nombre_Usuario} 
                    onChange={e => setFormData({...formData, Nombre_Usuario: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={formData.CorreoElectronico} 
                    onChange={e => setFormData({...formData, CorreoElectronico: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>DNI</label>
                  <input 
                    type="text" 
                    value={formData.DNI} 
                    onChange={e => setFormData({...formData, DNI: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>New Password (leave blank to keep current)</label>
                  <input 
                    type="password" 
                    value={formData.Contrasena} 
                    onChange={e => setFormData({...formData, Contrasena: e.target.value})} 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>CANCEL</button>
                <button type="submit" className="btn-save">SAVE CHANGES</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  displayId,
  isSelected,
  onSelect,
}: {
  order: any;
  displayId: number;
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
          #{displayId}
        </td>
        <td>{new Date(order.created_at).toLocaleDateString()}</td>
        <td>{order.address || "No especificada"}</td>
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
          <td colSpan={5} className="order-detail-cell">
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
