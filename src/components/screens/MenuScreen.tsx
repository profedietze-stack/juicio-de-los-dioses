import { useState } from 'react';
import { useGame, hasSavedGame } from '../../state/GameContext';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { clearSavedGame } from '../../engine/persistence';
import { FULL_SESSION_LENGTH, SHORT_SESSION_LENGTH } from '../../engine/poolBuilder';
import { snd } from '../../engine/audio';

export function MenuScreen() {
  const { dispatch } = useGame();
  const [confirmingResume, setConfirmingResume] = useState(false);
  const [pendingLength, setPendingLength] = useState(FULL_SESSION_LENGTH);
  const continuing = hasSavedGame();

  function handleNewGame(length: number) {
    if (hasSavedGame()) {
      setPendingLength(length);
      setConfirmingResume(true);
    } else {
      dispatch({ type: 'GO_TO_INTRO', length });
    }
  }

  return (
    <div className="screen menu-screen active" id="screen-menu">
      <div className="menu-emblem">⚖</div>
      <div className="menu-title">El Juicio<br />de los Dioses</div>
      <div className="menu-tagline">Un juego de filosofía para decidir el destino de la humanidad</div>
      <div className="menu-divider" />
      <div className="btn-group">
        {continuing && (
          <div className="btn-continue-wrap" id="btn-continue">
            <Button sound="start" onClick={() => dispatch({ type: 'CONTINUE_GAME' })}>Continuar Partida</Button>
            <span className="btn-continue-badge">En curso</span>
          </div>
        )}
        <Button sound="start" onClick={() => handleNewGame(FULL_SESSION_LENGTH)}>Nueva Partida</Button>
        <Button ghost small onClick={() => handleNewGame(SHORT_SESSION_LENGTH)}>Partida Corta (15 dilemas)</Button>
        <Button ghost onClick={() => { snd('nav'); dispatch({ type: 'GO_TO_SCREEN', screen: 'achievements' }); }}>Ver Informes Guardados</Button>
        <Button ghost onClick={() => { snd('nav'); dispatch({ type: 'GO_TO_SCREEN', screen: 'achievements' }); }}>Galería de Logros</Button>
        <Button ghost onClick={() => { snd('nav'); dispatch({ type: 'GO_TO_SCREEN', screen: 'info' }); }}>Guía Pedagógica</Button>
      </div>
      <div className="creator-credit">
        <div className="cc-line l" />
        <div className="cc-text">Creado por <em>ProfeD.</em></div>
        <div className="cc-line r" />
      </div>

      {confirmingResume && (
        <ConfirmDialog
          title="Partida en curso"
          body="Tenés una partida sin terminar. Si comenzás una nueva, el progreso actual se perderá."
          confirmLabel="✦ Nueva Partida"
          cancelLabel="← Continuar la actual"
          onConfirm={() => { clearSavedGame(); setConfirmingResume(false); dispatch({ type: 'GO_TO_INTRO', length: pendingLength }); }}
          onCancel={() => { setConfirmingResume(false); dispatch({ type: 'CONTINUE_GAME' }); }}
        />
      )}
    </div>
  );
}
