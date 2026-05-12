import type { Product } from "../../types";
import "../styles/product-card.css";

interface ProductCardProps {
  product: Product;
  onSelect?: (id: number) => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  const productId = product.id_producto_perso;
  const productName = product.nombre_producto_perso || "Producto";
  const productPrice = product.precio_producto_perso || 0;
  const productImage = product.url_imagen || "";
  const productStock = product.cantidad_u || 0;

  return (
    <div
      className="product-card"
      onClick={() => onSelect && onSelect(productId || 0)}
    >
      <div className="product-image-container">
        {productImage ? (
          <img src={productImage} alt={productName} className="product-img" />
        ) : (
          <div className="product-placeholder">
            <div className="placeholder-x"></div>
          </div>
        )}
      </div>
      <div className="product-info">
        <h2 className="product-name">{productName.toUpperCase()}</h2>
        <p className="product-price">{Number(productPrice).toFixed(2)}€</p>

        {productStock <= 0 && (
          <span className="out-of-stock-label">OUT OF STOCK</span>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
