import { AC } from './audioContext';
import { isMuted } from './audioPrefs';

type SoundConfig = { type?: OscillatorType; freq: number; freq2?: number; dur?: number; vol?: number };

function _play(cfg: SoundConfig) {
  if (!AC) return;
  if (AC.state === 'suspended') AC.resume();
  const t = AC.currentTime;
  const osc = AC.createOscillator(), gain = AC.createGain();
  osc.connect(gain); gain.connect(AC.destination);
  osc.type = cfg.type || 'sine';
  if (cfg.freq2) { osc.frequency.setValueAtTime(cfg.freq, t); osc.frequency.linearRampToValueAtTime(cfg.freq2, t + (cfg.dur || 0.12)); }
  else { osc.frequency.setValueAtTime(cfg.freq, t); }
  gain.gain.setValueAtTime(cfg.vol || 0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + (cfg.dur || 0.12));
  osc.start(t); osc.stop(t + (cfg.dur || 0.12) + 0.01);
}

const sounds: Record<string, () => void> = {
  nav: () => _play({ type: 'sine', freq: 440, freq2: 520, dur: .1, vol: .12 }),
  start: () => { _play({ type: 'sine', freq: 330, freq2: 440, dur: .12, vol: .15 }); setTimeout(() => _play({ type: 'sine', freq: 550, freq2: 660, dur: .14, vol: .13 }), 90); },
  tab: () => _play({ type: 'triangle', freq: 600, freq2: 640, dur: .08, vol: .1 }),
  choose: () => { _play({ type: 'sine', freq: 280, freq2: 380, dur: .14, vol: .14 }); setTimeout(() => _play({ type: 'sine', freq: 440, dur: .1, vol: .1 }), 100); },
  result_good: () => { [0, 120, 240].forEach((d, i) => setTimeout(() => _play({ type: 'sine', freq: [440, 554, 659][i], dur: .18, vol: .15 }), d)); },
  result_bad: () => { _play({ type: 'sawtooth', freq: 220, freq2: 180, dur: .22, vol: .1 }); setTimeout(() => _play({ type: 'sawtooth', freq: 180, freq2: 140, dur: .3, vol: .08 }), 150); },
  danger: () => _play({ type: 'sawtooth', freq: 160, freq2: 140, dur: .18, vol: .12 }),
};

export function snd(name: keyof typeof sounds) {
  if (isMuted()) return;
  try { sounds[name]?.(); } catch { /* AudioContext unavailable (e.g. Safari private mode) */ }
}
