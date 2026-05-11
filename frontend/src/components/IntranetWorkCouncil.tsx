import { useUser } from "../context/UserContext";
import "../styles/intranet-work-council.css";

const IntranetWorkCouncil = () => {

  return (
    <div className="committee-page-wrapper">
      <section className="committee-hero">
        <div className="hero-content">
          <span className="hero-label">Comité de Empresa</span>
          <h1>Works Council</h1>
          <p>
            Información institucional del comité de empresa: representamos a los
            trabajadores, defendemos sus derechos y apoyamos la comunicación
            con la dirección.
          </p>
        </div>
      </section>

      <main className="committee-main">
        <section className="committee-section">
          <h2>Qué es el comité de empresa</h2>
          <p>
            El comité de empresa es el órgano que representa legalmente a todos los
            empleados ante la dirección. Su misión es actuar como voz de la plantilla
            para defender los intereses laborales, sociales y económicos en el centro
            de trabajo.
          </p>
          <div className="committee-grid">
            <div className="committee-card">
              <h3>Perfil del comité</h3>
              <ul>
                <li>Representa a todos los empleados del proyecto.</li>
                <li>Se elige en elecciones de delegados.</li>
                <li>Actúa como interlocutor con la empresa.</li>
                <li>Defiende derechos laborales y condiciones de trabajo.</li>
              </ul>
            </div>
            <div className="committee-card">
              <h3>Funciones principales</h3>
              <ul>
                <li>Informar y comunicar cambios organizativos.</li>
                <li>Proponer mejoras en salud, seguridad y bienestar.</li>
                <li>Supervisar condiciones laborales y jornadas.</li>
                <li>Negociar acuerdos colectivos y prácticas internas.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="committee-section">
          <h2>Qué hacemos</h2>
          <p>
            Actuamos como puente entre la plantilla y la dirección. Nuestro trabajo
            más importante es negociar, informar y supervisar el cumplimiento de las
            condiciones laborales.
          </p>
          <div className="committee-grid">
            <div className="committee-card">
              <h3>Recibimos información</h3>
              <p>
                La empresa nos comunica de forma regular los cambios en la organización,
                la producción y las políticas internas.
              </p>
            </div>
            <div className="committee-card">
              <h3>Nos organizamos</h3>
              <p>
                Evaluamos propuestas, atiende dudas de los empleados y preparamos
                respuestas basadas en los derechos laborales.
              </p>
            </div>
            <div className="committee-card">
              <h3>Negociamos acuerdos</h3>
              <p>
                Defendemos condiciones de trabajo justas mediante acuerdos colectivos,
                cambios de horario, turnos y medidas de seguridad.
              </p>
            </div>
            <div className="committee-card">
              <h3>Gestionamos el cambio</h3>
              <p>
                Supervisamos decisiones con impacto en la plantilla, como reestructuraciones,
                traslados o nuevas políticas internas.
              </p>
            </div>
          </div>
        </section>

        <section className="committee-section">
          <h2>Organigrama del comité</h2>
          <div className="committee-chart">
            <article className="committee-member">
              <div className="committee-member-avatar">P</div>
              <h4>Presidente</h4>
              <span>Coordinación general y representación</span>
            </article>
            <article className="committee-member">
              <div className="committee-member-avatar">S</div>
              <h4>Secretario</h4>
              <span>Gestión de actas y comunicación interna</span>
            </article>
            <article className="committee-member">
              <div className="committee-member-avatar">T</div>
              <h4>Tesorero</h4>
              <span>Seguimiento económico y control de recursos</span>
            </article>
            <article className="committee-member">
              <div className="committee-member-avatar">R</div>
              <h4>Representante</h4>
              <span>Contacto directo con empleados y recogida de propuestas</span>
            </article>
          </div>

          <div className="committee-summary">
            <div className="committee-summary-card">
              <h3>Transparencia</h3>
              <p>
                Damos acceso claro a la información sobre decisiones que afectan al equipo.
              </p>
            </div>
            <div className="committee-summary-card">
              <h3>Diálogo</h3>
              <p>
                Fomentamos la comunicación bidireccional entre empleados y dirección.
              </p>
            </div>
            <div className="committee-summary-card">
              <h3>Defensa</h3>
              <p>
                Protegemos tus derechos y oportunidades laborales dentro de la empresa.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default IntranetWorkCouncil;
