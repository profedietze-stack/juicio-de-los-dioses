import { isMuted, getMusicVolume } from './audioPrefs';

// jsdom (test environment) defines Audio/HTMLMediaElement but its play()/
// pause() just log a noisy "not implemented" jsdomError instead of throwing,
// and its volume setter enforces the 0..1 range strictly. Skip all real
// playback/volume calls under jsdom — tests only care the state logic
// doesn't throw, there's no real audio to hear anyway.
const CAN_PLAY_AUDIO = typeof navigator === 'undefined' || !navigator.userAgent.includes('jsdom');

// Real royalty-free tracks (Pixabay, free for use), played as one continuous
// session playlist independent of which screen is showing: the calm menu
// track opens every session, and once it ends the three game tracks shuffle
// indefinitely (never repeating back-to-back) for the rest of the reading
// session. Music no longer restarts or swaps on menu<->game navigation —
// there's nothing to interrupt, so there's nothing to get out of sync.
//
// Everything plays through a *single* shared <audio> element, advancing only
// on the browser's `ended` event (the one signal every browser fires
// reliably for a finite audio file). A monotonically increasing `generation`
// token guards every async callback (fade ticks) so a stop supersedes any
// fade still in flight instead of racing with it.

// import.meta.env.BASE_URL (Vite's configured `base`, e.g. "/repo-name/")
// rather than root-absolute paths — this file is served from a GitHub Pages
// project subpath, and a literal "/audio/..." string is never rewritten by
// Vite the way url()/import references are, so it would 404 there.
const BASE = import.meta.env.BASE_URL;
const OPENING_TRACK = `${BASE}audio/menu-reflection.mp3`;
const SHUFFLE_TRACKS = [
  `${BASE}audio/game-calm-sad.mp3`,
  `${BASE}audio/game-longing.mp3`,
  `${BASE}audio/game-depressed.mp3`,
];

const FADE_MS = 700;

let el: HTMLAudioElement | null = null;
let playing = false;
let openingPlayed = false;
let queue: string[] = [];
let lastPlayed: string | null = null;
let generation = 0;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;
let wantsPlaying = false;
let unlockAttached = false;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// The opening track plays once per (re)start; after that, draws from a
// shuffled queue of the game tracks, refilling and avoiding an immediate
// repeat of whatever just played when the queue wraps around.
function nextTrack(): string {
  if (!openingPlayed) {
    openingPlayed = true;
    return OPENING_TRACK;
  }
  if (!queue.length) {
    queue = shuffle(SHUFFLE_TRACKS);
    if (queue[0] === lastPlayed) {
      const j = 1 + Math.floor(Math.random() * (queue.length - 1));
      [queue[0], queue[j]] = [queue[j], queue[0]];
    }
  }
  const t = queue.shift()!;
  lastPlayed = t;
  return t;
}

function ensureEl(): HTMLAudioElement {
  if (!el) {
    el = new Audio();
    el.preload = 'auto';
    el.loop = false;
    el.addEventListener('ended', onEnded);
  }
  return el;
}

function onEnded() {
  if (!playing) return;
  playTrack(nextTrack(), generation);
}

function safePlay() {
  if (!CAN_PLAY_AUDIO || !el) return;
  try { el.play()?.catch(() => { /* blocked until a user gesture; the unlock listener retries */ }); }
  catch { /* unsupported environment */ }
}

// Browsers may block the very first play() call if it isn't tied closely
// enough to a user gesture (e.g. it fires from a React effect a tick after
// the click that triggered it). Rather than fail silently forever, retry on
// the next real interaction anywhere on the page.
function attachUnlockListener() {
  if (unlockAttached || typeof document === 'undefined') return;
  unlockAttached = true;
  const tryResume = () => { if (wantsPlaying && el?.paused) safePlay(); };
  document.addEventListener('pointerdown', tryResume);
  document.addEventListener('keydown', tryResume);
}

// Ticks via setTimeout rather than requestAnimationFrame: rAF callbacks are
// paused by the browser while a tab is backgrounded/not being composited —
// exactly the state a long reading session is likely to be in — which would
// otherwise strand the fade forever and, with it, the swap() that starts the
// next track. setTimeout still fires (if throttled) even in the background.
const FADE_TICK_MS = 40;

function fadeTo(target: number, gen: number, onDone?: () => void) {
  if (!CAN_PLAY_AUDIO || !el) { onDone?.(); return; }
  if (fadeTimer) clearTimeout(fadeTimer);
  const from = el.volume;
  const start = Date.now();
  const step = () => {
    if (gen !== generation || !el) return;
    const p = Math.min(1, (Date.now() - start) / FADE_MS);
    el.volume = from + (target - from) * p;
    if (p < 1) { fadeTimer = setTimeout(step, FADE_TICK_MS); return; }
    fadeTimer = null;
    onDone?.();
  };
  fadeTimer = setTimeout(step, FADE_TICK_MS);
}

// Swaps to a new track on the shared element, fading the outgoing audio down
// first (if anything is playing) then fading the new track in. Never two
// elements playing at once — there is only ever one.
function playTrack(src: string, gen: number) {
  const a = ensureEl();
  const swap = () => {
    if (gen !== generation) return;
    a.src = src;
    a.currentTime = 0;
    a.volume = 0;
    wantsPlaying = true;
    safePlay();
    fadeTo(getMusicVolume(), gen);
  };
  if (CAN_PLAY_AUDIO && a.src && !a.paused) fadeTo(0, gen, swap);
  else swap();
}

// Starts (or resumes) the session playlist. Idempotent while already
// playing, so calling this on every screen change is cheap and harmless —
// music is no longer tied to which screen is showing.
export function startMusic() {
  if (isMuted()) return;
  if (playing && el && wantsPlaying && (!CAN_PLAY_AUDIO || !el.paused)) return;

  generation++;
  const gen = generation;
  playing = true;
  attachUnlockListener();
  playTrack(nextTrack(), gen);
}

export function stopMusic() {
  generation++;
  wantsPlaying = false;
  playing = false;
  if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
  if (el && CAN_PLAY_AUDIO) {
    try { el.pause(); } catch { /* unsupported environment */ }
  }
}

export function setLiveMusicVolume(v: number) {
  if (!CAN_PLAY_AUDIO || !el) return;
  el.volume = Math.max(0, Math.min(1, v));
}
