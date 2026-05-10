import "../styles/cart-summary.css";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

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
    <div className="Profile" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div className="material-symbols-outlined" id="profile-icon">
        person
      </div>
    </div>
  );
}

export default Profile;
