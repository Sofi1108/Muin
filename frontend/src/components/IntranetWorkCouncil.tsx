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
          <h1>COMITÉ DE EMPRESA</h1>
          <p>
            Representamos a los trabajadores, defendemos sus derechos y apoyamos
            la comunicación directa con la dirección de Muin.
          </p>
        </section>

        <main className="work-capsules-main">
          {/* SECCIÓN DE VÍDEO */}
          <section className="section-card">
            <span className="tag-badge">Tutorial</span>
            <h2>Vídeo Informativo</h2>
            <div className="video-placeholder">
              <iframe src={VIDEO_URL} title="Video" allowFullScreen />
            </div>
          </section>

          <section className="section-card">
            <span className="tag-badge">MISIÓN</span>
            <h2>QUÉ ES EL COMITÉ DE EMPRESA</h2>
            <p>
              El Comité de Empresa es el órgano representativo colegiado de los trabajadores (en centros de 50 o más empleados). En empresas de 10 a 49 trabajadores, esta labor recae en los "Delegados de Personal". Su finalidad es defender los intereses laborales, sociales y económicos de la plantilla frente a la dirección, con un mandato de cuatro años tras ser elegidos democráticamente mediante elecciones sindicales.
            </p>
            <div className="grid-two-capsules">
              <div className="infographic-card">
                <h4>PERFIL DEL COMITÉ</h4>
                <ul>
                  <li>Representa a todos los empleados del proyecto (50+ trabajadores).</li>
                  <li>Elegido democráticamente por toda la plantilla.</li>
                  <li>Interlocutor oficial con la dirección de la empresa.</li>
                  <li>Mandato representativo de 4 años de duración.</li>
                </ul>
              </div>
              <div className="infographic-card">
                <h4>FUNCIONES CLAVE</h4>
                <ul>
                  <li><strong>Información y Consulta:</strong> Situación económica, empleo, ERE, ERTE, IA.</li>
                  <li><strong>Vigilancia:</strong> Normativa, Registro Horario y Prevención de Riesgos.</li>
                  <li><strong>Igualdad:</strong> Planes de Género y LGTBI+.</li>
                  <li><strong>Negociación:</strong> Convenios y acuerdos colectivos justos.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="section-card">
            <span className="tag-badge">ACTIVIDAD</span>
            <h2>NUESTRAS LÍNEAS DE ACCIÓN (Art. 64 ET)</h2>
            <div className="infographic-grid">
              <div className="infographic-card">
                <h4>INFORMACIÓN Y CONSULTA</h4>
                <p>
                  Analizamos la situación económica y de empleo. Evaluamos la <strong>transparencia algorítmica (IA)</strong> y emitimos informes legales ante cambios sustanciales, planes de formación, EREs o traslados.
                </p>
              </div>
              <div className="infographic-card">
                <h4>VIGILANCIA Y CONTROL</h4>
                <p>
                  Supervisamos de forma estricta la normativa laboral, el <strong>registro horario real</strong>, los derechos de desconexión digital, el teletrabajo y la prevención de riesgos laborales y salud.
                </p>
              </div>
              <div className="infographic-card">
                <h4>IGUALDAD Y DIVERSIDAD</h4>
                <p>
                  Participamos activamente en los <strong>Planes de Igualdad de Género</strong> (evitando la brecha salarial) y negociamos protocolos en favor de la igualdad real del colectivo LGTBI+.
                </p>
              </div>
              <div className="infographic-card">
                <h4>NEGOCIACIÓN</h4>
                <p>
                  Somos el actor principal para defender condiciones justas negociando el <strong>Convenio Colectivo</strong>, los pactos de empresa, los horarios, turnos y calendarios laborales de la plantilla.
                </p>
              </div>
            </div>
          </section>



          <section className="section-card">
            <span className="tag-badge">EQUIPO</span>
            <h2>ORGANIGRAMA DEL COMITÉ</h2>

            <div className="org-vertical-container">
              <div className="org-horizontal-bridge"></div>
              {/* COLUMNA IZQUIERDA: PRESIDENTA */}
              <div className="org-vertical-column">
                <article className="member-capsule org-node-top">
                  <div className="member-avatar">E</div>
                  <p className="role-title">PRESIDENTA</p>
                  <h4>Elena Martínez García</h4>
                </article>
                <div className="vertical-connector-line"></div>
                <div className="vocals-vertical-list">
                  {[
                    { name: "Andrés Ara Monge", role: "VOCAL / PRL C.Social" }
                  ].map((member, i) => (
                    <div key={i} className="vocal-item">
                      <div className="vocal-side-line"></div>
                      <article className="member-capsule org-node-bottom">
                        <div className="member-avatar">{member.name.charAt(0)}</div>
                        <p className="role-title">{member.role}</p>
                        <h4>{member.name}</h4>
                      </article>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMNA DERECHA: SECRETARIO */}
              <div className="org-vertical-column">
                <article className="member-capsule org-node-top">
                  <div className="member-avatar">C</div>
                  <p className="role-title">SECRETARIO</p>
                  <h4>Carlos Rodríguez Pérez</h4>
                </article>
                <div className="vertical-connector-line"></div>
                <div className="vocals-vertical-list">
                  {[
                    { name: "Sofía Torcal Valentín", role: "VOCAL / PRL C.Social" },
                    { name: "Ainara Gorría Planté", role: "VOCAL" }
                  ].map((member, i) => (
                    <div key={i} className="vocal-item">
                      <div className="vocal-side-line"></div>
                      <article className="member-capsule org-node-bottom">
                        <div className="member-avatar">{member.name.charAt(0)}</div>
                        <p className="role-title">{member.role}</p>
                        <h4>{member.name}</h4>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
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
