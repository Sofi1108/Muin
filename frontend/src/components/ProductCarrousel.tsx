import { useRef } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "../../types";
import "../styles/product-carousel.css";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  tag?: string;
  onSelect?: (id: number) => void;
}

const ProductCarousel = ({
  products,
  title = "NEW DROPS",
  tag = "COLLECTION 2026",
  onSelect,
}: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320; // Ancho de la card + gap
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="muin-carousel-section">
      <div className="carousel-container">
        {/* HEADER DEL CARRUSEL */}
        <div className="carousel-header">
          <div className="header-text">
            <span className="carousel-tag">{tag}</span>
            <h2 className="carousel-title">{title}</h2>
          </div>

          <div className="carousel-nav-buttons">
            <button onClick={() => scroll("left")} className="nav-btn">
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
            <button onClick={() => scroll("right")} className="nav-btn">
              <span className="material-symbols-outlined">
                arrow_forward_ios
              </span>
            </button>
          </div>
        </div>

        {/* TRACK DE PRODUCTOS */}
        <div className="muin-carousel-track" ref={scrollRef}>
          {products && products.length > 0 ? (
            products.slice(0, 20).map((product) => (
              <div className="carousel-item" key={product.id_producto_perso}>
                <ProductCard product={product} onSelect={onSelect} />
              </div>
            ))
          ) : (
            <div
              style={{ padding: "2rem", textAlign: "center", width: "100%" }}
            >
              <p>No hay productos disponibles</p>
            </div>
          )}

          <div className="carousel-spacer"></div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
