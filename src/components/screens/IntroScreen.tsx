import { useGame } from '../../state/GameContext';
import { Button } from '../ui/Button';

export function IntroScreen() {
  const { state, dispatch } = useGame();
  const total = state.pendingLength + 1;

  return (
    <div className="screen intro-screen active" id="screen-intro">
      <div className="intro-inner">
        <div className="intro-emblem">⚖</div>
        <div className="intro-title">Tu función: Árbitro del Destino</div>
        <div className="intro-divider" />

        <div className="intro-role">
          <div className="intro-role-label">Tu misión</div>
          <div className="intro-role-text">Los dioses han convocado un juicio sobre la humanidad. Tú eres el árbitro: deberás pronunciar veredicto en {total} dilemas morales que ningún sistema ético puede resolver con certeza absoluta. Cada decisión empuja a la humanidad hacia la salvación o la perdición. Al final, los dioses pronunciarán su sentencia.</div>
        </div>

        <div className="intro-rules">
          <div className="intro-rule">
            <div className="intro-rule-icon">📜</div>
            <div className="intro-rule-body">
              <div className="intro-rule-title">Los dilemas</div>
              <div className="intro-rule-text">Cada evento presenta una situación límite real o hipotética. Leé el contexto completo antes de decidir. No hay respuestas correctas: hay posiciones filosóficas con argumentos propios.</div>
            </div>
          </div>
          <div className="intro-rule">
            <div className="intro-rule-icon">🧭</div>
            <div className="intro-rule-body">
              <div className="intro-rule-title">Las cuatro opciones</div>
              <div className="intro-rule-text">Cada dilema ofrece cuatro respuestas, cada una anclada en una corriente filosófica distinta. La etiqueta de color indica la corriente. Tocá cualquier término subrayado para ver su definición.</div>
            </div>
          </div>
          <div className="intro-rule">
            <div className="intro-rule-icon">⚖</div>
            <div className="intro-rule-body">
              <div className="intro-rule-title">La balanza</div>
              <div className="intro-rule-text">La barra superior muestra el balance moral acumulado. Crece hacia la derecha con decisiones que favorecen a la humanidad, hacia la izquierda con las que la perjudican. El resultado final determina el veredicto de los dioses.</div>
            </div>
          </div>
          <div className="intro-rule">
            <div className="intro-rule-icon">🔄</div>
            <div className="intro-rule-body">
              <div className="intro-rule-title">Rejugabilidad</div>
              <div className="intro-rule-text">Cada partida selecciona 40 dilemas al azar de un pool de 60. Nunca jugarás exactamente lo mismo dos veces. Al final recibirás un perfil filosófico basado en tus decisiones.</div>
            </div>
          </div>
        </div>

        <div>
          <div className="intro-rule-title" style={{ textAlign: 'center', marginBottom: '.7rem', fontFamily: "'Cinzel',serif", fontSize: '.62rem', color: 'var(--muted)', letterSpacing: 2 }}>Corrientes filosóficas presentes</div>
          <div className="intro-philosophies">
            <span className="intro-phil-tag" style={{ color: 'var(--util)', borderColor: 'var(--util)' }}>Utilitarismo</span>
            <span className="intro-phil-tag" style={{ color: 'var(--deon)', borderColor: 'var(--deon)' }}>Deontología</span>
            <span className="intro-phil-tag" style={{ color: 'var(--virt)', borderColor: 'var(--virt)' }}>Virtuosismo</span>
            <span className="intro-phil-tag" style={{ color: 'var(--nihi)', borderColor: 'var(--nihi)' }}>Nihilismo</span>
            <span className="intro-phil-tag" style={{ color: 'var(--exis)', borderColor: 'var(--exis)' }}>Existencialismo</span>
            <span className="intro-phil-tag" style={{ color: 'var(--esto)', borderColor: 'var(--esto)' }}>Estoicismo</span>
            <span className="intro-phil-tag" style={{ color: 'var(--prag)', borderColor: 'var(--prag)' }}>Pragmatismo</span>
            <span className="intro-phil-tag" style={{ color: 'var(--cont)', borderColor: 'var(--cont)' }}>Contractualismo</span>
            <span className="intro-phil-tag" style={{ color: 'var(--femi)', borderColor: 'var(--femi)' }}>Feminismo Ético</span>
            <span className="intro-phil-tag" style={{ color: 'var(--budi)', borderColor: 'var(--budi)' }}>Budismo</span>
          </div>
        </div>

        <div className="intro-modes">
          <div className="intro-rule-title" style={{ textAlign: 'center', marginBottom: '.7rem', fontFamily: "'Cinzel',serif", fontSize: '.62rem', color: 'var(--muted)', letterSpacing: 2 }}>Modos opcionales</div>
          <label className="intro-mode-toggle">
            <input
              type="checkbox"
              checked={state.hiddenPhilosophy}
              onChange={e => dispatch({ type: 'SET_GAME_MODE', hiddenPhilosophy: e.target.checked })}
            />
            <div className="intro-mode-body">
              <div className="intro-mode-title">Filosofía Oculta</div>
              <div className="intro-mode-text">No verás qué corriente filosófica representa cada opción — deberás elegir solo por el contenido del argumento, sin la etiqueta de color como guía.</div>
            </div>
          </label>
          <label className="intro-mode-toggle">
            <input
              type="checkbox"
              checked={state.strictJudge}
              onChange={e => dispatch({ type: 'SET_GAME_MODE', strictJudge: e.target.checked })}
            />
            <div className="intro-mode-body">
              <div className="intro-mode-title">Juez Estricto</div>
              <div className="intro-mode-text">Cada dilema tendrá un límite de 20 segundos. Si el tiempo se agota, se elegirá una opción al azar por vos.</div>
            </div>
          </label>
        </div>

        <div className="intro-cta">
          <Button sound="start" onClick={() => dispatch({ type: 'BEGIN_GAME' })} className="" style={{ minWidth: 240, fontSize: '.9rem', padding: '1rem 2rem' }}>
            Comenzar el Juicio
          </Button>
          <div className="intro-cta-note">Este botón también activa la pantalla completa</div>
          <Button ghost small onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'menu' })}>← Volver al Menú</Button>
        </div>
      </div>
    </div>
  );
}
