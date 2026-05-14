import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../../types";
import "../styles/checkout-page.css";

const CheckoutPage = ({ cart = [] }: { cart: CartItem[] }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    console.log("Contenido del carrito en Checkout:", cart);
  }, [cart]);

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Solo números

    // Limitar a 4 dígitos máximo
    if (value.length > 4) value = value.slice(0, 4);

    // Validar mes (primeros 2 dígitos)
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2), 10);
      // Si el mes es mayor a 12 o es 00, no permitir
      if (month > 12 || month === 0) {
        // Solo tomar el primer dígito si es válido como mes
        if (value[0] === "0" || value[0] === "1") {
          value = value[0];
        } else {
          return; // No permitir
        }
      }
    }

    // Validar año (últimos 2 dígitos) - debe ser año actual o futuro
    if (value.length === 4) {
      const year = parseInt(value.slice(2, 4), 10);
      const currentYear = new Date().getFullYear() % 100; // Últimos 2 dígitos del año actual

      if (year < currentYear) {
        // Rechazar años del pasado
        return;
      }
    }

    // Formatear con barra diagonal
    if (value.length <= 2) {
      setExpirationDate(value);
    } else if (value.length === 3) {
      setExpirationDate(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else if (value.length === 4) {
      setExpirationDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length > 3) value = value.slice(0, 3);
    setCvc(value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length > 16) value = value.slice(0, 16);
    setCardNumber(value);
  };

  const subtotal =
    cart?.reduce((acc, item) => {
      const precio = Number(item.product?.precio_producto_perso) || 0;
      const cantidad = Number(item.quantity) || 0;
      return acc + precio * cantidad;
    }, 0) || 0;

  const total = subtotal;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items: cart.map(c => ({
            productId: c.product.id_producto_perso,
            quantity: c.quantity,
            unitPrice: c.product.precio_producto_perso,
            productData: c.product
          })),
          address: "Dirección de prueba"
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al procesar el pedido");
      }

      // Clear the cart
      sessionStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      
      setStep(2);
    } catch (err: any) {
      alert(err.message || "Ha ocurrido un error durante el pago");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 2) {
    return (
      <div className="checkout-container success">
        <div className="success-card">
          <span
            className="material-symbols-outlined success-icon"
            style={{ fontSize: "5rem", color: "#16a34a" }}
          >
            check_circle
          </span>
          <h1 style={{ fontWeight: 900, marginTop: "1rem" }}>
            PAYMENT SUCCESSFUL!
          </h1>
          <p>Tu pedido de MUIN ha sido procesado.</p>
          <button className="btn-pay-now" onClick={() => navigate("/")}>
            COME BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-grid">
        <div className="payment-form-section">
          <button className="back-link" onClick={() => navigate(-1)}>
            ← COME BACK TO CART
          </button>
          <h2 className="section-title">PAYMENT DETAILS</h2>

          <form onSubmit={handlePayment} className="muin-form">
            <div className="input-group">
              <label>DIRECTION</label>
              <input type="text" placeholder="YOUR DIRECTION" required />
            </div>
            <div className="input-group">
              <label>NAME OF CARDHOLDER</label>
              <input type="text" placeholder="FULL NAME" required />
            </div>

            <div className="input-group">
              <label>CARD NUMBER</label>
              <input
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={16}
                required
              />
            </div>

            <div className="row-inputs">
              <div className="input-group">
                <label>EXPIRATION DATE</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expirationDate}
                  onChange={handleExpirationDateChange}
                  maxLength={5}
                  required
                />
              </div>
              <div className="input-group">
                <label>CVC</label>
                <input
                  type="password"
                  placeholder="***"
                  value={cvc}
                  onChange={handleCvcChange}
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <button
              className="btn-pay-now"
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? (
                <div className="spinner"></div>
              ) : (
                `PAGAR ${total.toFixed(2)}€`
              )}
            </button>
          </form>
        </div>

        <div className="order-summary-section">
          <h3 className="summary-title">YOUR ORDER ({cart.length})</h3>

          <div className="summary-items">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="item-img-mini">
                    <img src={item.product.url_imagen} />
                  </div>
                  <div className="item-info-mini">
                    <h4>{item.product.nombre_producto_perso}</h4>
                    <p>
                      Size: <strong>{item.selectedSize || "M"}</strong>
                    </p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <span className="item-price">
                    {(
                      Number(item.product.precio_producto_perso) * item.quantity
                    ).toFixed(2)}
                    €
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-cart-msg">
                <p>Your cart is empty.</p>
              </div>
            )}
          </div>

          <div className="total-box">
            <div className="total-row grand-total">
              <span>TOTAL </span>
              <span>{total.toFixed(2)}€</span>
            </div>
            <p style={{ fontSize: "0.7rem", color: "#999", marginTop: "10px" }}>
              IVA INCLUDED. FREE SHIPPING ON ORDERS OVER 50€.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
