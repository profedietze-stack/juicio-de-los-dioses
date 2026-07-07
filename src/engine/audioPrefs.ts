const MUTE_KEY = 'audioMuted';

export function isMuted(): boolean {
  try { return JSON.parse(localStorage.getItem(MUTE_KEY) || 'false') === true; }
  catch { return false; }
}

export function setMuted(v: boolean) {
  try { localStorage.setItem(MUTE_KEY, JSON.stringify(v)); } catch { /* storage unavailable */ }
}
