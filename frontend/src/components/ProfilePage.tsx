import { useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";
import "../styles/profile-page.css";

function ProfilePage() {
  const { customer, setCustomer } = useUser();
  const navigate = useNavigate();
  const PORT = 3000;
  const ROUTE = `http://localhost:${PORT}/`;

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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="profile-page-container">
        <div className="profile-content">
          {/* Header */}
          <div className="profile-header">
            <button className="btn-back" onClick={handleGoBack}>
              ← Back
            </button>
            <h1>My Profile</h1>
            <div style={{ width: "60px" }} />
          </div>

          {/* Profile Info Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              <span className="material-symbols-outlined">account_circle</span>
            </div>

            <div className="profile-info">
              <div className="info-group">
                <label>Email</label>
                <p>{customer?.email || "N/A"}</p>
              </div>

              <div className="info-group">
                <label>Role</label>
                <p className={`role-badge ${customer?.role}`}>
                  {customer?.role || "N/A"}
                </p>
              </div>

              <div className="info-group">
                <label>User ID</label>
                <p>{customer?.id || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <button className="btn-primary" onClick={() => navigate("/")}>
              Go to Home
            </button>
            <button className="btn-danger" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
