import { useEffect, useState } from 'react';
import { isFullscreen, toggleFullscreen } from '../../engine/fullscreen';

export function FullscreenToggle() {
  const [fullscreen, setFullscreen] = useState(isFullscreen());

  useEffect(() => {
    const onChange = () => setFullscreen(isFullscreen());
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  return (
    <button
      className="fullscreen-toggle"
      onClick={() => toggleFullscreen(document.documentElement)}
      aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
      title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
    >
      {fullscreen ? '⤢' : '⛶'}
    </button>
  );
}
