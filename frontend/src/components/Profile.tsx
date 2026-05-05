import "../styles/cart-summary.css";
import { useUser } from "../context/UserContext";
function Profile() {
  const { customer } = useUser();

  return (
    <div className="Profile">
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
