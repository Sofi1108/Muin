import React from "react";
import "../styles/privacy-terms.css";

const PrivacyTerms: React.FC = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-container">
        <header className="policy-header">
          <div className="header-column">
            <span className="column-label">Document</span>
            <h1 className="column-value">Privacy Terms</h1>
          </div>
          <div className="header-column">
            <span className="column-label">Last Updated</span>
            <p className="column-value">May 8, 2026</p>
          </div>
          <div className="header-column">
            <span className="column-label">Status</span>
            <p className="column-value">Official & Binding</p>
          </div>
        </header>

        <main className="policy-content">
          <section className="policy-section">
            <h2>1. Our Privacy Commitment</h2>
            <p>
              At <strong>MUIN</strong>, we respect your "Nindo". Your privacy is
              a fundamental right, not a feature. This document outlines how we
              protect your personal data and the files you upload for
              customization.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Data We Collect</h2>
            <p>
              To provide our services, we collect only the strictly necessary
              information:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Account Info:</strong> Name, email, and encrypted
                credentials.
              </li>
              <li>
                <strong>Order Data:</strong> Shipping address and transaction
                history.
              </li>
              <li>
                <strong>Personalization Files:</strong> Images and texts you
                upload for your custom apparel.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Secure Processing</h2>
            <p>
              Your uploaded designs are processed through secure channels. We do
              not use your personal designs for marketing purposes without your
              explicit "Seal" (consent).
            </p>
            <div className="info-box">
              <p>
                <strong>Security Protocol:</strong> All data transfers are
                encrypted via SSL/TLS and stored in AWS secure regions.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Your Rights</h2>
            <p>You have full control over your information:</p>
            <ul className="policy-list">
              <li>Right to access and export your data.</li>
              <li>Right to rectify incorrect information.</li>
              <li>
                Right to "The Great Erasure" (request permanent deletion of your
                account).
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyTerms;
