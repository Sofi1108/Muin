import { useNavigate } from "react-router-dom";
import CartSummary from "./CartSummary";
import type { CartItem } from "../../types";
import Profile from "./Profile";

import "../styles/HeroSectionSmall.css";
import { useUser } from "../context/UserContext";

function HeroSectionIntranet() {
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

  return (
    <div className="hero-section-small">
      <h1>EMPLOYEES AREA</h1>
      <p> LATES UPDATES, SCHEDULES AND USEFUL RESOURCES FOR MUIN EMPLOYEES.</p>
    </div>
  );
}

export default HeroSectionIntranet;
