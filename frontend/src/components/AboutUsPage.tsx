import "../styles/about-us-page.css";

function AboutUsPage() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="hero-content">
          <span className="japanese-bg">無韻</span>
          <h1 className="main-title">MUIN</h1>
          <p className="subtitle">YOUR NINDO NEEDS NO SEAL</p>
        </div>
      </section>

      <div className="about-content-grid">
        <section className="about-card capsule">
          <h2 className="section-title">THE CONCEPT</h2>
          <p>
            In Japanese, <span className="highlight">Muin (無韻)</span>{" "}
            literally translates to "without rhyme." In classical poetry, rhyme
            creates a predictable structure. We chose this name because we stand
            for the
            <span className="highlight"> unpredictable</span>.
          </p>
          <p>
            We strip away the noise of traditional merch to find beauty in
            silence, raw textures, and architectural silhouettes.
          </p>
        </section>

        <section className="about-card capsule">
          <h2 className="section-title">THE MISSION</h2>
          <p>
            MUIN was born from a frustration: anime clothing was either too
            childish or poor quality. We bridge the gap between{" "}
            <span className="highlight">High-End Streetwear</span> and
            <span className="highlight"> Otaku Culture</span>.
          </p>
          <ul className="specs-list">
            <li>Premium 240 GSM Heavy Cotton.</li>
            <li>Minimalist aesthetic for the modern daily life.</li>
            <li>Oversized patterns crafted for style and comfort.</li>
          </ul>
        </section>

        <section className="philosophy-section">
          <div className="nindo-box">
            <span className="label">PHILOSOPHY</span>
            <h2 className="slogan-text">"YOUR NINDO NEED NO SEAL"</h2>
            <p className="nindo-desc">
              Your "Ninja Way" is your own conviction. It doesn't require hand
              signs, external validation, or permission. At MUIN, we believe
              your passion should be worn with pride, but without the need for
              loud labels.
            </p>
          </div>
        </section>
      </div>

      <footer className="about-footer">MUIN CLOTHING CO. — EST. 2026</footer>
    </div>
  );
}

export default AboutUsPage;
