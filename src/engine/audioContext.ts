export const AC: AudioContext | null = (() => {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)(); }
  catch { return null; }
})();
