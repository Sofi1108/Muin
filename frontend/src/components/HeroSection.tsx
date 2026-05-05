import { useNavigate } from "react-router-dom";
import CartSummary from "./CartSummary";
import type { CartItem } from "../../types";
import Profile from "./Profile";

import "../styles/HeroSection.css";
import { useUser } from "../context/UserContext";

function HeroSection() {
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  return (
    <div className="hero-section">
      <h1>MUIN</h1>
      <p>YOUR NINDO NEEDS NO SEAL</p>
      <button onClick={() => navigate("/products")} className="hero-button">
        SHOP NOW
      </button>
    </div>
  );
}

export default HeroSection;
