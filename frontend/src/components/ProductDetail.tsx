import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product, CartItem } from "../../types";
import CartButton from "./CartButton";
import { useUser } from "../context/UserContext"; // Añadido para verificar sesión/roles
import { StarRating } from "./StarRating"; // Añadido el componente de estrellas
import "../styles/product-detail.css";
import { ReviewModal } from "./ReviewModal";

interface ProductDetailProps {
  cart: CartItem[];
  onAddToCart: (product: Product & { selectedSize?: string }) => void;
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
  const { customer } = useUser(); // Obtenemos el usuario actual
  
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  interface Review {
    id_resena: number;
    puntuacion: number;
    titulo: string;
    comentario: string;
    fecha_creacion: string;
    nombre_usuario: string;
  }

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleSubmitReview = async (reviewData: { rating: number; title: string; comment: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Importante si usas cookies/sesiones para saber quién es el usuario
        body: JSON.stringify({
          id_producto_perso: product?.id_producto_perso,
          puntuacion: reviewData.rating,
          titulo: reviewData.title,
          comentario: reviewData.comment
        })
      });

      if (!response.ok) throw new Error("Error submitting review");

      alert("Review added successfully!");
      setIsReviewModalOpen(false); // Cerramos el modal
      window.location.reload(); // Recargamos para que PostgreSQL recalcule la media y se muestre

    } catch (error) {
      console.error(error);
      alert("There was an error posting your review.");
    }
  };
  
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!selectedSize) {
      alert("Please, select a size before proceeding to checkout.");
      return;
    }
    onAddToCart({ ...product, selectedSize });
    navigate("/checkout");
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          setError(true);
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/api/products/${id}/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error("Reviews not found");
        return res.json();
      })
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [id]);

  const handleAddToCartWithLogic = () => {
    if (!product) return;
    if (!selectedSize) {
      alert("Please, select a size before adding to cart.");
      return;
    }

    onAddToCart({ ...product, selectedSize });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Lógica para añadir reseña
  const handleAddReview = () => {
    if (!customer) {
      alert("Please log in to add a review.");
      return;
    }
    setIsReviewModalOpen(true);
  };

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          <h2>The product with ID {id} does not exist.</h2>
          <button className="product-detail_back" onClick={handleBack}>
            BACK TO CATALOG
          </button>
        </div>
      </div>
    );
  }

  if (!product) return <div className="loading">Loading...</div>;

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="product-detail-container" id="product-detail_back">
      <div className={`cart-toast ${showToast ? "show" : ""}`}>
        <span className="material-symbols-outlined">check_circle</span>
        ADDED TO CART
      </div>

      <button className="product-detail_back" onClick={handleBack}>
        ← BACK TO CATALOG
      </button>

      <div className="product-detail-grid">
        {/* LEFT COLUMN: SINGLE IMAGE */}
        <div className="product-images-section">
          <div className="main-image-wrapper">
            <img
              className="product-detail_img"
              src={product.url_imagen}
              alt={product.nombre_producto_perso}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: INFO */}
        <div className="product-info-section">
          <span className="tag-badge">LIMITED EDITION</span>
          
          <h1 className="product-title">{product.nombre_producto_perso}</h1>
          
          {/* ESTRELLAS DEBAJO DEL TÍTULO */}
          <div className="product-rating-header" style={{ marginBottom: "1rem" }}>
            <StarRating 
              score={safeReviews.length > 0 ? (safeReviews.reduce((acc, r) => acc + Number(r.puntuacion || 0), 0) / safeReviews.length) : Number(product.nota_media || 0)} 
              // Le pasamos un 1 falso para que siempre pinte estrellas (llenas o vacías) 
              // y no muestre el texto de "There are no reviews" aquí arriba
              reviewCount={safeReviews.length > 0 ? safeReviews.length : 1} 
              size="large" 
            />
            <span style={{ marginLeft: "8px", fontSize: "14px", color: "#666" }}>
              ({safeReviews.length})
            </span>
          </div>

          <p className="product-description">{product.descripcion}</p>
          <div className="price-tag">{product.precio_producto_perso}€</div>

          <div className="size-selector-container">
            <label>SELECT YOUR SIZE</label>
            <div className="size-selector">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS IN ONE LINE */}
          <div className="actions-group">
            <div className="cart-btn-muin-wrapper">
              <CartButton
                product={product}
                cart={cart}
                onAddToCart={handleAddToCartWithLogic}
                onRemoveFromCart={onRemoveFromCart}
                onDecreaseQuantity={onDecreaseQuantity}
              />
            </div>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              BUY NOW
            </button>
          </div>

          <div className="extra-info">
            <h3>SHIPPING INFORMATION</h3>
            <ul>
              <li>Premium Cotton 240 GSM.</li>
              <li>Oversize / Unisex fit.</li>
              <li>Shipping in 24/48 hours.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* NUEVA SECCIÓN DE RESEÑAS EN LA PARTE INFERIOR */}
      <div className="reviews-section" style={{ marginTop: "4rem", borderTop: "1px solid #eee", paddingTop: "2rem" }}>
        <h2>CUSTOMER REVIEWS</h2>
        
        {safeReviews.length === 0 ? (
          // ESTADO VACÍO (0 Reseñas)
          <div className="no-reviews-container" style={{ marginTop: "1rem", backgroundColor: "#f9f9f9", padding: "2rem", borderRadius: "8px" }}>
            <p style={{ marginBottom: "1rem", color: "#555" }}>
              There are no reviews currently. Have you purchased this product? Tell us about your experience.
            </p>
            <button onClick={handleAddReview} className="btn-add-review">
              Add review
            </button>
          </div>
        ) : (
          // ESTADO CON RESEÑAS
          <div className="reviews-list-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <p>Based on {safeReviews.length} reviews</p>
              <button onClick={handleAddReview} className="btn-add-review">
                Write a review
              </button>
            </div>
            
            <div className="review-list" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {safeReviews.map((review) => (
                <div 
                  key={review.id_resena} 
                  className="review-card" 
                  style={{ 
                    borderBottom: "1px solid #eee", 
                    paddingBottom: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <StarRating score={review.puntuacion} size="small" reviewCount={1} />
                      <strong style={{ fontSize: "1.1rem" }}>{review.titulo}</strong>
                    </div>
                    <span style={{ fontSize: "0.9rem", color: "#888" }}>
                      {review.fecha_creacion && !isNaN(Date.parse(review.fecha_creacion))
                        ? new Date(review.fecha_creacion).toLocaleDateString()
                        : "Fecha no disponible"}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: "#333", lineHeight: "1.5" }}>{review.comentario}</p>
                  <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 500 }}>
                    — Por {review.nombre_usuario}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        onSubmit={handleSubmitReview} 
      />
    </div>
  );
}

export default ProductDetail;