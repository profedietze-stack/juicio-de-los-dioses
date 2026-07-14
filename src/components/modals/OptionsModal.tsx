import { useState, useSyncExternalStore } from 'react';
import { isMuted, setMuted, subscribeMuted, getMusicVolume, setMusicVolume } from '../../engine/audioPrefs';
import { startMusic, stopMusic, setLiveMusicVolume } from '../../engine/music';
import { getUiPrefs, saveUiPrefs, applyUiPrefs, UI_PREFS_DEFAULTS, type UiPrefs } from '../../engine/uiPrefs';
import { snd } from '../../engine/audio';

export function OptionsModal({ onClose }: { onClose: () => void }) {
  const muted = useSyncExternalStore(subscribeMuted, isMuted);
  const [volume, setVolume] = useState(getMusicVolume());
  const [prefs, setPrefs] = useState<UiPrefs>(getUiPrefs());

  function toggleMuted() {
    const next = !muted;
    setMuted(next);
    if (next) stopMusic();
    else startMusic();
  }

  function handleVolume(v: number) {
    setVolume(v);
    setMusicVolume(v);
    setLiveMusicVolume(v);
  }

  function updatePrefs(patch: Partial<UiPrefs>) {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    saveUiPrefs(next);
    applyUiPrefs(next);
  }

  function reset() {
    updatePrefs(UI_PREFS_DEFAULTS);
  }

  return (
    <div
      id="options-modal"
      style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="options-panel fade-up">
        <div className="options-title">Opciones</div>

        <div className="options-section">
          <div className="options-label">Sonido</div>
          <label className="options-toggle-row">
            <input type="checkbox" checked={!muted} onChange={toggleMuted} />
            Sonidos y música activados
          </label>
        </div>

        <div className="options-section">
          <div className="options-label">Volumen de música — {Math.round(volume * 100)}%</div>
          <input
            type="range" min={0} max={1} step={0.05} value={volume} disabled={muted}
            onChange={e => handleVolume(Number(e.target.value))}
            className="options-range"
          />
        </div>

        <div className="options-section options-color-row">
          <div>
            <div className="options-label">Color de fondo</div>
            <input type="color" value={prefs.bg} onChange={e => updatePrefs({ bg: e.target.value })} className="options-color" />
          </div>
          <div>
            <div className="options-label">Color de letra</div>
            <input type="color" value={prefs.text} onChange={e => updatePrefs({ text: e.target.value })} className="options-color" />
          </div>
        </div>

        <div className="options-section">
          <div className="options-label">Tamaño de letra — {Math.round(prefs.fontScale * 100)}%</div>
          <input
            type="range" min={0.85} max={1.3} step={0.05} value={prefs.fontScale}
            onChange={e => updatePrefs({ fontScale: Number(e.target.value) })}
            className="options-range"
          />
        </div>

        <button className="btn btn-ghost btn-sm" style={{ marginTop: '.3rem' }} onClick={reset}>Restablecer valores por defecto</button>
        <button className="btn" style={{ marginTop: '.7rem' }} onClick={() => { snd('nav'); onClose(); }}>Cerrar</button>
      </div>
    </div>
  );
}
