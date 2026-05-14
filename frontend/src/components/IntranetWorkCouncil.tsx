import WorkCouncilLayout from "./WorkCouncilLayout";
import "../styles/intranet-work-council.css";

const IntranetWorkCouncil = () => {
  const VIDEO_URL = "https://www.youtube.com/embed/placeholder";
  return (
    <WorkCouncilLayout
      title="ÁREA DE EMPLEADOS"
      subtitle="Información institucional y defensa de los derechos laborales."
    >
      <div className="work-capsules-page">
        {/* HERO SECTION */}
        <section className="work-capsules-hero">
          <span className="hero-label">COMITÉ DE EMPRESA</span>
          <h1>COMITEE AREA</h1>
          <p>
            Representamos a los trabajadores, defendemos sus derechos y apoyamos
            la comunicación directa con la dirección de Muin.
          </p>
        </section>

        {/* SECCIÓN DE VÍDEO */}
        <section className="section-card">
          <span className="tag-badge">Tutorial</span>
          <h2>Vídeo Informativo</h2>
          <div className="video-placeholder">
            <iframe src={VIDEO_URL} title="Video" allowFullScreen />
          </div>
        </section>

        

        <main className="work-capsules-main">
          <section className="section-card">
            <span className="tag-badge">MISIÓN</span>
            <h2>QUÉ ES EL COMITÉ DE EMPRESA</h2>
            <p>
              Es el órgano de representación legal ante la dirección. Nuestra
              misión es actuar como voz de la plantilla para defender los
              intereses laborales.
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
              {[
                { name: "Elena Martínez García", role: "Presidenta" },
                { name: "Carlos Rodríguez Pérez", role: "Secretario" },
                { name: "Ana Ruiz López", role: "Vocal / PRL" },
                { name: "Javier Sanz Díaz", role: "Vocal / PRL" },
                { name: "Luis Fernández Gil", role: "Vocal / PRL" },
                { name: "Andrés Ara Monge", role: "Vocal / PRL" },
                { name: "Pilar Gómez Torres", role: "Vocal / PRL" },
                { name: "Miguel Moreno Ruiz", role: "Vocal / PRL Social" },
                { name: "David Castro León", role: "Vocal / PRL Social" },
                { name: "Sofía Torcal Valentín", role: "Vocal" },
                { name: "Jorge Navarro Cruz", role: "Vocal" },
                { name: "Carmen Pérez Ortiz", role: "Vocal" },
                { name: "Ainara Gorría Planté", role: "Vocal" }
              ].map((member, i) => (
                <article key={i} className="member-capsule">
                  <div className="member-avatar">{member.name.charAt(0)}</div>
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </article>
              ))}
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
    </WorkCouncilLayout>
  );
};

export default IntranetWorkCouncil;
