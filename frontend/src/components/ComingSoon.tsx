import { useNavigate } from "react-router-dom";
import "../styles/comming-soon.css";

function CommingSoon() {
  const navigate = useNavigate();

  return (
    <div className="comming-soon">
      <h1 className="comming-soon-header">COMING SOON</h1>
      <p className="comming-soon-message">
        WE ARE WORKING HARD TO BRING YOU THIS FEATURE. STAY TUNED FOR UPDATES
        AND EXCITING ANNOUNCEMENTS. THANK YOU FOR YOUR PATIENCE AND SUPPORT!
      </p>
      <button className="comming-soon-btn" onClick={() => navigate("/")}>
        COME BACK
      </button>
    </div>
  );
}

export default CommingSoon;
