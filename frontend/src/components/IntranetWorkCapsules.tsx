import WorkCouncilLayout from "./WorkCouncilLayout";
import "../styles/intranet-work-capsules.css";

export const IntranetWorkCapsules = () => {
  return (
    <WorkCouncilLayout
      title="Área de Empleados"
      subtitle="Guía de derechos, apoyo ante despidos y recomendaciones de seguridad."
    >
      <div className="work-capsules-page">
        <section className="work-capsules-hero">
          <div>
            <span className="hero-label">Derechos del Empleado</span>
            <h1>Despido Improcedente y Seguridad Laboral</h1>
            <p>
              Información práctica sobre despidos, pasos legales clave y pautas
              para la prevención de riesgos laborales en Muin.
            </p>
          </div>
        </section>

        <main className="work-capsules-main">
          <section className="section-card">
            <span className="tag-badge">Despido Improcedente</span>
            <h2>GUÍA RÁPIDA: ¿Qué es un Despido Improcedente?</h2>
            <p>
              Un despido se considera improcedente cuando la empresa te despide
              sin una causa justificada (razones falsas o exageradas) o con
              errores de forma (no entregar carta por escrito o no explicar
              correctamente los motivos).
            </p>
          </section>

          <section className="section-card grid-two">
            <div>
              <span className="tag-badge">Consecuencias</span>
              <h2>¿Qué pasa si se demuestra la improcedencia?</h2>
              <p>
                La empresa generalmente tendrá que elegir entre dos opciones:
              </p>
              <ul className="rule-list">
                <li className="rule-item">
                  <span>
                    <strong>Readmisión:</strong> Volver a contratarte en tu
                    puesto y pagarte los salarios de tramitación (días que
                    estuviste fuera).
                  </span>
                </li>
                <li className="rule-item">
                  <span>
                    <strong>Indemnización máxima:</strong> Pago de 33 días por
                    año trabajado (con un tope de 24 mensualidades).
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <span className="tag-badge">Reglas de Oro</span>
              <h2>Qué hacer en el momento del despido</h2>
              <p>
                Si RRHH o tu responsable te entrega una carta de despido, aplica
                siempre estos 3 pasos:
              </p>
              <ul className="rule-list">
                <li className="rule-item">
                  <span>
                    <strong>Firma como "NO CONFORME":</strong> Escribe de tu
                    puño y letra "No conforme", pon la fecha exacta y luego
                    firma.
                  </span>
                </li>
                <li className="rule-item">
                  <span>
                    <strong>Exige tu copia:</strong> Pide llevarte una copia
                    idéntica del documento que acabas de firmar en ese mismo
                    instante.
                  </span>
                </li>
                <li className="rule-item">
                  <span>
                    <strong>¡Ojo al reloj!:</strong> Tienes un plazo estricto de
                    solo 20 días hábiles para presentar una reclamación legal.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="section-card">
            <span className="tag-badge">Soporte</span>
            <h2>El Comité de Empresa está contigo</h2>
            <p>
              Un despido es una situación difícil, pero no tienes que afrontarla
              solo. Tras firmar "No conforme", contacta con el Comité
              inmediatamente. Revisaremos tu caso y tu finiquito para proteger
              tus intereses.
            </p>
          </section>

          <section className="section-card">
            <span className="tag-badge">Prevención y Riesgos</span>
            <h2>Prevención de Riesgos Laborales (PRL)</h2>
            <p>
              La salud y la seguridad son una prioridad. El Comité supervisa las
              medidas de prevención y promueve condiciones de trabajo seguras.
            </p>
            <div className="infographic-grid">
              <div className="infographic-card">
                <h4>Riesgos Psicosociales</h4>
                <p>
                  El estrés, el agotamiento (burnout) y la carga excesiva
                  afectan la salud mental.
                </p>
                <ul>
                  <li>Encuestas anónimas de clima laboral.</li>
                  <li>Protocolo de desconexión digital fuera de horario.</li>
                  <li>Canales de apoyo para asistencia psicológica.</li>
                </ul>
              </div>
              <div className="infographic-card">
                <h4>Riesgos Ergonómicos</h4>
                <p>
                  Malas posturas o un diseño deficiente del puesto pueden causar
                  lesiones físicas.
                </p>
                <ul>
                  <li>Sillas ajustables y soportes ergonómicos.</li>
                  <li>Pausas activas con ejercicios de estiramiento.</li>
                  <li>Formación en higiene postural y carga de materiales.</li>
                </ul>
              </div>
              <div className="infographic-card">
                <h4>Caídas e Impactos</h4>
                <p>
                  Resbalones y tropiezos son comunes en entornos de oficina y
                  fábrica concurridos.
                </p>
                <ul>
                  <li>Mantener zonas de paso despejadas y ordenadas.</li>
                  <li>Asegurar cables y equipos pesados.</li>
                  <li>Señalización clara de suelos mojados o peligros.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="section-card">
            <span className="tag-badge">Tipos de Despido</span>
            <h2>Tipos de Despido en España</h2>
            <p>
              Existen diferentes tipos de despido según la legislación laboral española. Conoce las diferencias para saber tus derechos.
            </p>
            <div className="infographic-grid">
              <div className="infographic-card">
                <h4>Despido Disciplinario</h4>
                <p>Por faltas graves o muy graves del trabajador. Debe estar justificado.</p>
              </div>
              <div className="infographic-card">
                <h4>Despido Objetivo</h4>
                <p>Por causas económicas, técnicas, organizativas o de producción.</p>
              </div>
              <div className="infographic-card">
                <h4>Despido Improcedente</h4>
                <p>Sin causa justificada o con vicios de forma. Derecho a indemnización o readmisión.</p>
              </div>
              <div className="infographic-card">
                <h4>Despido Colectivo</h4>
                <p>Afecta a un número significativo de trabajadores por causas económicas.</p>
              </div>
            </div>
          </section>

          <section className="section-card">
            <span className="tag-badge">Documentos</span>
            <h2>Descargas Importantes</h2>
            <p>Accede a documentos clave para tu protección laboral.</p>
            <div className="download-buttons">
              <a href="/documents/estatuto-trabajadores.pdf" download className="download-btn">
                Descargar Estatuto de los Trabajadores
              </a>
              <a href="/documents/convenio-colectivo.pdf" download className="download-btn">
                Descargar Convenio Colectivo
              </a>
            </div>
          </section>
        </main>
      </div>
    </WorkCouncilLayout>
  );
};
