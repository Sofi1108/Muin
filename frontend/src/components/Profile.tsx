import "../styles/cart-summary.css";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";

function Profile() {
  const { customer } = useUser();
  const navigate = useNavigate();

  return (
    <div className="Profile">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div className="material-symbols-outlined" id="profile-icon">
        <Link to="/profile">person</Link>
      </div>
    </div>
  );
}

export default Profile;
