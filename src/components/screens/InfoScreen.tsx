import { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { Button } from '../ui/Button';
import { snd } from '../../engine/audio';

type TabId = 'sobre' | 'filosof' | 'aula' | 'activid' | 'eval';

const TABS: { id: TabId; label: string }[] = [
  { id: 'sobre', label: 'El Juego' },
  { id: 'filosof', label: 'Corrientes' },
  { id: 'aula', label: 'En el Aula' },
  { id: 'activid', label: 'Actividades' },
  { id: 'eval', label: 'Evaluación' },
];

export function InfoScreen() {
  const { dispatch } = useGame();
  const [active, setActive] = useState<TabId>('sobre');

  return (
    <div className="screen info-screen active" id="screen-info">
      <div className="info-wrapper">
        <div className="tab-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn${active === t.id ? ' active' : ''}`}
              onClick={() => { snd('tab'); setActive(t.id); }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {active === 'sobre' && (
          <div className="tab-panel active" id="tab-sobre">
            <div className="info-section-title">¿Qué es El Juicio de los Dioses?</div>
            <div className="info-body">
              <p><strong>El Juicio de los Dioses</strong> es una experiencia de toma de decisiones filosófica diseñada para estudiantes de nivel secundario y universitario. A través de 40 dilemas morales, el jugador asume el rol de árbitro del destino humano, obligado a pronunciar veredictos que ningún sistema ético puede resolver con certeza absoluta.</p>
              <p>Cada dilema está construido para generar disonancia cognitiva: ninguna opción es universalmente correcta. El juego no premia la "respuesta buena", sino que registra el <strong>patrón de pensamiento</strong> del jugador a lo largo del tiempo, revelando al final su perfil filosófico con porcentajes por corriente.</p>
              <p><strong>Duración estimada:</strong> 30–45 min de juego individual + 20–30 min de debate posterior.</p>
              <p><strong>Niveles:</strong> Secundario superior (16+), Terciario, Universitario.</p>
              <p><strong>Materias:</strong> Filosofía, Ética, Sociología, Educación Ciudadana, Historia de las Ideas, Ciencias Sociales.</p>
              <h4>Mecánica central</h4>
              <p>La <strong>Barra del Juicio</strong> registra el peso acumulado de cada decisión. No mide "lo correcto" sino las consecuencias colectivas de la cosmovisión ética del jugador. Al finalizar, recibe un veredicto narrativo y un perfil filosófico con análisis de su pensamiento dominante.</p>
              <h4>Temas cubiertos</h4>
              <p>Transhumanismo · Justicia distributiva · Libertad vs. Seguridad · Ecología profunda · Naturaleza del mal · Religión y razón · Derechos individuales vs. colectivos · Inteligencia Artificial · Ética de la vida y la muerte · Memoria histórica · Democracia y algoritmos.</p>
              <h4>Créditos musicales</h4>
              <p style={{ fontSize: '.8rem', opacity: .75 }}>
                Music by <a href="https://pixabay.com/users/faithventuremedia-40297044/" target="_blank" rel="noopener noreferrer">FaithVentureMedia</a>, <a href="https://pixabay.com/users/leberch-42823964/" target="_blank" rel="noopener noreferrer">Nikita Kondrashev</a> and <a href="https://pixabay.com/users/atlasaudio-54514918/" target="_blank" rel="noopener noreferrer">AtlasAudio</a> from <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer">Pixabay</a>.
              </p>
            </div>
          </div>
        )}

        {active === 'filosof' && (
          <div className="tab-panel active" id="tab-filosof">
            <div className="info-section-title">Las Diez Corrientes Filosóficas</div>
            <div className="info-body">
              <div className="philo-chips">
                <span className="chip util">Utilitarismo</span>
                <span className="chip deon">Deontología</span>
                <span className="chip nihi">Nihilismo</span>
                <span className="chip virt">Virtuosismo</span>
                <span className="chip exis">Existencialismo</span>
                <span className="chip esto">Estoicismo</span>
                <span className="chip prag">Pragmatismo</span>
                <span className="chip cont">Contractualismo</span>
                <span className="chip femi">Feminismo Ético</span>
                <span className="chip budi">Budismo</span>
              </div>
              <h4>Utilitarismo</h4>
              <p>Fundado por Jeremy Bentham y desarrollado por John Stuart Mill, sostiene que la acción moralmente correcta es la que <strong>maximiza el bienestar del mayor número</strong>. La ética se evalúa por consecuencias, no por intenciones. El fin puede justificar los medios si el cálculo de felicidad neta es favorable. En el juego: opciones que priorizan el bien colectivo sobre derechos individuales.</p>
              <p><em>Pensadores clave:</em> Bentham, Mill, Peter Singer. <em>Dilema clásico:</em> el problema del tranvía.</p>
              <h4>Deontología</h4>
              <p>Asociada principalmente a Immanuel Kant. Sostiene que ciertas acciones son intrínsecamente correctas o incorrectas <strong>independientemente de sus consecuencias</strong>. El imperativo categórico exige actuar solo según principios universalizables. La dignidad humana es un fin, nunca un medio. En el juego: opciones que defienden principios absolutos aunque el costo sea alto.</p>
              <p><em>Pensadores clave:</em> Kant, W.D. Ross, John Rawls. <em>Dilema clásico:</em> ¿mentirías para proteger a un inocente?</p>
              <h4>Nihilismo</h4>
              <p>Cuestiona la existencia de valores objetivos, verdades absolutas o propósitos intrínsecos. El <strong>nihilismo activo</strong> nietzscheano invita a destruir los valores heredados para crear otros nuevos. En el juego: opciones que rechazan los marcos normativos establecidos o cuestionan la relevancia misma de la decisión.</p>
              <p><em>Pensadores clave:</em> Nietzsche, Schopenhauer, Camus. <em>Dilema clásico:</em> ¿tiene sentido la acción moral si el universo es indiferente?</p>
              <h4>Virtuosismo (Ética de la Virtud)</h4>
              <p>Originado en Aristóteles. No pregunta "¿qué debo hacer?" sino "<strong>¿qué clase de persona debo ser?</strong>". La moral reside en el cultivo de virtudes —sabiduría, justicia, valentía, templanza— y en la búsqueda de la eudaimonía (florecimiento humano). En el juego: opciones que priorizan el carácter, la excelencia y el desarrollo integral.</p>
              <p><em>Pensadores clave:</em> Aristóteles, Alasdair MacIntyre, Martha Nussbaum.</p>
              <h4>Existencialismo</h4>
              <p>Para Sartre, <strong>la existencia precede a la esencia</strong>: no hay naturaleza humana previa, somos lo que elegimos ser. Esa libertad radical es también una condena, porque no podemos no elegir y cada elección implica una responsabilidad absoluta. De Beauvoir extendió el análisis al género, mostrando que "la mujer" es una construcción histórica, no un destino biológico. En el juego: opciones que priorizan la autenticidad, la libertad individual y la responsabilidad personal por sobre cualquier guion prefijado.</p>
              <p><em>Pensadores clave:</em> Sartre, Simone de Beauvoir, Camus, Kierkegaard. <em>Dilema clásico:</em> la angustia de la libertad absoluta.</p>
              <h4>Estoicismo</h4>
              <p>Enseña a distinguir <strong>lo que depende de nosotros de lo que no</strong>, y a cultivar la serenidad interior ante lo inevitable. Epicteto, exesclavizado y libre por dentro, y Marco Aurelio, emperador y austero por convicción, muestran que esta disciplina se practica en cualquier condición. No es resignación pasiva, sino la decisión de no desperdiciar energía moral en lo que no se puede cambiar. En el juego: opciones que priorizan la ecuanimidad y la aceptación racional por sobre la reacción emocional.</p>
              <p><em>Pensadores clave:</em> Epicteto, Marco Aurelio, Séneca, Zenón de Citio.</p>
              <h4>Pragmatismo</h4>
              <p>No pregunta si una idea es abstractamente verdadera sino <strong>si funciona</strong>: si produce resultados verificables y mejora la experiencia concreta. James aplicó esto a la ética, y Dewey lo llevó a la educación y la democracia como instrumentos de mejora continua. Es una ética antidogmática: ningún principio es sagrado si sus consecuencias son dañinas. En el juego: opciones que evalúan cada situación por su resultado práctico, sin apego a un marco fijo.</p>
              <p><em>Pensadores clave:</em> William James, John Dewey, Charles Sanders Peirce, Richard Rorty.</p>
              <h4>Contractualismo</h4>
              <p>Sostiene que la legitimidad moral y política nace del <strong>acuerdo entre personas libres e iguales</strong>. Para Rawls, los principios de justicia son los que se elegirían tras un velo de ignorancia, sin saber qué lugar se ocupará en la sociedad. Scanlon propone que una acción es incorrecta si sus principios no pueden ser razonablemente rechazados por nadie afectado. En el juego: opciones que priorizan los procedimientos justos y el acuerdo legítimo por sobre la imposición unilateral.</p>
              <p><em>Pensadores clave:</em> Jean-Jacques Rousseau, John Locke, John Rawls, Thomas Scanlon.</p>
              <h4>Feminismo Ético</h4>
              <p>Carol Gilligan demostró que las teorías éticas dominantes, basadas en principios abstractos y universales, reflejaban perspectivas masculinas e ignoraban una <strong>ética del cuidado</strong> orientada a las relaciones concretas de interdependencia. bell hooks amplió el enfoque integrando raza y clase: la opresión es interseccional. En el juego: opciones que priorizan el cuidado mutuo, las relaciones concretas y la crítica a los sistemas que naturalizan el privilegio.</p>
              <p><em>Pensadores clave:</em> Carol Gilligan, Nel Noddings, bell hooks, Simone de Beauvoir, Virginia Held.</p>
              <h4>Budismo</h4>
              <p>Parte de una premisa radical: el sufrimiento es universal y tiene una causa —el apego y el deseo— que puede comprenderse y reducirse. La <strong>compasión (karuna)</strong> no es un sentimiento sino una práctica activa de reconocer el sufrimiento ajeno y actuar para aliviarlo, dentro de una red de interdependencia donde toda acción tiene consecuencias. En el juego: opciones que priorizan la reducción del daño y la ecuanimidad por sobre la afirmación del yo o del grupo propio.</p>
              <p><em>Pensadores clave:</em> Siddhartha Gautama, Nagarjuna, Thich Nhat Hanh, Dalai Lama XIV.</p>
            </div>
          </div>
        )}

        {active === 'aula' && (
          <div className="tab-panel active" id="tab-aula">
            <div className="info-section-title">Implementación en el Aula</div>
            <div className="info-body">
              <h4>Protocolo recomendado <span className="timer-badge">75–90 min</span></h4>
              <p><strong>Fase 1 — Introducción (10 min):</strong> Presentar brevemente las diez corrientes filosóficas con ejemplos cotidianos. No explicar el funcionamiento del juego en detalle: parte del aprendizaje ocurre al descubrir los propios patrones.</p>
              <p><strong>Fase 2 — Juego individual (30–40 min):</strong> Cada estudiante juega en silencio. Pedirles que anoten tres decisiones que les resultaron especialmente difíciles y el motivo.</p>
              <p><strong>Fase 3 — Socialización de perfiles (10 min):</strong> El docente registra en el pizarrón los porcentajes filosóficos de cada estudiante. Se construye un perfil grupal colectivo y se analiza la distribución.</p>
              <p><strong>Fase 4 — Debate estructurado (20–30 min):</strong> Sobre los dilemas más polémicos o más divididos del grupo.</p>
              <h4>Recomendaciones</h4>
              <ul>
                <li>No presentar el juego como un "test de personalidad": el objetivo es la reflexión, no la etiqueta.</li>
                <li>Evitar revelar el impacto numérico de cada opción durante el juego. El estudiante debe decidir sin calcular la "respuesta ganadora".</li>
                <li>Las respuestas nihilistas frecuentes pueden indicar agotamiento decisional o resistencia al marco normativo: esto también es material filosófico valioso.</li>
                <li>El perfil final no es un diagnóstico sino un punto de partida para la conversación.</li>
              </ul>
              <h4>Adaptación por nivel</h4>
              <p><strong>Secundario:</strong> Reducir a los primeros 15 dilemas. Focalizar el debate en utilitarismo vs. deontología.</p>
              <p><strong>Terciario/Universitario:</strong> Juego completo. Añadir lectura de fragmentos primarios (Kant, Mill, Aristóteles) y conectar decisiones con textos específicos.</p>
            </div>
          </div>
        )}

        {active === 'activid' && (
          <div className="tab-panel active" id="tab-activid">
            <div className="info-section-title">Actividades de Seguimiento</div>
            <div className="info-body">
              <div className="activity-grid">
                <div className="activity-card">
                  <div className="activity-card-num">Actividad 01</div>
                  <div className="activity-card-title">El Tribunal Filosófico</div>
                  <div className="activity-card-desc">Dividir el grupo en cuatro equipos por corriente. Retomar un dilema polémico y que cada equipo argumente la posición asignada, aunque no sea la propia.</div>
                </div>
                <div className="activity-card">
                  <div className="activity-card-num">Actividad 02</div>
                  <div className="activity-card-title">El Diario del Árbitro</div>
                  <div className="activity-card-desc">Elegir tres dilemas y escribir un texto argumentativo (300–400 palabras) justificando cada decisión con vocabulario filosófico explícito.</div>
                </div>
                <div className="activity-card">
                  <div className="activity-card-num">Actividad 03</div>
                  <div className="activity-card-title">El Dilema Propio</div>
                  <div className="activity-card-desc">Cada estudiante diseña un dilema original: situación, cuatro opciones (cada una anclada en una corriente filosófica distinta) y justificación de impactos.</div>
                </div>
                <div className="activity-card">
                  <div className="activity-card-num">Actividad 04</div>
                  <div className="activity-card-title">Mapeo de Contradicciones</div>
                  <div className="activity-card-desc">Analizar el perfil filosófico propio: ¿en qué dilemas se contradijo la corriente dominante? ¿Qué revela eso sobre los límites de cada sistema?</div>
                </div>
                <div className="activity-card">
                  <div className="activity-card-num">Actividad 05</div>
                  <div className="activity-card-title">Debate Socrático</div>
                  <div className="activity-card-desc">El docente formula preguntas abiertas. Los estudiantes responden y se cuestionan entre sí. El docente no interviene con opiniones, solo profundiza.</div>
                </div>
                <div className="activity-card">
                  <div className="activity-card-num">Actividad 06</div>
                  <div className="activity-card-title">Conexión Histórica</div>
                  <div className="activity-card-desc">Vincular dilemas con eventos reales: el Dilema 8 (memoria) con regímenes totalitarios; el Dilema 5 (algoritmo) con la vigilancia de Estado contemporánea.</div>
                </div>
              </div>
              <h4>Preguntas de reflexión post-juego</h4>
              <ul>
                <li>¿Tu perfil filosófico te sorprendió? ¿Coincide con cómo te describís a vos mismo/a?</li>
                <li>¿Hubo dilemas donde "ninguna opción" te convencía? ¿Qué indica eso?</li>
                <li>¿Cambiaste de corriente filosófica a lo largo del juego? ¿En qué momento y por qué?</li>
                <li>¿Existe una corriente filosófica "correcta" para todos los dilemas, o depende del contexto?</li>
                <li>¿Cómo influye el poder (ser árbitro del destino humano) en la calidad de las decisiones morales?</li>
              </ul>
            </div>
          </div>
        )}

        {active === 'eval' && (
          <div className="tab-panel active" id="tab-eval">
            <div className="info-section-title">Criterios de Evaluación</div>
            <div className="info-body">
              <p>El juego en sí no es evaluable: ninguna decisión es "correcta". Lo evaluable es la <strong>capacidad argumentativa</strong>, la <strong>coherencia del pensamiento</strong> y el <strong>manejo de conceptos filosóficos</strong> en las actividades de seguimiento.</p>
              <h4>Rúbrica — Texto argumentativo</h4>
              <ul>
                <li><strong>Identificación de la corriente (20%):</strong> Nombra y describe correctamente la corriente que fundamenta su decisión.</li>
                <li><strong>Argumentación lógica (25%):</strong> Estructura coherente: premisa → desarrollo → conclusión.</li>
                <li><strong>Vocabulario filosófico (20%):</strong> Usa términos técnicos con precisión (imperativo categórico, eudaimonía, utilidad marginal, etc.).</li>
                <li><strong>Reconocimiento de límites (20%):</strong> Identifica objeciones a su posición y responde a ellas.</li>
                <li><strong>Originalidad del análisis (15%):</strong> Conecta el dilema con ejemplos reales, textos o debates contemporáneos.</li>
              </ul>
              <h4>Rúbrica — Debate</h4>
              <ul>
                <li><strong>Claridad expositiva (25%):</strong> Expone su posición con orden y precisión.</li>
                <li><strong>Escucha activa (20%):</strong> Responde a los argumentos del interlocutor, no al estereotipo de su posición.</li>
                <li><strong>Fundamentación filosófica (30%):</strong> Sus argumentos remiten a principios éticos identificables.</li>
                <li><strong>Apertura al cambio (25%):</strong> Puede reconocer la solidez de un argumento contrario sin perder su posición.</li>
              </ul>
              <h4>Índice de Compromiso Reflexivo</h4>
              <p>Al finalizar la partida, el juego muestra un <strong>índice de compromiso reflexivo</strong> (0-100) y hasta 3 dilemas donde el estudiante más deliberó. <strong>No es una nota</strong>: combina tiempo dedicado a cada decisión, uso del Ateneo de Filósofos y diversidad de corrientes exploradas — nunca qué opción eligió. Sirve como insumo concreto para las rúbricas de arriba (por ejemplo, para elegir con qué dilema empezar el "Diario del Árbitro" o el debate).</p>
              <h4>Nota metodológica</h4>
              <p>No se recomienda calificar el <strong>perfil filosófico resultante</strong> del juego. Hacerlo induciría a los estudiantes a elegir "para la nota". El valor pedagógico reside precisamente en la honestidad de las decisiones.</p>
            </div>
          </div>
        )}
      </div>
      <Button ghost onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'menu' })} style={{ margin: '.5rem auto 1rem' }}>Volver al Menú</Button>
    </div>
  );
}
