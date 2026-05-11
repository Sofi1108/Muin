import IntranetLayout from "./IntranetLayout";
import "../styles/intranet-work-council.css";

const IntranetWorkCouncil = () => {
  return (
    <IntranetLayout
      title="ÁREA DE EMPLEADOS"
      subtitle="Información institucional y defensa de los derechos laborales."
    >
      <div className="work-capsules-page">
        {/* HERO SECTION */}
        <section className="work-capsules-hero">
          <span className="hero-label">COMITÉ DE EMPRESA</span>
          <h1>COMITÉ DE EMPRESA</h1>
          <p>
            Representamos a los trabajadores, defendemos sus derechos y apoyamos
            la comunicación directa con la dirección de Muin.
          </p>
        </section>

        <main className="work-capsules-main">
          <section className="section-card">
            <span className="tag-badge">MISIÓN</span>
            <h2>QUÉ ES EL COMITÉ DE EMPRESA</h2>
            <p>
              Es el órgano de representación legal ante la dirección. Nuestra
              misión es actuar como voz de la plantilla para defender los
              intereses laborales y económicos.
            </p>
            <div className="grid-two-capsules">
              <div className="infographic-card">
                <h4>PERFIL DEL COMITÉ</h4>
                <ul>
                  <li>Representa a todos los empleados del proyecto.</li>
                  <li>Elegido democráticamente por la plantilla.</li>
                  <li>Interlocutor oficial con la empresa.</li>
                </ul>
              </div>
              <div className="infographic-card">
                <h4>FUNCIONES CLAVE</h4>
                <ul>
                  <li>Informar sobre cambios organizativos.</li>
                  <li>Proponer mejoras en salud y bienestar.</li>
                  <li>Negociar acuerdos colectivos justos.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="section-card">
            <span className="tag-badge">ACTIVIDAD</span>
            <h2>NUESTRAS LÍNEAS DE ACCIÓN</h2>
            <div className="infographic-grid">
              <div className="infographic-card">
                <h4>INFORMACIÓN</h4>
                <p>
                  Recibimos y analizamos cambios en la organización y políticas
                  internas.
                </p>
              </div>
              <div className="infographic-card">
                <h4>ORGANIZACIÓN</h4>
                <p>
                  Atendemos dudas y preparamos respuestas basadas en derechos
                  laborales.
                </p>
              </div>
              <div className="infographic-card">
                <h4>NEGOCIACIÓN</h4>
                <p>
                  Defendemos condiciones justas en horarios, turnos y medidas de
                  seguridad.
                </p>
              </div>
              <div className="infographic-card">
                <h4>SUPERVISIÓN</h4>
                <p>
                  Controlamos decisiones con impacto como traslados o
                  reestructuraciones.
                </p>
              </div>
            </div>
          </section>

          <section className="section-card">
            <span className="tag-badge">EQUIPO</span>
            <h2>ORGANIGRAMA DEL COMITÉ</h2>
            <div className="members-grid">
              {["PRESIDENTE", "SECRETARIO", "TESORERO", "REPRESENTANTE"].map(
                (role, i) => (
                  <article key={i} className="member-capsule">
                    <div className="member-avatar">{role[0]}</div>
                    <h4>{role}</h4>
                    <p>Gestión y apoyo al empleado.</p>
                  </article>
                ),
              )}
            </div>
          </section>

          {/* SUMMARY CARDS (Las rojas de la imagen de RRHH) */}
          <div className="summary-row">
            {["TRANSPARENCIA", "DIÁLOGO", "DEFENSA"].map((item, i) => (
              <div key={i} className="red-summary-card">
                <h3>{item}</h3>
                <p>
                  Protegemos tus derechos y fomentamos la comunicación
                  bidireccional.
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </IntranetLayout>
  );
};

export default IntranetWorkCouncil;
