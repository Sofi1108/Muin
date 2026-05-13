import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product, CartItem } from "../../types";
import CartButton from "./CartButton";
import "../styles/product-detail.css";

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
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

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

  return (
    <div className="product-detail-container">
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
    </div>
  );
}

export default ProductDetail;
