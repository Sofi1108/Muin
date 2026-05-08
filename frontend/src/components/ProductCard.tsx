import type { Product } from "../../types";
import "../styles/product-card.css";

interface ProductCardProps {
  product: Product;
  onSelect?: (id: number) => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div
      className="product-card"
      onClick={() => onSelect && onSelect(product.id)}
    >
      <div className="product-image-container">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-img"
          />
        ) : (
          <div className="product-placeholder">
            <div className="placeholder-x"></div>
          </div>
        )}
      </div>
      <div className="product-info">
        <h2 className="product-name">{product.name.toUpperCase()}</h2>
        <p className="product-price">{Number(product.price).toFixed(2)}€</p>

        {product.stock <= 0 && (
          <span className="out-of-stock-label">OUT OF STOCK</span>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
