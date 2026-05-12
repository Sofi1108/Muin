import "../styles/cart-summary.css";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";

function Profile() {
  const { customer } = useUser();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (customer) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="Profile"
      onClick={handleProfileClick}
      style={{ cursor: "pointer" }}
    >
      <div className="material-symbols-outlined" id="profile-icon">
        <Link to="/profile">person</Link>
      </div>
    </div>
  );
}

export default Profile;
