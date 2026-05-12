import "../styles/Footer.css";
import {
  FaYoutube,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
import { HashLink as Link } from "react-router-hash-link";
const Footer = () => {
  const reviews = [
    {
      title: "Any questions?",
      body: "Got a doubt? From order tracking to custom designs, our team is here to help you navigate. We'll respond faster than a teleportation jutsu.",
      footer: "Reach out anytime.",
      date: "Link to contact page",
      link: "/contact",
    },
    {
      title: "About us",
      body: "MUIN means No Seal. We believe your passion shouldn't be restricted by labels or boundaries. Inspired by the stories that define us, we create premium anime streetwear for those who follow their own path.",
      footer: "Your nindo needs no seal.",
      date: "Link to about us page",
      link: "/about",
    },
    {
      title: "Wanna work with us?",
      body: "Join the village. We are looking for artists and creators who share our vision. If you have a story to tell, let’s build together. Write us and let's create something epic.",
      footer: "Define your path with us.",
      date: "Link to careers page",
      link: "/careers",
    },
  ];

  return (
    <footer className="main-footer">
      <div className="footer-cards-container">
        {reviews.map((item, index) => (
          <Link key={index} to={item.link} className="footer-link">
            <section className="footer-card">
              <h3>{item.title}</h3>
              <p className="review-text">{item.body}</p>
              <div className="card-author">
                <span className="post-date">{item.date}</span>
                <span className="footer-link_text">{item.footer}</span>
              </div>
            </section>
          </Link>
        ))}
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom-section">
        <div className="social-links">
          <a href="https://www.youtube.com" className="social-icon">
            <i className="fa-brands fa-youtube"></i>
          </a>
          <a
            href="https://www.facebook.com/?locale=es_ES"
            className="social-icon"
          >
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a href="https://x.com/home?lang=es" className="social-icon">
            <i className="fa-brands fa-x"></i>
          </a>
          <a href="https://www.instagram.com/?hl=es" className="social-icon">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://es.linkedin.com" className="social-icon">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>

        <div className="footer-brand">
          <Link to="/" className="japanese-logo">
            無印
          </Link>
          <nav className="footer-legal-inline">
            <Link to="/privacy-terms#legal-header">Privacy Terms</Link>
            <Link to="/privacy-policy#policy-header">Privacy Policy</Link>
            <Link to="/cookies-policy#policy-header">Cookies Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
