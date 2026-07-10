const MUTE_KEY = 'audioMuted';

export function isMuted(): boolean {
  try { return JSON.parse(localStorage.getItem(MUTE_KEY) || 'false') === true; }
  catch { return false; }
}

export function setMuted(v: boolean) {
  try { localStorage.setItem(MUTE_KEY, JSON.stringify(v)); } catch { /* storage unavailable */ }
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
