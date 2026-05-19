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
              <div className="legal-summary-box">
                <h3>Puntos Clave del Convenio</h3>
                <a href="/documents/BRSCGI.pdf" target="_blank" rel="noopener noreferrer" className="download-btn">
                  Ver Convenio Colectivo
                </a>
                <ul>
                  <li>
                    <strong>1. Clasificación Profesional:</strong> Los trabajadores se agrupan en categorías según sus funciones para determinar su salario base. Las más comunes son:
                    <ul>
                      <li><em>Personal de ventas:</em> Dependientes, ayudantes de dependiente, escaparatistas.</li>
                      <li><em>Personal mercantil/administrativo:</em> Encargados de tienda, jefes de sucursal, auxiliares.</li>
                      <li><em>Personal de servicios:</em> Mozos de almacén, reponedores, personal de limpieza.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>2. Salarios y Complementos:</strong> La estructura económica incluye:
                    <ul>
                      <li><em>Salario Base:</em> Fijado anualmente en las tablas salariales según la categoría.</li>
                      <li><em>Pagas Extraordinarias:</em> Establece tres pagas extras (Verano, Navidad y Beneficios/Marzo) de una mensualidad cada una, con opción de prorrateo mensual.</li>
                      <li><em>Antigüedad:</em> Plus económico que se suma al salario base por años en la empresa (habitualmente cuatrienios).</li>
                      <li><em>Otros pluses:</em> Ayudas de transporte, idiomas (si es regular en tienda) o plus de escaparatismo.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>3. Jornada y Horarios:</strong> Fija un máximo de horas anuales (en torno a las 1.780h, equivalentes a 40h semanales de promedio). Regula específicamente la compensación (pluses económicos o días libres compensatorios) por el trabajo en domingos y festivos de apertura autorizada.
                  </li>
                  <li>
                    <strong>4. Vacaciones y Permisos:</strong> Garantiza 31 días naturales de vacaciones remuneradas al año, detallando su disfrute según campañas comerciales (rebajas o Navidad). Incluye licencias retribuidas (ausencias con sueldo) ampliadas y actualizadas para matrimonio, mudanza, hospitalización, accidente o fallecimiento de familiares.
                  </li>
                  <li>
                    <strong>5. Bajas Médicas (IT):</strong> Mejora sustancialmente las prestaciones de la Seguridad Social. En accidentes de trabajo o enfermedad profesional se suele complementar hasta el 100% del salario real desde el primer día. En enfermedad común se establecen tramos de mejora, incluyendo el 100% en caso de hospitalización.
                  </li>
                </ul>
                <p className="summary-note">
                  <em>* Nota: Para conocer el salario base exacto de tu categoría, consulta siempre la última actualización de las <strong>Tablas Salariales del Comercio Textil de Zaragoza</strong> publicadas en el BOPZ.</em>
                </p>
              </div>

              <div className="legal-summary-box">
                <h3>Puntos Clave del Estatuto de los Trabajadores</h3>
                <a href="/documents/Estatuto de los trabajadores.pdf" target="_blank" rel="noopener noreferrer" className="download-btn">
                  Ver Estatuto de los Trabajadores
                </a>
                <ul>
                  <li>
                    <strong>1. Contratos de Trabajo:</strong> Fija las reglas del juego de la contratación. Define los tipos contractuales (priorizando el contrato indefinido sobre el temporal), limita la duración de los periodos de prueba y regula las condiciones para el teletrabajo o la contratación a tiempo parcial.
                  </li>
                  <li>
                    <strong>2. Jornada, Descansos y Vacaciones:</strong> Establece los límites máximos para la salud laboral:
                    <ul>
                      <li><em>Jornada máxima:</em> 40 horas semanales de promedio en cómputo anual.</li>
                      <li><em>Descanso semanal:</em> Un mínimo ininterrumpido de día y medio (generalmente fin de semana).</li>
                      <li><em>Vacaciones:</em> Un mínimo irrenunciable de 30 días naturales al año. No son canjeables por dinero salvo fin de contrato.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>3. Salario:</strong> Garantiza que ningún trabajador perciba menos del Salario Mínimo Interprofesional (SMI) anual. Regula el derecho a un mínimo de dos pagas extraordinarias al año y obliga al empresario a entregar una nómina clara, detallada e individualizada.
                  </li>
                  <li>
                    <strong>4. Permisos y Conciliación:</strong> Recoge el derecho a ausencias pagadas en casos clave (matrimonio, mudanza, hospitalización de familiares). Regula los derechos de conciliación familiar, tales como la suspensión por nacimiento de hijo (16 semanas de prestación) y las excedencias por cuidado de menores o familiares.
                  </li>
                  <li>
                    <strong>5. Faltas, Sanciones y Despidos:</strong> Funciona como código regulador y de salida:
                    <ul>
                      <li><em>Despido disciplinario:</em> Por faltas graves atribuibles al trabajador (sin derecho a indemnización).</li>
                      <li><em>Despido objetivo:</em> Por causas económicas, organizativas o técnicas (indemnización de 20 días por año).</li>
                      <li><em>Despido improcedente:</em> Declarado cuando no hay causa justa válida (indemnización de 33 días por año).</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </WorkCouncilLayout>
  );
};

export default IntranetLegalDocuments;
