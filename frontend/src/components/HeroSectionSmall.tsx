import { useNavigate } from "react-router-dom";
import CartSummary from "./CartSummary";
import type { CartItem } from "../../types";
import Profile from "./Profile";

import "../styles/HeroSectionSmall.css";
import { useUser } from "../context/UserContext";

function HeroSectionSmall() {
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  return (
    <div className="hero-section-small">
      <h1>MUIN</h1>
      <p>YOUR NINDO NEEDS NO SEAL</p>
    </div>
  );
}

export default HeroSectionSmall;
