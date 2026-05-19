import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/careers.css";

const Careers = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="careers-container success-state">
        <div className="capsule success-box">
          <span className="material-symbols-outlined icon-large">
            group_add
          </span>
          <h1>APPLICATION RECEIVED</h1>
          <p>
            The village has received your scroll. Our elders will review your
            path and contact you soon.
          </p>
          <button
            className="btn-muin-black"
            onClick={() => setSubmitted(false)}
          >
            SEND ANOTHER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="careers-container" id="careers-header">
      <div className="careers-grid">
        {/* LEFT COLUMN: INFO */}
        <div className="careers-info">
          <span className="tag">JOIN THE VILLAGE</span>
          <h1 className="main-title">
            Wanna build <br /> with us?
          </h1>
          <p className="description">
            MUIN is constantly looking for rebels, artists, and creators who
            don't follow the rhythm of the masses. If you have a unique vision
            and your <span className="highlight">Nindo</span> aligns with ours,
            we want to meet you.
          </p>

          <div className="perks">
            <div className="perk-item">
              <strong>Creative Freedom</strong>
              <p>No seals, no boundaries. Your art, your rules.</p>
            </div>
            <div className="perk-item">
              <strong>Remote-First</strong>
              <p>Work from your own hidden village.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="careers-form-wrapper">
          <form className="muin-capsule-form" onSubmit={handleSubmit}>
            <div className="input-row">
              <div className="input-group">
                <label>FULL NAME</label>
                <input type="text" placeholder="UCHIHA ITACHI" required />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>EMAIL ADDRESS</label>
                <input type="email" placeholder="NINDO@MUIN.COM" required />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>ROLE / SKILL</label>
                <select required>
                  <option value="">SELECT YOUR PATH</option>
                  <option value="design">Graphic Design</option>
                  <option value="marketing">Marketing / Growth</option>
                  <option value="fashion">Fashion Design</option>
                  <option value="other">Other Art Forms</option>
                </select>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>PORTFOLIO LINK (OR SOCIALS)</label>
                <input type="url" placeholder="HTTPS://..." required />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>TELL US YOUR STORY</label>
                <textarea
                  rows={4}
                  placeholder="What is your ninja way?"
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn-submit-careers">
              SEND APPLICATION
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Careers;
