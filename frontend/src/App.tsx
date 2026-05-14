import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";

import { useNavigate } from "react-router-dom";

import Header from "./components/Header";
import ProductDetail from "./components/ProductDetail";
import HeroSection from "./components/HeroSection";
import HeroSectionSmall from "./components/HeroSectionSmall";
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
import IntranetHome from "./components/IntranetHome";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import IntranetWorkCouncil from "./components/IntranetWorkCouncil";
import IntranetNews from "./components/IntranetNews";
import { IntranetWorkCapsules } from "./components/IntranetWorkCapsules";
import IntranetHumanResourcer from "./components/IntranetHumanResourcer";
import ContactPage from "./components/ContactPage";
import AboutUsPage from "./components/AboutUsPage";
import CareersPage from "./components/Carreers";
import Fichajes from "./components/Fichajes";
import ProductsPanel from "./components/ProductsPanel";
import EditProductPage from "./components/EditProductPage";
import CreateProductPage from "./components/CreateProductPage";
import ShipmentsPanel from "./components/ShipmentsPanel";
import CheckoutPage from "./components/CheckoutPage";
import Tickets from "./components/Tickets";
import ProductCarousel from "./components/ProductCarrousel";
import AdminUsers from "./components/AdminUsers";
import PersonalizarProducto from "./components/PersonalizarProducto";
import AdminDesignsPanel from "./components/AdminDesignsPanel";
import AdminCustomDesignsPanel from "./components/AdminCustomDesignsPanel";

import type { Product, CartItem } from "../types";

function App() {
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  const navigate = useNavigate();

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
      const existing = prev.find(
        (i) => i.product.id_producto_perso === product.id_producto_perso,
      );
      const stock = product.cantidad_u ?? product.cantidad_u ?? 0;
      if (existing) {
        if (existing.quantity >= stock) return prev;
        return prev.map((i) =>
          i.product.id_producto_perso === product.id_producto_perso
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number): void => {
    setCart((prev) =>
      prev.filter((i) => i.product.id_producto_perso !== productId),
    );
  };

  const decreaseQuantity = (productId: number): void => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id_producto_perso === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  return (
    <div id="app-wrapper">
      <Header
        cart={cart}
        onAddToCart={addToCart}
        onDecreaseQuantity={decreaseQuantity}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Categories />
                <ProductCarousel
                  products={products}
                  title="NUEVOS PRODUCTOS"
                  tag="COLECCIÓN 2026"
                  onSelect={(id) => navigate(`/products/${id}`)}
                />
              </>
            }
          />

          <Route
            path="/profile"
            element={
              <>
                <ProfilePage />
              </>
            }
          />

          <Route
            path="/products/shirts"
            element={
              <>
                <HeroSectionSmall />
                <Shirts
                  cart={cart}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onDecreaseQuantity={decreaseQuantity}
                />
              </>
            }
          />
          <Route
            path="/products/hoodies"
            element={
              <>
                <HeroSectionSmall />
                <Hoodies
                  cart={cart}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onDecreaseQuantity={decreaseQuantity}
                />
              </>
            }
          />
          <Route
            path="/products/accessories"
            element={
              <>
                <HeroSectionSmall />
                <ComingSoon />
              </>
            }
          />
          <Route path="/products/sales" element={<Sales />} />
          <Route
            path="/products/:id"
            element={
              <>
                <HeroSectionSmall />
                <ProductDetail
                  cart={cart}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onDecreaseQuantity={decreaseQuantity}
                />
              </>
            }
          />
          <Route path="/privacy-terms" element={<PrivacyTerms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/intranet"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <IntranetHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/intranet/work-council"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <IntranetWorkCouncil />
              </PrivateRoute>
            }
          />
          <Route
            path="/intranet/news"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <IntranetNews />
              </PrivateRoute>
            }
          />
          <Route
            path="/intranet/hr"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <IntranetHumanResourcer />
              </PrivateRoute>
            }
          />
          <Route
            path="/intranet/work-capsules"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <IntranetWorkCapsules />
              </PrivateRoute>
            }
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/intranet/fichajes" element={<Fichajes />} />
          <Route
            path="/intranet/tickets"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <Tickets />
              </PrivateRoute>
            }
          />
          <Route
            path="/intranet/admin-users"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/intranet/admin-designs"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminDesignsPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/intranet/admin-custom-designs"
            element={
              <PrivateRoute roles={["admin"]}>
                <AdminCustomDesignsPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <ProductsPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <PrivateRoute roles={["admin"]}>
                <CreateProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/shipments"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <ShipmentsPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <PrivateRoute roles={["admin", "empleado"]}>
                <EditProductPage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/personalize" 
            element={
              <>
                <HeroSectionSmall />
                <PersonalizarProducto onAddToCart={addToCart} />
              </>
            } 
          />

          <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
