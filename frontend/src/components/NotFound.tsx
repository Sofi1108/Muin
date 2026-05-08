import { useNavigate } from "react-router-dom";
import "../styles/not-found.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="policy-page-wrapper not-found-wrapper">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-header">PAGE NOT FOUND</h1>
        <p className="not-found-message">
          It seems your <strong>Nindo</strong> has led you to a path that does
          not exist. The page you are looking for has been moved or sealed away.
        </p>
        <button className="not-found-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
