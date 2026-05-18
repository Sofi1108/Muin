import { useState } from "react";
import type { CartItem, Product } from "../../types";
import "../styles/cart-summary.css";

interface CartProps {
  items: CartItem[];
  onAddToCart: (product: Product) => void;
  onDecreaseQuantity: (productId: number) => void;
  onConfirm: () => void;
}

export default function Cart({
  items,
  onDecreaseQuantity,
  onAddToCart,
  onConfirm,
}: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.precio_producto_perso * item.quantity,
    0,
  );

  return (
    <div
      className="cart-widget-container"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* ICON & BADGE */}
      <div className="cart-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <span className="material-symbols-outlined" id="cart-icon">
          shopping_cart
        </span>
        {totalItems > 0 && (
          <span className="cart-badge-muin">{totalItems}</span>
        )}
      </div>

      {/* PREMIUM POPUP */}
      <div className={`cart-popup-muin ${isOpen ? "show" : ""}`}>
        <div className="cart-header">
          <h3>MY CART</h3>
          <span className="item-count">{totalItems} ITEMS</span>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty-state">
            <span className="material-symbols-outlined">shopping_basket</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {items.map((item) => (
                <div
                  key={item.product.id_producto_perso}
                  className="cart-item-row"
                >
                  <div className="item-main-info">
                    <span className="item-name">
                      {item.product.nombre_producto_perso}
                    </span>
                    <span className="item-price-unit">
                      {item.product.precio_producto_perso}€
                    </span>
                  </div>

                  <div className="item-controls-row">
                    <div className="qty-selector">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDecreaseQuantity(item.product.id_producto_perso!);
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Solo añadir si hay stock disponible
                          if (item.quantity < item.product.cantidad_u) {
                            onAddToCart(item.product);
                          }
                        }}
                        disabled={item.quantity >= item.product.cantidad_u}
                      >
                        +
                      </button>
                    </div>
                    <span className="item-subtotal">
                      {(
                        item.product.precio_producto_perso * item.quantity
                      ).toFixed(2)}
                      €
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer-muin">
              <div className="cart-total-display">
                <span>TOTAL</span>
                <strong>{totalPrice.toFixed(2)}€</strong>
              </div>
              <button
                className="checkout-btn-muin"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
              >
                CHECKOUT NOW
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
