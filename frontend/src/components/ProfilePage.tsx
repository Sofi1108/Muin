import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import HeroSectionSmall from "./HeroSectionSmall";
import "../styles/profile-page.css";

function ProfilePage() {
  const { customer, setCustomer } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setCustomer(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Error al desconectar:", error);
    }
  };

  return (
    <div className="profile-page-container">
      <HeroSectionSmall />

      <div className="profile-content-wrapper">
        {/* SECCIÓN SUPERIOR: AVATAR + INFO */}
        <div className="profile-main-section">
          <div className="profile-avatar-column">
            <div className="avatar-circle-large">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>

          <div className="profile-info-column">
            <div className="profile-info-header">
              <h2>Hi, {customer?.name || "Username"}</h2>
              <span className="material-symbols-outlined" id="edit-icon">
                edit
              </span>
            </div>

            <div className="info-field">
              <label>Email</label>
              <p>{customer?.email || "email@email.com"}</p>
            </div>

            <div className="info-field">
              <label>Contact</label>
              <p>{customer?.phone || "123 456 789"}</p>
            </div>

            <div className="profile-button-group">
              <button className="btn-muin-black">CHECK ORDERS</button>
              <button className="btn-muin-white-outline" onClick={handleLogout}>
                LOGOUT
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: ORDER STATUS */}
        <div className="order-status-section">
          <h3>ORDER STATUS</h3>
          <div className="status-container">
            <div className="status-line"></div>
            <div className="status-points">
              <div className="point active">
                <span>CONFIRMED</span>
              </div>
              <div className="point">
                <span>SENDING</span>
              </div>
              <div className="point">
                <span>DELIVERED</span>
              </div>
            </div>
            <div className="status-icon-box">
              <span className="material-symbols-outlined">package_2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
