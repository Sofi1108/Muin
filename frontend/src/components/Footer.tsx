import { Link } from "react-router-dom";
import "../styles/Footer.css";
import {
  FaYoutube,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";

const Footer = () => {
  const reviews = [
    {
      title: "Any questions?",
      body: "Got a doubt? From order tracking to custom designs, our team is here to help you navigate. We'll respond faster than a teleportation jutsu.",
      footer: "Reach out anytime.",
      date: "Link to contact page",
    },
    {
      title: "About us",
      body: "MUIN means No Seal. We believe your passion shouldn't be restricted by labels or boundaries. Inspired by the stories that define us, we create premium anime streetwear for those who follow their own path.",
      footer: "Your nindo needs no seal.",
      date: "Link to about us page",
    },
    {
      title: "Wanna work with us?",
      body: "Join the village. We are looking for artists and creators who share our vision. If you have a story to tell, let’s build together. Write us and let's create something epic.",
      footer: "Define your path with us.",
      date: "Link to careers page",
    },
  ];

  return (
    <footer className="main-footer">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <div className="footer-cards-container">
        {reviews.map((item, index) => (
          <section key={index} className="footer-card">
            <h3>{item.title}</h3>
            <p className="review-text">{item.body}</p>
            <div className="card-author">
              <span className="post-date">{item.date}</span>
              <Link to="/contact" className="footer">
                {item.footer}
              </Link>
            </div>
          </section>
        ))}
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom-section">
        <div className="social-links">
          <a href="#" className="social-icon">
            <i className="fa-brands fa-youtube"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>

        <div className="footer-brand">
          <Link to="/" className="japanese-logo">
            無印
          </Link>
          <nav className="footer-legal-inline">
            <Link to="/privacy-terms">Privacy Terms</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/cookies-policy">Cookies Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
