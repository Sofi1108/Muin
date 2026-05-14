import { useState } from "react";
import IntranetLayout from "./IntranetLayout";
import "../styles/intranet-human-resources.css";

const courses = [
  {
    id: "ai-day-to-day",
    title: "IA en el Día a Día",
    description:
      "Aprende a usar herramientas de Inteligencia Artificial para automatizar tareas y ganar tiempo.",
    info: "Online | 8 horas",
  },
  {
    id: "time-management",
    title: "Gestión del Tiempo",
    description:
      "Técnicas prácticas para priorizar tareas, organizarte mejor y trabajar sin agobios.",
    info: "Presencial | 5 horas",
  },
  {
    id: "stress-management",
    title: "Gestión del Estrés",
    description:
      "Herramientas psicológicas y mindfulness para cuidar tu bienestar mental y emocional.",
    info: "Híbrido | 10 horas",
  },
  {
    id: "corporate-sustainability",
    title: "Sostenibilidad Corporativa",
    description:
      "Aprende a aplicar prácticas ecológicas y eficientes en tu puesto de trabajo.",
    info: "Online | 4 horas",
  },
  {
    id: "effective-communication",
    title: "Comunicación Efectiva",
    description:
      "Mejora el trabajo en equipo, la escucha activa y la resolución de conflictos.",
    info: "Presencial | 6 horas",
  },
  {
    id: "business-english",
    title: "Inglés de Negocios",
    description:
      "Vocabulario, correos y reuniones para entornos internacionales.",
    info: "Online | 20 horas",
  },
];

export default function IntranetHumanResourcer() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  const toggleEnrollment = (courseId: string) => {
    setEnrolledCourseIds((current) =>
      current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId],
    );
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId((current) => (current === courseId ? null : courseId));
  };

  return (
    <IntranetLayout
      title="Employees Area"
      subtitle="Latest updates, schedules and useful resources for Muin employees."
    >
      <div className="hr-page-wrapper">
        <section className="hr-hero">
          <div className="hr-hero-content">
            <span className="tag-badge">Recursos Humanos</span>
            <h2>Recursos Humanos</h2>
            <p>
              El departamento de Recursos Humanos es responsable de gestionar todo lo relacionado con las personas que conforman la
              empresa.
            </p>
          </div>
        </section>

        <main className="hr-main">
          <section className="section-card">
            <h3>¿Para qué sirve y cómo puede ayudarte?</h3>
            <p>
              El equipo de Recursos Humanos gestiona tu ciclo de vida dentro de
              la empresa, desde antes de tu incorporación hasta tu salida. Su objetivo es actuar como un puente entre las
              necesidades del negocio y el bienestar de la fuerza laboral.Sus
              funciones principales son:
            </p>
            <ul className="hr-list">
              <li>
                <strong>Administración y Trámites:</strong> gestión de nóminas,
                contratos, calendarios de vacaciones y bajas médicas.
              </li>
              <li>
                <strong>Reclutamiento e Incorporación:</strong> contratación de
                nuevos compañeros y apoyo en su integración desde el primer día.
              </li>
              <li>
                <strong>Formación y Desarrollo:</strong> organización de cursos,
                capacitaciones y evaluaciones para ayudarte a crecer
                profesionalmente.
              </li>
              <li>
                <strong>Bienestar y Entorno Laboral:</strong> mantener un lugar
                de trabajo saludable, seguro y motivador, desde beneficios hasta
                prevención de riesgos.
              </li>
              <li>
                <strong>Soporte y Resolución de Conflictos:</strong> tu punto de
                contacto para problemas de equipo, dudas sobre condiciones
                laborales y mediación.
              </li>
            </ul>
          </section>

          <section className="section-card hr-courses-section">
            <h3>Catálogo de Formación (100% subvencionado)</h3>
            <p>
              Aprovecha tu horario laboral para seguir creciendo. Aquí tienes
              los 6 nuevos cursos disponibles:
            </p>
            <div className="courses-grid">
              {courses.map((course) => {
                const isSelected = course.id === selectedCourseId;
                const isEnrolled = enrolledCourseIds.includes(course.id);

                return (
                  <article
                    key={course.id}
                    className={`course-card ${isSelected ? "selected" : ""}`}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div>
                      <h4>{course.title}</h4>
                      <p>{course.description}</p>
                      <span>{course.info}</span>
                    </div>
                    <button
                      type="button"
                      className={`course-btn ${isEnrolled ? "unenroll" : "enroll"}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleEnrollment(course.id);
                      }}
                    >
                      {isEnrolled ? "Desapuntarse" : "Apuntarse"}
                    </button>
                    {isSelected && (
                      <div className="course-selected-label">
                        {isEnrolled
                          ? "Estás apuntado a este curso."
                          : "Pulsa el botón para apuntarte."}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
            <div className="hr-note">
              <p>
                ¿Te interesa? Las plazas son limitadas. Apúntate a través del
                formulario de la Intranet o enviando un email a Recursos
                Humanos.
              </p>
            </div>
          </section>
        </main>
      </div>
    </IntranetLayout>
  );
}
