import { useNavigate } from "react-router-dom";

// Importa las imágenes correctamente desde su ubicación
import shirtImg from "../assets/Img/shirtCategorie.jpg";
import hoodieImg from "../assets/Img/hoodieCategorie.jpg";
import comingSoonImg from "../assets/Img/comingsoon.png";
import salesImg from "../assets/Img/sales.png";
import customizeImg from "../assets/Img/shirtCustomize.jpg";

import "../styles/Categories.css";

function Categories() {
  const navigate = useNavigate();

  return (
    <div className="categories">
      <div className="column" onClick={() => navigate("/products/shirts")}>
        <img src={shirtImg} />
        <span>SHIRTS</span>
      </div>
      <div className="column" onClick={() => navigate("/products/hoodies")}>
        <img src={hoodieImg} />
        <span>HOODIES</span>
      </div>
      <div className="column" onClick={() => navigate("/personalize")}>
        <img src={customizeImg} style={{ filter: "hue-rotate(90deg)" }} />
        <span>CUSTOMIZE</span>
      </div>
      <div className="column" onClick={() => navigate("/products/accessories")}>
        <img src={comingSoonImg} />
        <span>ACCESORIES</span>
      </div>

      <div className="column" onClick={() => navigate("/products/sales")}>
        <img src={salesImg} />
        <span>SALES</span>
      </div>
    </div>
  );
}

export default Categories;
