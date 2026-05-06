import type { ReactNode } from "react";

export default function PrivacyPolicy(): ReactNode {
  return (
    <>
      <div className="privacy-policy">
        <h2>
          <strong>
            <span>1. Identification of the Data Controller</span>
          </strong>
        </h2>
        <ul>
          <li>
            <p>
              <span>MUIN and sale of personalized clothing.</span>
            </p>
          </li>
          <li>
            <p>
              <span>Physical address.</span>
            </p>
          </li>
          <li>
            <p>
              <span>Contact email (a27287@svalero.com).</span>
            </p>
          </li>
        </ul>
        <h2>
          <strong>
            <span>2. Processing of Customer Data (Ecommerce)</span>
          </strong>
        </h2>
        <p>
          <span>
            When selling personalized products, we collect more sensitive
            information than a typical store.
          </span>
        </p>
        <ul>
          <li>
            <p>
              <strong>
                <span>Data collected:</span>
              </strong>
              <span>
                Name, shipping address, payment methods, and, crucially,
              </span>
              <strong>
                <span>files or descriptions for personalization</span>
              </strong>
              <span>&nbsp;(photos, texts, dates).</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Purpose:</span>
              </strong>
              <span>
                To process the order, manage shipping, issue invoices, and, if
                the user consents, send marketing materials.
              </span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Legal basis:</span>
              </strong>
              <span>
                The performance of a contract (the purchase) and consent (for
                advertising).
              </span>
            </p>
          </li>
        </ul>
        <h2>
          <strong>
            <span>3. Data Processing on the Intranet (Employees)</span>
          </strong>
        </h2>
        <p>
          <span>
            This section is usually in a separate document or a specific section
            due to the employment relationship.
          </span>
        </p>
        <ul>
          <li>
            <p>
              <strong>
                <span>Data collected:</span>
              </strong>
              <span>
                Tax ID/National ID, social security number, bank account for
                payroll, attendance and performance records.
              </span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Use of tools:</span>
              </strong>
              <span>
                Inform if intranet usage is monitored or if there are security
                cameras in the workplace.
              </span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Confidentiality:</span>
              </strong>
              <span>
                Employees are obligated not to leak data of clients they access
                through the intranet.
              </span>
            </p>
          </li>
        </ul>
        <h2>
          <strong>
            <span>4. Data Transfer to Third Parties</span>
          </strong>
        </h2>
        <p>
          <span>
            You must be transparent about who you share information with:
          </span>
        </p>
        <ul>
          <li>
            <p>
              <strong>
                <span>Payment gateways:</span>
              </strong>
              <span>&nbsp;(Ej. Stripe, PayPal) to process transactions.</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Logistics companies:</span>
              </strong>
              <span>(e.g., FedEx, DHL) to deliver customized products.</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Hosting services:</span>
              </strong>
              <span>Where the website and intranet are hosted.</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Authorities:</span>
              </strong>
              <span>In case of legal requirements.</span>
            </p>
          </li>
        </ul>
        <h2>
          <strong>
            <span>5. ARCO Rights (or equivalent)</span>
          </strong>
        </h2>
        <p>
          <span>
            It is mandatory to explain how the user (client or employee) can
            exercise their rights:
          </span>
        </p>
        <ul>
          <li>
            <p>
              <strong>
                <span>Access:</span>
              </strong>
              <span>To know what data you have about them.</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Rectification:</span>
              </strong>
              <span>To correct erroneous information.</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Cancellation/Deletion:</span>
              </strong>
              <span>Request that your data be erased.</span>
            </p>
          </li>
        </ul>
        <p>
          <strong>
            <span>Objetion:</span>
          </strong>
          <span>Refuse a specific use (such as recieving newsletters).</span>
        </p>
      </div>
    </>
  );
}
