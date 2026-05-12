import IntranetLayout from "./IntranetLayout";
import "../styles/intranet-home.css"; // Usar un estilo similar

const Tickets = () => {
  return (
    <IntranetLayout
      title="Tickets (Incidencias)"
      subtitle="Reporta y gestiona incidencias laborales."
    >
      <div className="work-capsules-page">
        <section className="work-capsules-hero">
          <span className="hero-label">Tickets</span>
          <h1>Incidencias</h1>
          <p>Próximamente: Sistema para reportar y gestionar incidencias.</p>
        </section>
        <main className="work-capsules-main">
          <section className="section-card">
            <span className="tag-badge">En Desarrollo</span>
            <h2>Funcionalidad Pendiente</h2>
            <p>Esta sección estará disponible próximamente.</p>
          </section>
        </main>
      </div>
    </IntranetLayout>
  );
};

export default Tickets;