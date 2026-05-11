import { useLocation } from "react-router-dom";
import type { Product, CartItem } from "../../types";
import "../styles/cart-button.css";

export interface CartButtonProps {
  product: Product;
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
}

export default function CartButton({
  product,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onDecreaseQuantity,
}: CartButtonProps) {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith("/product/");

  const cartItem = cart.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=shopping_cart"
        />
      </head>
      <div
        className={`cart-button-wrapper ${isProductDetail ? "cart-button-detail" : ""}`}
      >
        <button
          className="btn-add-corner material-symbols-outlined"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={quantity >= product.stock || product.stock === 0}
        >
          {quantity > 0 && <span className="qty-badge">{quantity}</span>}
          shopping_cart
        </button>

        {quantity > 0 && (
          <div className="cart-menu">
            <div className="menu-item">
              <span className="menu-label">En carrito:</span>
              <span className="menu-value">{quantity}</span>
            </div>

            <button
              className="menu-btn decrease material-symbols-outlined"
              onClick={(e) => {
                e.stopPropagation();
                onDecreaseQuantity(product.id);
              }}
            >
              minimize
            </button>

            <button
              className="menu-btn add material-symbols-outlined"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              disabled={quantity >= product.stock}
            >
              add
            </button>

            <button
              className="menu-btn remove material-symbols-outlined"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromCart(product.id);
              }}
            >
              delete
            </button>
          </div>
        )}
      </div>
    </>
  );
}
