import { useState } from 'react';
import { isMuted, setMuted } from '../../engine/audioPrefs';
import { startMusic, stopMusic } from '../../engine/music';
import { useGame } from '../../state/GameContext';

export function MuteToggle() {
  const [muted, setMutedState] = useState(isMuted());
  const { state } = useGame();

  function toggle() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (next) stopMusic();
    else if (state.screen === 'event') startMusic();
  }

  return (
    <button
      className="mute-toggle"
      onClick={toggle}
      aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      title={muted ? 'Activar sonido' : 'Silenciar'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
