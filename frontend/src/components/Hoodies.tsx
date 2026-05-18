import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import CartButton from "./CartButton";
import type { Product, CartItem } from "../../types";
import "../styles/products.css";

interface HoodiesProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
}

function Hoodies({
  cart,
  onAddToCart,
  onRemoveFromCart,
  onDecreaseQuantity,
}: HoodiesProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- AQUÍ PONES EL USE EFFECT ---
  useEffect(() => {
    const loadHoodies = async () => {
      try {
        setLoading(true);
        // Llamamos a tu ruta específica del backend
        const res = await fetch("http://localhost:3000/api/products/hoodies");

        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          console.error("Error en la respuesta del servidor");
        }
      } catch (error) {
        console.error("Error conectando con la API de AWS:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHoodies();
  }, []); // El array vacío [] asegura que solo se ejecute una vez al cargar la página

  return (
    <div className="container">
      <button className="back-link" onClick={() => navigate("/")}>
        ← COME BACK TO HOME
      </button>
      <h2 className="section-title">OUR HOODIES</h2>

      {loading ? (
        <p>Loading collection...</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id_producto_perso!}
              className="product-card-container"
            >
              <ProductCard
                product={product}
                onSelect={(id) => navigate(`/products/${id}`)}
              />
              <CartButton
                product={product}
                cart={cart}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onDecreaseQuantity={onDecreaseQuantity}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Hoodies;
