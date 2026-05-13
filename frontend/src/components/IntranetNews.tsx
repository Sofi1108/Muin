import WorkCouncilLayout from "./WorkCouncilLayout";
import "../styles/intranet-news.css";

const newsGroups = [
  {
    title: "Logros Consolidados: Transformando el Presente",
    tag: "Presente",
    items: [
      {
        id: "blindaje-salarial",
        title: "Blindaje Salarial ante la Inflación",
        subtitle:
          "Muin firma un acuerdo histórico con incrementos ligados al IPC real.",
        paragraphs: [
          "Tras semanas de intensas negociaciones, el Comité de Empresa ha ratificado con éxito un acuerdo que garantiza el poder adquisitivo de la plantilla hasta 2028.",
          "El nuevo pacto no solo incluye un aumento anual fijo, sino también una cláusula de revisión técnica que se activará automáticamente si la inflación supera las previsiones, eliminando la incertidumbre económica para los trabajadores.",
        ],
      },
      {
        id: "viernes-desconexion",
        title: 'Los "Viernes de Desconexión" ya son una Realidad',
        subtitle:
          "Implementación del modelo de horario flexible para mejorar la conciliación.",
        paragraphs: [
          "Uno de los mayores triunfos del último trimestre ha sido la reforma del calendario laboral.",
          "El Comité ha logrado que la jornada de los viernes finalice a las 14:00h para toda la plantilla, sin reducción salarial, mediante la optimización de procesos y una redistribución eficiente de las horas semanales.",
          "Esta medida ya ha arrojado un incremento del 15% en los índices de satisfacción interna.",
        ],
      },
      {
        id: "salud-mental",
        title: "Pioneros en Salud Mental Ocupacional",
        subtitle:
          "Muin lanza un servicio de apoyo psicológico y bienestar integral.",
        paragraphs: [
          "Entendiendo que el bienestar no es solo físico, el Comité ha impulsado la creación de un programa de salud mental.",
          "Este incluye sesiones de asesoramiento gratuito, talleres de gestión del estrés y la figura del 'Guía de Bienestar' dentro de cada departamento, convirtiendo a Muin en un referente de cuidado humano en el sector.",
        ],
      },
    ],
  },
  {
    title: "Progresos en Marcha: Diseñando el Futuro",
    tag: "Futuro",
    items: [
      {
        id: "horizonte-2027",
        title: "Horizonte 2027: Hacia la Semana de 32 Horas",
        subtitle:
          "El Comité inicia estudios de viabilidad para reducir la jornada laboral.",
        paragraphs: [
          "No conformándose con los viernes cortos, el Comité ha anunciado la creación de una mesa de trabajo conjunta con la dirección para evaluar el impacto de la semana laboral de cuatro días.",
          "El objetivo es presentar un plan piloto a principios del próximo año, apostando por la productividad por objetivos en lugar del presencialismo.",
        ],
      },
      {
        id: "muin-tech-reskilling",
        title: 'Plan de Reskilling "Muin Tech"',
        subtitle: "Garantizando la empleabilidad ante la revolución de la IA.",
        paragraphs: [
          "Ante el avance de la digitalización, el Comité ha arrancado el compromiso de la empresa para invertir más de 500.000€ en formación continua.",
          "Este progreso asegura que ningún trabajador se quede atrás: se ofrecerán cursos técnicos sobre nuevas herramientas digitales en horario laboral, transformando perfiles tradicionales en expertos tecnológicos.",
        ],
      },
      {
        id: "impacto-cero",
        title: "Compromiso Impacto Cero impulsado desde la Base",
        subtitle:
          "La plantilla liderará la transformación ecológica de la fábrica.",
        paragraphs: [
          "El Comité de Empresa no solo negocia salarios, ahora también negocia sostenibilidad.",
          "Se ha aprobado la creación de un 'Consejo Verde' formado por delegados y trabajadores para auditar los procesos productivos.",
          "El próximo hito será la instalación de paneles fotovoltaicos en todos los centros, un proyecto que el Comité ha defendido como vía para reducir costes operativos y reinvertir ese ahorro en beneficios sociales.",
        ],
      },
    ],
  },
];

const IntranetNews = () => {
  return (
    <WorkCouncilLayout
      title="Área de Empleados"
      subtitle="Noticias, actualizaciones internas y decisiones del comité para nuestros empleados."
    >
      <div className="news-page-wrapper" id="top">
        <section className="news-hero">
          <span className="hero-label">Comité de Empresa</span>
          <h1>NOTICIAS</h1>
          <p>
            Actualidad del comité con navegación interna. Haz clic en cualquier
            titular para conocer los detalles de las decisiones que afectan a tu
            día a día.
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
                    <span className="article-pill">ACTUALIDAD</span>
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
    </WorkCouncilLayout>
  );
};

export default IntranetNews;
