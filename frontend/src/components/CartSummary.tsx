import type { CartItem, Product } from "../../types";
import { useState } from "react"; // Para controlar la visibilidad
import "../styles/cart-summary.css";

interface CartProps {
  items: CartItem[];
  onAddToCart: (product: Product) => void;
  onDecreaseQuantity: (productId: number) => void; // Quitamos el opcional para seguridad
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
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="cart-widget" onClick={() => setIsOpen(!isOpen)}>
      <div className="material-symbols-outlined" id="cart-icon">
        shopping_cart
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </div>

      {/* Solo mostramos el popup si isOpen es true */}
      {isOpen && (
        <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
          <h3>Cart</h3>
          {items.length === 0 ? (
            <p className="cart-empty">Empty</p>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                    <span className="item-price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    <div className="item-controls ">
                      <button
                        className="item-btn material-symbols-outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item.product);
                        }}
                      >
                        add
                      </button>
                      <button
                        className="item-btn material-symbols-outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDecreaseQuantity(item.product.id);
                        }}
                      >
                        close
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  Total: <strong>${totalPrice.toFixed(2)}</strong>
                </div>
                <button className="checkout-btn" onClick={onConfirm}>
                  Payment
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
