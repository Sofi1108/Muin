import { useState, useEffect } from "react";
import IntranetLayout from "./IntranetLayout";
import "../styles/admin-orders.css";

interface OrderSummary {
  id: number;
  customer_id: number;
  customer_name: string;
  status: string;
  address: string;
  created_at: string;
  received_at: string | null;
  total: string;
}

interface OrderItem {
  quantity: number;
  unit_price: string;
  subtotal: string;
  name: string;
}

interface OrderDetail extends OrderSummary {
  items: OrderItem[];
}

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/orders", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectOrder = async (order: OrderSummary) => {
    if (selectedOrder?.id === order.id) {
      setSelectedOrder(null);
      return;
    }
    setLoadingDetail(true);
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${order.id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setSelectedOrder({ ...order, items: data.items || [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const changeStatus = (id: number, status: string) => {
    fetch(`http://localhost:3000/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
        if (selectedOrder?.id === id) {
          setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <IntranetLayout
      title="Order Management"
      subtitle="View and manage all customer orders."
    >
      <div className="work-capsules-page">
        <section className="work-capsules-hero">
          <span className="hero-label">Administration</span>
          <h1>Orders</h1>
          <p>View all orders, check their details, and update their status.</p>
        </section>
        <main className="work-capsules-main">
          <section className="section-card">
            {loading ? (
              <div className="admin-orders-loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="admin-orders-loading">No orders found.</div>
            ) : (
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Change Status</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className={
                        selectedOrder?.id === o.id ? "selected-order-row" : ""
                      }
                      onClick={() => handleSelectOrder(o)}
                    >
                      <td>#{o.id}</td>
                      <td>{o.customer_name || `User #${o.customer_id}`}</td>
                      <td>
                        {new Date(o.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>{o.address || "—"}</td>
                      <td>
                        <span
                          className={`order-status-badge ${o.status?.trim()}`}
                        >
                          {o.status?.trim().toUpperCase()}
                        </span>
                      </td>
                      <td
                        style={{ textAlign: "center" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          className="order-status-select"
                          value={o.status?.trim()}
                          onChange={(e) => changeStatus(o.id, e.target.value)}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        €{Number(o.total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Detail panel */}
            {selectedOrder && (
              <div className="order-detail-panel">
                <div className="order-detail-header">
                  <h4>Order #{selectedOrder.id} — Details</h4>
                  <button
                    className="order-detail-close"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="order-detail-meta">
                  <div className="detail-meta-item">
                    <span className="meta-label">Customer</span>
                    <span className="meta-value">
                      {selectedOrder.customer_name ||
                        `User #${selectedOrder.customer_id}`}
                    </span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="meta-label">Date</span>
                    <span className="meta-value">
                      {new Date(selectedOrder.created_at).toLocaleString(
                        "en-GB"
                      )}
                    </span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="meta-label">Address</span>
                    <span className="meta-value">
                      {selectedOrder.address || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-meta-item">
                    <span className="meta-label">Status</span>
                    <span
                      className={`order-status-badge ${selectedOrder.status?.trim()}`}
                    >
                      {selectedOrder.status?.trim().toUpperCase()}
                    </span>
                  </div>
                </div>

                {loadingDetail ? (
                  <div className="admin-orders-loading">
                    Loading order items...
                  </div>
                ) : (
                  <table className="order-items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th style={{ textAlign: "center" }}>Qty</th>
                        <th style={{ textAlign: "right" }}>Unit Price</th>
                        <th style={{ textAlign: "right" }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name || "Unknown product"}</td>
                          <td style={{ textAlign: "center" }}>
                            {item.quantity}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            €{Number(item.unit_price).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            €{Number(item.subtotal).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="order-total-text">
                          Total
                        </td>
                        <td className="order-total-value">
                          €{Number(selectedOrder.total).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </IntranetLayout>
  );
}
