import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";

import type { Product, CartItem } from "../types";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import CartButton from "./components/CartButton";
import ProductDetail from "./components/ProductDetail";
import CartSummary from "./components/CartSummary";
import "./App.css";
import HeroSection from "./components/HeroSection";

function App() {
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  const [products, setProducts] = useState<Product[]>([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // // Verificar sesión al montar
  // useEffect(() => {
  //   const verifySession = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${ROUTE}api/auth/me`, {
  //         credentials: "include",
  //       });
  //       if (res.ok) {
  //         const data = await res.json();
  //         setCustomer(data.customer);
  //       } else if (res.status === 401) {
  //         setCustomer(null);
  //       }
  //     } catch (error) {
  //       console.error("Error verificando sesión:", error);
  //       setCustomer(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   verifySession();
  // }, []);

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
        if (existing.quantity >= product.stock) {
          return prev;
        }

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

  const updateQuantity = (productId: number, delta: number): void => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity + delta }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const decreaseQuantity = (productId: number): void => {
    updateQuantity(productId, -1);
  };

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
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
                      onSelect={(id) => navigate(`/product/${id}`)}
                    />
                  </div>
                ))}
              </div>
            </>
          }
        />

        <Route
          path="/product/:id"
          element={
            <>
              <ProductDetail
                cart={cart}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onDecreaseQuantity={decreaseQuantity}
              />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
