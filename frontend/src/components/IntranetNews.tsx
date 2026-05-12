import "../styles/intranet-news.css";

const newsGroups = [
  {
    title: "🏗️ Consolidated Achievements: Transforming the Present",
    tag: "Present",
    items: [
      {
        id: "wage-shielding",
        title: "Wage Shielding Against Inflation",
        subtitle:
          "Muin signs a historic collective agreement with increases tied to the real CPI.",
        paragraphs: [
          "After weeks of intense negotiations, the Works Council has successfully ratified an agreement that guarantees the workforce's purchasing power until 2028.",
          "The new pact not only includes a fixed annual increase but also a technical review clause that will automatically trigger if inflation exceeds forecasts, eliminating economic uncertainty for workers.",
        ],
      },
      {
        id: "disconnection-friday",
        title: '"Disconnection Friday" is Now a Reality',
        subtitle:
          "Implementation of the flexible working hours model to improve work-life balance.",
        paragraphs: [
          "One of the biggest triumphs of the last quarter has been the reform of the work calendar.",
          "The Council has ensured that the workday on Fridays ends at 2:00 PM for the entire workforce, without a reduction in salary, through process optimization and an efficient redistribution of weekly hours.",
          "This measure has already yielded a 15% increase in internal satisfaction rates.",
        ],
      },
      {
        id: "mental-health",
        title: "Pioneers in Occupational Mental Health",
        subtitle:
          "Muin launches a psychological support and holistic wellness service.",
        paragraphs: [
          "Understanding that well-being is not just physical, the Council has driven the creation of a mental health program.",
          'This includes free counseling sessions, stress management workshops, and the role of a "Wellness Guide" within each department, making Muin a benchmark for human care in the sector.',
        ],
      },
    ],
  },
  {
    title: "🚀 Progress Underway: Designing the Future",
    tag: "Future",
    items: [
      {
        id: "horizon-2027",
        title: "Horizon 2027: Towards the 32-Hour Workweek",
        subtitle:
          "The Council initiates feasibility studies to reduce working hours.",
        paragraphs: [
          "Not settling for short Fridays, the Council has announced the creation of a joint working group with management to evaluate the impact of a four-day workweek.",
          "The goal is to present a pilot plan early next year, betting on goal-oriented productivity rather than presenteeism.",
        ],
      },
      {
        id: "muin-tech",
        title: '"Muin Tech" Reskilling Plan',
        subtitle: "Ensuring employability in the face of the AI revolution.",
        paragraphs: [
          "Given the rapid pace of digitalization, the Council has secured a commitment from the company to invest over €500,000 in continuous training.",
          "This progress ensures that no worker is left behind: technical training courses on new digital tools will be offered during working hours, transforming traditional profiles into tech experts.",
        ],
      },
      {
        id: "zero-impact",
        title: "Zero Impact Commitment Driven from the Ground Up",
        subtitle:
          "The workforce will lead the factory's ecological transformation.",
        paragraphs: [
          "The Works Council doesn't just negotiate salaries; it now negotiates sustainability.",
          'The creation of a "Green Council," made up of delegates and workers to audit production processes, has been approved.',
          "The next milestone will be the installation of photovoltaic panels across all sites—a project the Council has championed as a way to reduce operational costs and reinvest those savings into social benefits.",
        ],
      },
    ],
  },
];

const IntranetNews = () => {
  return (
    <div className="news-page-wrapper" id="top">
      <section className="news-hero">
        <span className="hero-label">Works council</span>
        <h1>NEWS</h1>
        <p>
          Noticias del comité de empresa con navegación interna para ir a cada
          titular y leer los detalles de las decisiones más relevantes.
        </p>
      </section>

      <main className="news-main">
        {newsGroups.map((group) => (
          <section className="news-group" key={group.title}>
            <h2>{group.title}</h2>
            <div className="news-grid">
              {group.items.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="news-card">
                  <span className="news-card-tag">{group.tag}</span>
                  <p className="news-card-title">{item.title}</p>
                  <p className="news-card-subtitle">{item.subtitle}</p>
                </a>
              ))}
            </div>
          </section>
        ))}

        <section className="news-details">
          {newsGroups
            .flatMap((group) => group.items)
            .map((item) => (
              <article className="news-article" id={item.id} key={item.id}>
                <div className="article-header">
                  <span className="article-pill">
                    {item.title.includes('"') ? "News" : "News"}
                  </span>
                  <h3>{item.title}</h3>
                  <p className="article-subtitle">{item.subtitle}</p>
                </div>
                {item.paragraphs.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
                <div className="article-footer">
                  <a href="#top">Volver arriba</a>
                </div>
              </article>
            ))}
        </section>
      </main>
    </div>
  );
};

export default IntranetNews;
