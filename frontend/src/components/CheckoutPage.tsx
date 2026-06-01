import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { CartItem } from "../../types";
import "../styles/checkout-page.css";

const CheckoutPage = ({ cart = [], setCart }: { cart: CartItem[]; setCart?: React.Dispatch<React.SetStateAction<CartItem[]>> }) => {
  const navigate = useNavigate();
  const { customer } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [calle, setCalle] = useState("");
  const [numPortal, setNumPortal] = useState("");
  const [piso, setPiso] = useState("");
  const [puerta, setPuerta] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [comunidadAutonoma, setComunidadAutonoma] = useState("");
  const [pais, setPais] = useState("España");
  const [termsAccepted, setTermsAccepted] = useState(false);
  useEffect(() => {
    console.log("Contenido del carrito en Checkout:", cart);
  }, [cart]);

  const handleExpirationDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = e.target.value.replace(/\D/g, ""); // Solo números

    // Limitar a 4 dígitos máximo
    if (value.length > 4) value = value.slice(0, 4);

    // Formatear con barra diagonal
    if (value.length <= 2) {
      setExpirationDate(value);
    } else {
      setExpirationDate(`${value.slice(0, 2)}/${value.slice(2)}`);
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

    if (!customer) {
      alert("Debes iniciar sesión para realizar un pedido.");
      navigate("/login"); // Asumiendo que existe esta ruta
      return;
    }

    // Validar fecha de expiración (MM/YY)
    if (expirationDate.length !== 5) {
      alert("Por favor, introduce una fecha de expiración válida (MM/YY).");
      return;
    }
    const [monthStr, yearStr] = expirationDate.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear() % 100; // 2 dígitos

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      alert("El mes de expiración debe estar entre 01 y 12.");
      return;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      alert("La tarjeta introducida está caducada.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: cart.map(c => ({
            productId: c.product.id_producto_perso,
            quantity: c.quantity,
            unitPrice: c.product.precio_producto_perso,
            productData: c.product
          })),
          address: {
            calle,
            num_portal: numPortal,
            codigopostal: codigoPostal,
            ciudad,
            provincia,
            comunidad_autonoma: comunidadAutonoma,
            pais,
            piso: piso || null,
            puerta: puerta || null
          }
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al procesar el pedido");
      }

      // Clear the cart
      sessionStorage.removeItem("cart");
      if (setCart) {
        setCart([]);
      }
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
          <span className="material-symbols-outlined success-icon">
            check_circle
          </span>
          <h1>PAYMENT SUCCESSFUL!</h1>
          <p>Your order with MUIN has been processed.</p>
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
        <button className="back-link" onClick={() => navigate(-1)}>
          ← COME BACK TO CART
        </button>

        <div className="payment-form-section">
          <h2 className="section-title">PAYMENT DETAILS</h2>

          <form onSubmit={handlePayment} className="muin-form">
            <div className="address-section" style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem", marginTop: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 900, marginBottom: "1.5rem", textTransform: "uppercase", color: "var(--primary)" }}>SHIPPING ADDRESS</h3>
              
              <div className="input-group">
                <label>STREET *</label>
                <input
                  type="text"
                  placeholder="Street name, avenue, etc."
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                  required
                />
              </div>

              <div className="row-inputs" style={{ marginTop: "1rem" }}>
                <div className="input-group">
                  <label>PORTAL NO. *</label>
                  <input
                    type="text"
                    placeholder="e.g. 14"
                    value={numPortal}
                    onChange={(e) => setNumPortal(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>FLOOR</label>
                  <input
                    type="text"
                    placeholder="e.g. 3rd (Optional)"
                    value={piso}
                    onChange={(e) => setPiso(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>DOOR</label>
                  <input
                    type="text"
                    placeholder="e.g. B (Optional)"
                    value={puerta}
                    onChange={(e) => setPuerta(e.target.value)}
                  />
                </div>
              </div>

              <div className="row-inputs" style={{ marginTop: "1rem" }}>
                <div className="input-group">
                  <label>ZIP CODE *</label>
                  <input
                    type="text"
                    placeholder="e.g. 28001"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>CITY *</label>
                  <input
                    type="text"
                    placeholder="e.g. Madrid"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row-inputs" style={{ marginTop: "1rem" }}>
                <div className="input-group">
                  <label>PROVINCE *</label>
                  <input
                    type="text"
                    placeholder="e.g. Madrid"
                    value={provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>STATE / REGION *</label>
                  <input
                    type="text"
                    placeholder="e.g. Madrid Region"
                    value={comunidadAutonoma}
                    onChange={(e) => setComunidadAutonoma(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
                <label>COUNTRY *</label>
                <input
                  type="text"
                  placeholder="e.g. Spain"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  required
                />
              </div>
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

            <div className="terms-checkbox-container">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                Acepto las condiciones de la <Link to="/privacy-policy" target="_blank">Política de Privacidad</Link>.
              </label>
            </div>

            <button
              className="btn-pay-now"
              disabled={isProcessing || cart.length === 0 || !termsAccepted}
            >
              {isProcessing ? (
                <div className="spinner"></div>
              ) : (
                `PAYMENT ${total.toFixed(2)}€`
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
