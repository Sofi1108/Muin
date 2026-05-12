import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../../types";
import "../styles/checkout-page.css";

const CheckoutPage = ({ cart = [] }: { cart: CartItem[] }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    console.log("Contenido del carrito en Checkout:", cart);
  }, [cart]);

  const subtotal =
    cart?.reduce((acc, item) => {
      const precio = Number(item.product?.precio_producto_perso) || 0;
      const cantidad = Number(item.quantity) || 0;
      return acc + precio * cantidad;
    }, 0) || 0;

  const total = subtotal;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 2500);
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
              <label>NAME OF CARDHOLDER</label>
              <input type="text" placeholder="FULL NAME" required />
            </div>

            <div className="input-group">
              <label>CARD NUMBER</label>
              <input
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={16}
                required
              />
            </div>

            <div className="row-inputs">
              <div className="input-group">
                <label>EXPIRATION DATE</label>
                <input type="text" placeholder="MM/YY" required />
              </div>
              <div className="input-group">
                <label>CVC</label>
                <input
                  type="password"
                  placeholder="***"
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
