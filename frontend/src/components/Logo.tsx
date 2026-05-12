import { useNavigate } from "react-router-dom";

import "../styles/Header.css";

interface LogoProps {
  onSelect: () => void;
}

function Logo({ onSelect }: LogoProps) {
  return (
    <div
      className="logo-container"
      onClick={onSelect}
      style={{ cursor: "pointer" }}
    >
      <div className="logo-kanji">無印</div>
      <div className="logo-text">MUIN</div>
    </div>
  );
}

export default Logo;
