import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import CartButton from "./components/CartButton";
import ProductDetail from "./components/ProductDetail";
import HeroSection from "./components/HeroSection";
import Categories from "./components/Categories";
import Shirts from "./components/Shirts";
import Hoodies from "./components/Hoodies";
import ComingSoon from "./components/ComingSoon";
import Sales from "./components/Sales";
import Footer from "./components/Footer";
import PrivacyTerms from "./components/PrivacyTerms";
import PrivacyPolicy from "./components/PrivacyPolicy";
import CookiesPolicy from "./components/CookiesPolicy";
import NotFound from "./components/NotFound";

import type { Product, CartItem } from "../types";

function App() {
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const loadProducts = (): void => {
    fetch(`${ROUTE}api/products`)
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    loadProducts();
  }, []);
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product): void => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number): void => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const decreaseQuantity = (productId: number): void => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  return (
    <div id="app-wrapper">
      <Header />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Categories />
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product.id} className="product-card-container">
                      <CartButton
                        product={product}
                        cart={cart}
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart}
                        onDecreaseQuantity={decreaseQuantity}
                      />
                      <ProductCard
                        product={product}
                        onSelect={(id) => navigate(`/products/${id}`)}
                      />
                    </div>
                  ))}
                </div>
              </>
            }
          />

          <Route
            path="/products/shirts"
            element={
              <Shirts
                cart={cart}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onDecreaseQuantity={decreaseQuantity}
              />
            }
          />
          <Route
            path="/products/hoodies"
            element={
              <Hoodies
                cart={cart}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onDecreaseQuantity={decreaseQuantity}
              />
            }
          />
          <Route path="/products/accessories" element={<ComingSoon />} />
          <Route path="/products/sales" element={<Sales />} />
          <Route
            path="/products/:id"
            element={
              <ProductDetail
                cart={cart}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onDecreaseQuantity={decreaseQuantity}
              />
            }
          />
          <Route path="/privacy-terms" element={<PrivacyTerms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
