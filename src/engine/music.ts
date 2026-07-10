import { AC } from './audioContext';
import { isMuted, getMusicVolume } from './audioPrefs';

const BASE_GAIN = 0.05;

// Soft ambient pad: a few low-gain oscillators on a sustained chord, with a
// slow LFO modulating the master gain for a gentle "breathing" chill-out feel.
const CHORD_FREQS = [130.81, 164.81, 196.0, 246.94]; // C3, E3, G3, B3

let voices: OscillatorNode[] = [];
let masterGain: GainNode | null = null;
let lfo: OscillatorNode | null = null;

export function startMusic() {
  if (!AC || isMuted() || voices.length) return;

  masterGain = AC.createGain();
  masterGain.gain.setValueAtTime(BASE_GAIN * getMusicVolume(), AC.currentTime);
  masterGain.connect(AC.destination);

  lfo = AC.createOscillator();
  const lfoGain = AC.createGain();
  lfo.frequency.setValueAtTime(0.08, AC.currentTime);
  lfoGain.gain.setValueAtTime(0.02, AC.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start();

  voices = CHORD_FREQS.map(freq => {
    const osc = AC!.createOscillator();
    const voiceGain = AC!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, AC!.currentTime);
    voiceGain.gain.setValueAtTime(0.04, AC!.currentTime);
    osc.connect(voiceGain);
    voiceGain.connect(masterGain!);
    osc.start();
    return osc;
  });
}

export function stopMusic() {
  voices.forEach(osc => { try { osc.stop(); } catch { /* already stopped */ } });
  voices = [];
  if (lfo) { try { lfo.stop(); } catch { /* already stopped */ } }
  lfo = null;
  masterGain = null;
}

export function setLiveMusicVolume(v: number) {
  if (masterGain && AC) masterGain.gain.setValueAtTime(BASE_GAIN * v, AC.currentTime);
}
