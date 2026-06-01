import { useNavigate } from "react-router-dom";

import type { CartItem, Product } from "../../types";
import { useUser } from "../context/UserContext";

import CartSummary from "./CartSummary";
import Profile from "./Profile";
import Logo from "./Logo";

import "../styles/Header.css";

interface HeaderProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onDecreaseQuantity: (productId: number) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

function Header({
  cart,
  onAddToCart,
  onDecreaseQuantity,
  isDarkMode,
  onToggleDarkMode,
}: HeaderProps) {
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const { customer, setCustomer } = useUser();

  const handleLogout = async () => {
    try {
      await fetch(`${ROUTE}api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setCustomer(null);
      navigate("/");
    } catch (error) {
      console.error("Error al desconectar:", error);
    }
  };

  return (
    <header>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <Logo onSelect={() => navigate("/")} />
      <nav className="nav-icons">
        <div 
          className={`theme-toggle-container ${isDarkMode ? 'dark' : 'light'}`} 
          onClick={onToggleDarkMode}
        >
          <div className="theme-toggle-knob">
            <span className="material-symbols-outlined theme-toggle-icon">
              {isDarkMode ? 'nights_stay' : 'light_mode'}
            </span>
          </div>
          <span className="theme-toggle-label">
            {isDarkMode ? 'NIGHTMODE' : 'DAYMODE'}
          </span>
        </div>
        <div
          className="material-symbols-outlined"
          id="community-icon"
          onClick={() => navigate("/community")}
          style={{ cursor: "pointer" }}
        >
          public
        </div>
        <Profile />
        <CartSummary
          items={cart}
          onAddToCart={onAddToCart}
          onDecreaseQuantity={onDecreaseQuantity}
          onConfirm={() => {
            if (customer) navigate("/checkout");
            else navigate("/login");
          }}
        />
      </nav>
    </header>
  );
}

export default Header;
