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
            <h1>Píldoras Informativas 2026</h1>
            <p>
              Actualización laboral: Modificación y extinción de contratos, prevención de riesgos y documentos legales.
            </p>
          </div>
        </section>

        <main className="work-capsules-main">

          {/* 1. Modificación y Extinción de Contratos */}
          <section className="section-card">
            <span className="tag-badge">Actualización Laboral 2026</span>
            <h2>1. Modificación Sustancial</h2>
            <p>
              Regulada en el Artículo 41 del Estatuto de los Trabajadores (ET), es la facultad del empresario para alterar aspectos esenciales del contrato por razones ETOP (Económicas, Técnicas, Organizativas o de Producción).
            </p>

            <h3 style={{ marginTop: "1.5rem" }}>¿Qué puede cambiar la empresa?</h3>
            <div className="infographic-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              <div className="infographic-card">
                <h4>JORNADA DE TRABAJO Y HORARIO</h4>
                <p>Incluyendo el régimen de turnos.</p>
              </div>
              <div className="infographic-card">
                <h4>SISTEMA DE REMUNERACIÓN</h4>
                <p>Cuantía salarial (SMI 2026: 1.221 €) y sistema de rendimiento.</p>
              </div>
              <div className="infographic-card">
                <h4>FUNCIONES</h4>
                <p>Cuando excedan de la movilidad funcional ordinaria.</p>
              </div>
            </div>

            <h3 style={{ marginTop: "2rem" }}>Tus derechos legales ante un cambio</h3>
            <div className="infographic-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              <div className="infographic-card">
                <h4>1. Aceptar la modificación</h4>
                <p>El contrato sigue con las nuevas condiciones.</p>
              </div>
              <div className="infographic-card">
                <h4>2. Rescindir el contrato</h4>
                <p>Indemnización de 20 días por año (máx. 9 mensualidades).</p>
              </div>
              <div className="infographic-card">
                <h4>3. Impugnar judicialmente</h4>
                <p>Plazo de 20 días hábiles para demandar si no hay razón justificada para el cambio.</p>
              </div>
            </div>

            <h2 style={{ marginTop: "3rem", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>2. Extinción del Contrato</h2>

            <h3 style={{ marginTop: "1.5rem" }}>A. Por voluntad del trabajador (Iniciativa Propia)</h3>
            <div className="infographic-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              <div className="infographic-card">
                <h4>DIMISIÓN / BAJA VOLUNTARIA</h4>
                <p>Preaviso según convenio (15 días). Sin indemnización ni paro.</p>
              </div>
              <div className="infographic-card" style={{ borderLeft: "4px solid darkred" }}>
                <h4>RESOLUCIÓN (ART. 50 ET)</h4>
                <p>Por incumplimiento empresarial. Indemnización de 33 días/año.</p>
              </div>
            </div>

            <h3 style={{ marginTop: "2rem" }}>B. Por voluntad de la empresa (Despidos)</h3>
            <div style={{ overflowX: "auto", marginTop: "1rem" }}>
              <table className="schedule-table" style={{ width: "100%", textAlign: "left", minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "1rem", borderBottom: "2px solid var(--border)", backgroundColor: "var(--surface)" }}>TIPO</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid var(--border)", backgroundColor: "var(--surface)" }}>CAUSA PRINCIPAL</th>
                    <th style={{ padding: "1rem", borderBottom: "2px solid var(--border)", backgroundColor: "var(--surface)" }}>INDEMNIZACIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)", fontWeight: "bold" }}>Disciplinario</td>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}>Incumplimiento grave del trabajador.</td>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)", color: "var(--accent)", fontWeight: "bold" }}>0 € (Solo finiquito).</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)", fontWeight: "bold" }}>Objetivo</td>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}>Causas ETOP justificadas.</td>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)", color: "var(--accent)", fontWeight: "bold" }}>20 días/año (máx. 12 mens.)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)", fontWeight: "bold" }}>Improcedente</td>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}>Sin causa legal o defecto de forma.</td>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)", color: "var(--accent)", fontWeight: "bold" }}>33 días/año (máx. 24 mens.)*</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)", fontWeight: "bold" }}>Nulo</td>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}>Discriminación o violación de derechos.</td>
                    <td style={{ padding: "1rem", borderBottom: "1px solid var(--border)", color: "var(--accent)", fontWeight: "bold" }}>Readmisión obligatoria.</td>
                  </tr>

                </tbody>
              </table>
            </div>
            <p style={{ fontStyle: "italic", fontSize: "0.85rem", marginTop: "1rem", color: "var(--text-secondary)" }}>
              *Jurisprudencia Mayo 2026: Los tribunales aplican indemnizaciones adicionales si los 33 días son insuficientes, bajo la Carta Social Europea.
            </p>
            <div className="temporal-notice">
              <strong>AVISO</strong> Fin de Contrato Temporal: 12 días por año al finalizar (circunstancias producción/sustitución).
            </div>

          </section>

          {/* 2. Información acerca del despido improcedente */}
          <section className="section-card grid-two">
            <div>
              <span className="tag-badge">Despido Improcedente</span>
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

          {/* DESPIDO DISCIPLINARIO */}
          <section className="section-card">
            <span className="tag-badge">Derechos</span>
            <h2>DESPIDO DISCIPLINARIO</h2>

            <div className="infographic-card" style={{ marginBottom: "1.5rem" }}>
              <h4>1. EL CONCEPTO BÁSICO</h4>
              <p>Es el despido por un incumplimiento grave y culpable.</p>
              <ul className="info-list" style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}><strong>PIERDES:</strong> Derecho a indemnización y a días de preaviso.</li>
                <li><strong>MANTIENES:</strong> Derecho al Finiquito y a pedir la prestación por desempleo (paro).</li>
              </ul>
            </div>

            <div className="infographic-card" style={{ marginBottom: "1.5rem" }}>
              <h4>2. ¿POR QUÉ TE PUEDEN DESPEDIR ASÍ? (Art. 54)</h4>
              <p>Solo es válido si la empresa demuestra alguna de estas faltas:</p>
              <ul className="info-list" style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Faltas de asistencia o impuntualidad repetidas e injustificadas.</li>
                <li style={{ marginBottom: "0.5rem" }}>Indisciplina o desobediencia en el trabajo.</li>
                <li style={{ marginBottom: "0.5rem" }}>Ofensas verbales o físicas al empresario, compañeros o familiares.</li>
                <li style={{ marginBottom: "0.5rem" }}>Transgresión de la buena fe contractual o abuso de confianza.</li>
                <li style={{ marginBottom: "0.5rem" }}>Disminución continuada y voluntaria del rendimiento.</li>
                <li style={{ marginBottom: "0.5rem" }}>Embriaguez habitual o toxicomanía si repercuten negativamente en el trabajo.</li>
                <li>Acoso por razón de origen racial, religión, discapacidad, edad u orientación sexual y el acoso sexual.</li>
              </ul>
            </div>

            <div className="grid-two-capsules" style={{ marginBottom: "1.5rem" }}>
              <div className="infographic-card">
                <h4>3. LAS OBLIGACIONES DE LA EMPRESA</h4>
                <p>No vale un despido verbal. Deben cumplir esto:</p>
                <ul className="info-list" style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Carta de Despido:</strong> Por escrito, con hechos detallados, actos concretos y fechas exactas.</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Audiencia Previa (Novedad 2026):</strong> Deben dejarte defenderte y aportar pruebas antes de que el despido sea efectivo.</li>
                  <li><strong>Expediente Contradictorio:</strong> Obligatorio solo si eres representante legal de los trabajadores o delegado sindical.</li>
                </ul>
              </div>

              <div className="infographic-card">
                <h4>4. ¿QUÉ HACER EN EL MOMENTO DEL DESPIDO?</h4>
                <p><strong>REGLA DE ORO:</strong> Mantén la calma y firma todo así: <br /><em>"RECIBIDO, NO CONFORME" + Fecha de hoy + Tu firma</em></p>
                <ul className="info-list" style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>En la Carta:</strong> Hacerlo no te obliga a demandar, pero te guarda el derecho a hacerlo.</li>
                  <li><strong>En el Finiquito:</strong> Recuerda que esto solo te paga lo atrasado (vacaciones no disfrutadas, parte proporcional de pagas extra, días del mes trabajado), no es la indemnización por despido. Fírmalo también como "No conforme" o "Pendiente de revisión".</li>
                </ul>
              </div>
            </div>

            <div className="infographic-card" style={{ marginBottom: "1.5rem", overflowX: "auto" }}>
              <h4>5. SI DENUNCIAS... ¿QUÉ PUEDE DECIR EL JUEZ?</h4>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem", textAlign: "left", minWidth: "500px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-capsule-hover)", color: "var(--text-main)" }}>
                    <th style={{ padding: "0.75rem", borderBottom: "2px solid var(--border)" }}>Sentencia</th>
                    <th style={{ padding: "0.75rem", borderBottom: "2px solid var(--border)" }}>¿Qué significa?</th>
                    <th style={{ padding: "0.75rem", borderBottom: "2px solid var(--border)" }}>Tu resultado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}><strong>PROCEDENTE</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>La empresa tenía razón y confirma las causas.</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>Te quedas sin indemnización.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}><strong>IMPROCEDENTE</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>La empresa no probó los hechos o falló el proceso.</td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>Readmisión O 33 días por año trabajado. <br /><small style={{ color: "var(--text-muted)" }}>(Novedad 2026: Posible indemnización "disuasoria" por daños si los 33 días son muy pocos y el despido fue arbitrario).</small></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem" }}><strong>NULO</strong></td>
                    <td style={{ padding: "0.75rem" }}>Hubo discriminación o violación de derechos fundamentales.</td>
                    <td style={{ padding: "0.75rem" }}>Readmisión obligatoria y pago de salarios de tramitación.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid-two-capsules">
              <div className="infographic-card">
                <h4>6. TU LÍNEA DE TIEMPO (PLAZOS CRÍTICOS)</h4>
                <ul className="info-list" style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Para la empresa (Prescripción de la falta):</strong> Tiene 60 días para sancionarte desde que descubre tu falta, y máximo 6 meses desde que ocurrió.</li>
                  <li><strong>Para el trabajador (Demanda):</strong> Tienes <strong>SOLO 20 DÍAS HÁBILES</strong> (sin contar sábados, domingos ni festivos) desde el día siguiente a la fecha de efectos del despido para reclamar (Papeleta de Conciliación ante el SMAC o similar).</li>
                </ul>
              </div>
              <div className="infographic-card" style={{ borderLeft: "4px solid var(--accent)" }}>
                <h4 style={{ color: "var(--accent)" }}>CONSEJO FINAL</h4>

                <p>
                  Las palabras se las lleva el viento. No te fíes de acuerdos verbales de pasillo y busca asesoramiento legal de inmediato el mismo día que te den la carta.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Prevención y Riesgos Laborales */}
          <section className="section-card">
            <span className="tag-badge">Seguridad y Salud</span>
            <h2>Prevención de Riesgos Laborales (España 2026)</h2>
            <p>
              La salud y la seguridad son una prioridad. A continuación, los módulos unificados de integración (MUIN).
            </p>

            <div style={{ textAlign: "center", margin: "2rem 0" }}>
              {/* Insertar la imagen de prevención y riesgos laborales */}
              <img
                src={new URL("../assets/Img/prevencion_y_riesgos_laborales.png", import.meta.url).href}
                alt="Prevención y Riesgos Laborales"
                style={{ maxWidth: "100%", height: "auto", borderRadius: "12px", border: "1px solid var(--border)" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Guarda+la+imagen+en+src/assets/Img/prevencion_y_riesgos_laborales.png'
                }}
              />
            </div>

            <div className="infographic-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
              <div className="infographic-card">
                <h4>1. Riesgos Psicosociales (Estrés y Burnout)</h4>
                <p>En 2026, la Inspección de Trabajo pone el foco en la salud mental. Una plantilla de 400 personas suele enfrentarse a ritmos altos y falta de desconexión.</p>
                <p><strong>El Riesgo:</strong> Ansiedad, depresión o agotamiento derivados de la carga de trabajo, la falta de apoyo o el acoso laboral.</p>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "1rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Evaluación Psicosocial:</strong> Realizar encuestas anónimas periódicas para medir el clima laboral.</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Protocolo de Desconexión Digital:</strong> Garantizar por contrato que no se envíen correos ni mensajes fuera del horario laboral.</li>
                  <li><strong>Canal de Denuncias:</strong> Un sistema robusto y anónimo para reportar casos de acoso de forma inmediata.</li>
                </ul>
              </div>
              <div className="infographic-card">
                <h4>2. Riesgos Ergonómicos y TME</h4>
                <p>Con una estructura de gran empresa, el sedentarismo en oficinas y los movimientos repetitivos en logística o producción son la causa número uno de bajas.</p>
                <p><strong>El Riesgo:</strong> Lesiones de espalda, túnel carpiano, fatiga ocular o problemas cervicales.</p>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "1rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Mobiliario Ergonómico:</strong> Sillas regulables, soportes de pantalla a la altura de los ojos y reposapiés.</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Pausas Activas:</strong> Implementar 5 minutos de estiramientos guiados cada 2 horas de trabajo estático.</li>
                  <li><strong>Formación en Higiene Postural:</strong> Enseñar a la plantilla cómo sentarse o cómo levantar cargas sin comprometer la columna.</li>
                </ul>
              </div>
              <div className="infographic-card">
                <h4>3. Riesgos de Caídas y Golpes</h4>
                <p>Incluso en entornos de oficina, las caídas al mismo nivel o golpes contra objetos son los accidentes más frecuentes en empresas con mucho tránsito de personas.</p>
                <p><strong>El Riesgo:</strong> Tropiezos con cables sueltos, resbalones en suelos mojados o golpes con mobiliario mal ubicado.</p>
                <ul style={{ paddingLeft: "1.2rem", marginTop: "1rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Orden y Limpieza (5S):</strong> Mantener pasillos despejados y zonas de paso libres de obstáculos.</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Canalización de Cableado:</strong> Asegurar que todos los cables estén ocultos o fijados al suelo/mesa.</li>
                  <li><strong>Señalización Correcta:</strong> Uso de señales reflectantes en desniveles y avisos inmediatos durante la limpieza.</li>
                </ul>
              </div>
            </div>
          </section>


        </main>
      </div>
    </WorkCouncilLayout>
  );
};
