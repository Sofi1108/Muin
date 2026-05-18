import type { Product } from "../../types";
import "../styles/product-card.css";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";

interface ProductCardProps {
  product: Product;
  onSelect?: (id: number) => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  const { customer } = useUser();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Seguro que quieres borrarlo?")) {
      fetch(`http://localhost:3000/api/products/${product.id_producto_perso}`, {
        method: "DELETE",
        credentials: "include",
      }).then(() => window.location.reload());
    }
  };

  const handleChangeStock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStock = prompt("Nuevo stock:", product.cantidad_u.toString());
    if (newStock) {
      fetch(
        `http://localhost:3000/api/products/${product.id_producto_perso}/stock`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ stock: parseInt(newStock) }),
        },
      ).then(() => window.location.reload());
    }
  };

  return (
    <Link
      to={`/products/${product.id_producto_perso}#product-detail_back`}
      className="product-card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="product-image-container">
        {product.url_imagen ? (
          <img
            src={product.url_imagen}
            alt={product.nombre_producto_perso}
            className="product-img"
          />
        ) : (
          <div className="product-placeholder">
            <div className="placeholder-x"></div>
          </div>
        )}
      </div>
      <div className="product-info">
        <h2 className="product-name">
          {product.nombre_producto_perso?.toUpperCase()}
        </h2>
        <p className="product-price">
          {Number(product.precio_producto_perso).toFixed(2)}€
        </p>

        {product.cantidad_u <= 0 && (
          <span className="out-of-stock-label">OUT OF STOCK</span>
        )}
      </div>

      {/* Botones administrativos */}
      {customer &&
        (customer.role === "admin" || customer.role === "empleado") && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem",
              borderTop: "1px solid #eee",
              marginTop: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="stock-btn material-symbols-outlined"
              onClick={handleChangeStock}
              title="Cambiar Stock"
            >
              box_add
            </button>

            {customer.role === "admin" && (
              <>
                <button
                  className="edit-btn material-symbols-outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/admin/products/${product.id_producto_perso}/edit`,
                    );
                  }}
                  title="Editar"
                >
                  edit
                </button>
                <button
                  className="delete-btn material-symbols-outlined"
                  onClick={handleDelete}
                  title="Borrar"
                >
                  delete
                </button>
              </>
            )}
          </div>
        )}
    </Link>
  );
}

export default ProductCard;
