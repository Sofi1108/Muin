import WorkCouncilLayout from "./WorkCouncilLayout";
import "../styles/intranet-work-council.css";

const IntranetLegalDocuments = () => {
  return (
    <WorkCouncilLayout
      title="DOCUMENTOS LEGALES"
      subtitle="Accede a la documentación legal y normativas de la empresa."
    >
      <div className="work-capsules-page">
        {/* HERO SECTION */}
        <section className="work-capsules-hero">
          <span className="hero-label">DESCARGAS</span>
          <h1>DOCUMENTOS LEGALES</h1>
          <p>
            En esta sección puedes encontrar y descargar todos los documentos clave 
            relacionados con tu protección laboral, estatutos y convenios colectivos.
          </p>
        </section>

        <main className="work-capsules-main">
          {/* Descargas */}
          <section className="section-card">
            <span className="tag-badge">Documentos</span>
            <h2>Descargas Importantes</h2>
            <p>Accede a documentos clave para tu protección laboral.</p>
            <div className="download-buttons">
              <a href="/documents/Estatuto de los trabajadores.pdf" target="_blank" rel="noopener noreferrer" className="download-btn">
                Ver Estatuto de los Trabajadores
              </a>
              <a href="/documents/BRSCGI.pdf" target="_blank" rel="noopener noreferrer" className="download-btn">
                Ver Convenio Colectivo
              </a>
            </div>
          </section>
        </main>
      </div>
    </WorkCouncilLayout>
  );
};

export default IntranetLegalDocuments;
