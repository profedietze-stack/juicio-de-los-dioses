const MUTE_KEY = 'audioMuted';

// Multiple components (footer MuteToggle, OptionsModal) read/write mute state
// independently. Without a shared subscription each keeps a stale local copy,
// so toggling one leaves the other out of sync — the classic "sometimes the
// button does nothing" bug. This tiny pub-sub lets every subscriber react to
// every change, wherever it originated.
const listeners = new Set<() => void>();

export function subscribeMuted(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function isMuted(): boolean {
  try { return JSON.parse(localStorage.getItem(MUTE_KEY) || 'false') === true; }
  catch { return false; }
}

export function setMuted(v: boolean) {
  try { localStorage.setItem(MUTE_KEY, JSON.stringify(v)); } catch { /* storage unavailable */ }
  listeners.forEach(cb => cb());
}

const VOLUME_KEY = 'musicVolume';

export function getMusicVolume(): number {
  try {
    const v = JSON.parse(localStorage.getItem(VOLUME_KEY) || '1');
    return typeof v === 'number' && v >= 0 && v <= 1 ? v : 1;
  } catch { return 1; }
}

export function setMusicVolume(v: number) {
  try { localStorage.setItem(VOLUME_KEY, JSON.stringify(v)); } catch { /* storage unavailable */ }
}
