import { useSyncExternalStore } from 'react';
import { isMuted, setMuted, subscribeMuted } from '../../engine/audioPrefs';
import { startMusic, stopMusic } from '../../engine/music';

export function MuteToggle() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted);

  function toggle() {
    const next = !muted;
    setMuted(next);
    if (next) stopMusic();
    else startMusic();
  }

  return (
    <button
      className="footer-icon-btn"
      onClick={toggle}
      aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      title={muted ? 'Activar sonido' : 'Silenciar'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
