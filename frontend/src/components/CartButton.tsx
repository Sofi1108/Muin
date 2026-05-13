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
}: CartButtonProps) {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith("/product/");
  const isProductsPage = location.pathname.includes("/products/");

  const cartItem = cart.find(
    (i) => i.product.id_producto_perso === product.id_producto_perso,
  );
  const quantity = cartItem?.quantity ?? 0;

  // Check if out of stock or cart limit reached
  const isOutOfStock = product.cantidad_u === 0;
  const isLimitReached = quantity >= product.cantidad_u;

  return (
    <div
      className={`cart-button-wrapper ${isProductDetail ? "cart-button-detail" : isProductsPage ? "cart-button-products" : ""}`}
    >
      <button
        className="btn-add-corner"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        disabled={isLimitReached || isOutOfStock}
      >
        {isProductsPage && !isProductDetail && (
          <span className="material-symbols-outlined">shopping_cart</span>
        )}

        {isProductDetail && (
          <>
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="btn-text">
              {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </span>
          </>
        )}

        {!isProductDetail && !isProductsPage && (
          <span>{isOutOfStock ? "block" : <span>ADD TO CART</span>}</span>
        )}
      </button>
    </div>
  );
}
