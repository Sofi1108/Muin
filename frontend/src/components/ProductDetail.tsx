import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product, CartItem } from "../../types";
import CartButton from "./CartButton";
import CartSummary from "./CartSummary";

import "../styles/product-detail.css";

interface ProductDetailProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
}

function ProductDetail({
  cart,
  onAddToCart,
  onRemoveFromCart,
  onDecreaseQuantity,
}: ProductDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false); // Estado para manejar ID inexistente

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          // Si el ID no existe en la base de datos (404 de API)
          setError(true);
          throw new Error("Producto no encontrado");
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [id]);

  if (error) {
    return (
      <div className="product-detail">
        <h2>El producto con ID {id} no existe.</h2>
        <button className="product-detail_back" onClick={handleBack}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="product-detail">
      <button className="product-detail_back" onClick={handleBack}>
        ← Volver
      </button>

      <img
        className="product-detail_img"
        src={product.url_imagen}
        alt={product.nombre_producto_perso}
      />

      <h2>{product.nombre_producto_perso}</h2>
      <p>{product.descripcion}</p>
      <p className="price">{product.precio_producto_perso}€</p>
      <p className="stock">
        Stock:{" "}
        <span className={product.cantidad_u > 0 ? "in-stock" : "out-of-stock"}>
          {product.cantidad_u > 0
            ? `${product.cantidad_u} disponible${product.cantidad_u !== 1 ? "s" : ""}`
            : "Sin stock"}
        </span>
      </p>

      <CartButton
        product={product}
        cart={cart}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        onDecreaseQuantity={onDecreaseQuantity}
      />
    </div>
  );
}

export default ProductDetail;
