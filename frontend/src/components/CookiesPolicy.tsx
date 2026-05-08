import React from "react";
import "../styles/cookies-policy.css";

const CookiesPolicy: React.FC = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-container">
        <header className="policy-header">
          <div className="header-column">
            <span className="column-label">Document</span>
            <h1 className="column-value">MUIN Cookie Policy</h1>
          </div>
          <div className="header-column">
            <span className="column-label">Last Updated</span>
            <p className="column-value">May 6, 2026</p>
          </div>
          <div className="header-column">
            <span className="column-label">Standard</span>
            <p className="column-value">GDPR & DPF Compliant</p>
          </div>
        </header>

        <main className="policy-content">
          <section className="policy-section">
            <h2>1. What are cookies and why do we use them?</h2>
            <p>
              Cookies are small text files stored in your browser. At MUIN, we
              use them strictly to:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Technical Operation:</strong> Maintain your shopping
                cart and secure file uploads.
              </li>
              <li>
                <strong>Protection:</strong> Secure sessions for users and
                corporate intranet.
              </li>
              <li>
                <strong>Preferences:</strong> Remember your privacy choices for
                1 year.
              </li>
              <li>
                <strong>Analysis:</strong> Anonymous traffic measurement (only
                with authorization).
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. Specific cookies used on our platform</h2>
            <p>
              Based on our React-based configuration, we classify cookies as
              follows:
            </p>

            <div className="cookie-group">
              <h3>A. Technical and Security Cookies (Strictly Necessary)</h3>
              <p className="group-desc">
                Essential for website operation. Cannot be deactivated.
              </p>
              <div className="table-wrapper">
                <table className="cookie-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Specific Purpose</th>
                      <th>Expiration</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>muin_cookie_consent</strong>
                      </td>
                      <td>
                        Saves your privacy preferences regarding non-mandatory
                        cookies.
                      </td>
                      <td>1 year</td>
                      <td>First-party</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>user_session</strong>
                      </td>
                      <td>
                        Keeps user/employee session active using Secure &
                        SameSite=Strict attributes.
                      </td>
                      <td>Session / 1hr</td>
                      <td>First-party</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>csrf_token</strong>
                      </td>
                      <td>
                        Security token to prevent forgery attacks on forms and
                        data uploads.
                      </td>
                      <td>Session</td>
                      <td>First-party</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="cookie-group">
              <h3>B. Analytical Cookies (Optional)</h3>
              <p className="group-desc">
                Only installed with your express consent.
              </p>
              <div className="table-wrapper">
                <table className="cookie-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Specific Purpose</th>
                      <th>Expiration</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>_ga / _gid</strong>
                      </td>
                      <td>
                        Google Analytics. Measures interaction and visit
                        statistics.
                      </td>
                      <td>2 years / 24hr</td>
                      <td>Third-party</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Processing of Sensitive Data (Health) and Intranet</h2>
            <p>
              Due to the nature of MUIN’s personalized products, we establish
              these guarantees:
            </p>
            <ul className="policy-list">
              <li>
                <strong>Zero storage of medical data:</strong> No cookie saves
                medical information or files. The <code>user_session</code> acts
                solely as a temporary encrypted key.
              </li>
              <li>
                <strong>Intranet Isolation:</strong> Employee session cookies
                are independent, destroyed upon closing the tab or after
                inactivity.
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. International Transfers (AWS)</h2>
            <p>
              Our infrastructure uses <strong>Amazon Web Services (AWS)</strong>{" "}
              in Northern Virginia (USA).
            </p>
            <p className="info-box">
              Data is transferred under the{" "}
              <strong>Data Privacy Framework (DPF)</strong>, guaranteeing
              security measures equivalent to the European GDPR.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. How to manage or revoke your consent?</h2>
            <p>You can change your preferences anytime:</p>
            <ul className="policy-list">
              <li>
                <strong>Website:</strong> Click the floating "Cookie Settings"
                button at the bottom corner.
              </li>
              <li>
                <strong>Browser:</strong> Configure settings in Google Chrome,
                Firefox, Safari, or Edge.
              </li>
            </ul>
            <p className="warning-note">
              <strong>Note:</strong> Blocking Technical Cookies will prevent
              login and processing personalized orders.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CookiesPolicy;
