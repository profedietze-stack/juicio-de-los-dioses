type WindowWithWebkitAudio = typeof window & { webkitAudioContext?: typeof AudioContext };

export const AC: AudioContext | null = (() => {
  try {
    const w = window as WindowWithWebkitAudio;
    return new (w.AudioContext || w.webkitAudioContext)!();
  }
  catch { return null; }
})();
