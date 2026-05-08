import { useNavigate } from "react-router-dom";
import "../styles/comming-soon.css";

function CommingSoon() {
  const navigate = useNavigate();
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=rocket_launch"
  />;

  return (
    <div className="comming-soon-wrapper">
      <div className="bg-circle-1"></div>
      <div className="bg-circle-2"></div>

      <div className="comming-soon-card">
        <div className="icon-box">
          <span className="material-symbols-outlined">rocket_launch</span>
        </div>
        <h1 className="comming-soon-header">NOT SALES YET</h1>
        <div className="divider"></div>
        <p className="comming-soon-message">
          We are working hard to bring you this feature. Stay tuned for updates
          and exciting announcements. Thank you for your patience and support!
        </p>
        <button className="comming-soon-btn" onClick={() => navigate("/")}>
          GO BACK HOME
        </button>
      </div>
    </div>
  );
}

export default CommingSoon;
