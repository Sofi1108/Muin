import { Link } from "react-router-dom";
import "../styles/contact-page-form.css";
export default function ContactPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="btn-muin-back">
          ←
        </Link>
        <h2 className="auth-title">CONTACT US</h2>
        <p className="auth-subtitle">LET US HELP YOU</p>

        <form className="auth-form">
          <div className="input-group">
            <label>EMAIL</label>
            <input
              type="email"
              className="muin-input"
              required
              placeholder="name@email.com"
            />
          </div>

          <div className="input-group">
            <label>MESSAGE</label>
            <textarea className="muin-input_textarea" required placeholder="" />
          </div>

          <button type="submit" className="btn-muin-black-full">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}
