import { useEffect, useState } from 'react';
import { AC } from '../engine/audioContext';
import { requestFullscreen } from '../engine/fullscreen';

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    let cancelled = false;
    fontsReady.then(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);

  function handleContinue() {
    AC?.resume();
    requestFullscreen(document.documentElement);
    onDone();
  }

  return (
    <div className="screen splash-screen active" id="screen-splash">
      <div className="splash-emblem">⚖</div>
      <div className="splash-title">El Juicio<br />de los Dioses</div>
      {ready ? (
        <button className="btn splash-continue" onClick={handleContinue}>Continuar</button>
      ) : (
        <div className="splash-loading">Cargando…</div>
      )}
    </div>
  );
}
