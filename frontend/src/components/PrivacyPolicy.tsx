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
                <span>Pasarelas de pago:</span>
              </strong>
              <span>
                &nbsp;(Ej. Stripe, PayPal) para procesar transacciones.
              </span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Empresas de log&iacute;stica:</span>
              </strong>
              <span>
                &nbsp;(Ej. FedEx, DHL) para entregar los productos
                personalizados.
              </span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Servicios de Hosting:</span>
              </strong>
              <span>&nbsp;Donde se aloja la web y la intranet.</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Autoridades:</span>
              </strong>
              <span>&nbsp;En caso de requerimientos legales.</span>
            </p>
          </li>
        </ul>
        <h2>
          <strong>
            <span>5. Derechos ARCO (o equivalentes)</span>
          </strong>
        </h2>
        <p>
          <span>
            Es obligatorio explicar c&oacute;mo el usuario (cliente o empleado)
            puede ejercer sus derechos:
          </span>
        </p>
        <ul>
          <li>
            <p>
              <strong>
                <span>Acceso:</span>
              </strong>
              <span>&nbsp;Saber qu&eacute; datos tienes de ellos.</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Rectificaci&oacute;n:</span>
              </strong>
              <span>&nbsp;Corregir informaci&oacute;n err&oacute;nea.</span>
            </p>
          </li>
          <li>
            <p>
              <strong>
                <span>Cancelaci&oacute;n/Supresi&oacute;n:</span>
              </strong>
              <span>&nbsp;Solicitar que se borren sus datos.</span>
            </p>
          </li>
        </ul>
        <p>
          <strong>
            <span>Oposici&oacute;n:</span>
          </strong>
          <span>
            &nbsp;Negarse a un uso espec&iacute;fico (como el env&iacute;o de
            boletines).
          </span>
        </p>
      </div>
    </>
  );
}
