import { useNavigate } from "react-router-dom";
import CartSummary from "./CartSummary";
import type { CartItem } from "../../types";

function Header() {
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  const raw = sessionStorage.getItem("cart");
  const cart: CartItem[] = raw ? JSON.parse(raw) : [];
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
      <div className="logo-container">
        <a href="./home.html">
          <div className="logo-kanji">無印</div>
          <div className="logo-text">MUIN</div>
        </a>
      </div>
      <nav className="nav-icons">
        <CartSummary
          items={cart}
          onAddToCart={() => {}}
          onDecreaseQuantity={() => {}}
          onConfirm={() => {
            if (customer) {
              navigate("/checkout");
            } else {
              navigate("/login");
            }
          }}
        />
        <span className="material-symbols-outlined" id="profile-icon">
          <a href="./profile.html">person</a>
        </span>
      </nav>
    </header>
  );
}

export default Header;
