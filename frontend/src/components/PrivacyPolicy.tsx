import type { ReactNode } from "react";
import "../styles/privacy-policy.css"; // Asegúrate de crear este CSS o usar uno global

export default function PrivacyPolicy(): ReactNode {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-container">
        {/* Header estilo Apple con 3 frases/columnas */}
        <header className="policy-header" id="policy-header">
          <div className="header-column">
            <span className="column-label">Document</span>
            <h1 className="column-value">Privacy Policy</h1>
          </div>
          <div className="header-column">
            <span className="column-label">Last Updated</span>
            <p className="column-value">May 8, 2026</p>
          </div>
          <div className="header-column">
            <span className="column-label">Organization</span>
            <p className="column-value">MUIN Customs</p>
          </div>
        </header>

        <div className="policy-content">
          {/* Sección 1 */}
          <section className="policy-section">
            <h2>1. Identification of the Data Controller</h2>
            <p>
              MUIN is responsible for the processing of your personal data
              related to the sale of personalized anime apparel.
            </p>
            <ul className="policy-list">
              <li>
                <strong>Entity:</strong> MUIN Clothing Line
              </li>
              <li>
                <strong>Physical Address:</strong> [Insert Full Address Here]
              </li>
              <li>
                <strong>Contact Email:</strong>{" "}
                <a href="mailto:a27287@svalero.com">a27287@svalero.com</a>
              </li>
            </ul>
          </section>

          {/* Sección 2 */}
          <section className="policy-section">
            <h2>2. Processing of Customer Data</h2>
            <p>
              When purchasing personalized products, we collect specific
              information to ensure the highest quality in your custom "Nindo"
              designs.
            </p>
            <ul className="policy-list">
              <li>
                <strong>Data collected:</strong> Name, shipping address, and
                personalization files (images, texts).
              </li>
              <li>
                <strong>Purpose:</strong> Order fulfillment, shipping
                management, and invoicing.
              </li>
              <li>
                <strong>Legal basis:</strong> Execution of a purchase contract
                and explicit consent.
              </li>
            </ul>
          </section>

          {/* Sección 3 */}
          <section className="policy-section">
            <h2>3. Data Transfer to Third Parties</h2>
            <p>
              We only share essential information with trusted partners to
              complete your order:
            </p>
            <div className="info-box">
              <ul className="policy-list">
                <li>
                  <strong>Payment:</strong> Secure gateways like Stripe or
                  PayPal.
                </li>
                <li>
                  <strong>Logistics:</strong> Delivery services like FedEx or
                  DHL.
                </li>
                <li>
                  <strong>Hosting:</strong> Secure infrastructure provided by
                  AWS.
                </li>
              </ul>
            </div>
          </section>

          {/* Sección 4 */}
          <section className="policy-section">
            <h2>4. Your Rights (ARCO)</h2>
            <p>You maintain full sovereignty over your personal data:</p>
            <ul className="policy-list">
              <li>
                <strong>Access:</strong> Request a copy of all data we hold.
              </li>
              <li>
                <strong>Rectification:</strong> Correct any inaccuracies in your
                profile.
              </li>
              <li>
                <strong>Deletion:</strong> Request the total removal of your
                data ("The Clean Slate").
              </li>
              <li>
                <strong>Objection:</strong> Opt-out of non-essential data
                processing.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
