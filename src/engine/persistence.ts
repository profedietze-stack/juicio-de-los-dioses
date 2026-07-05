import type { AutosaveData, HistoryRecord, ResultSnapshot } from '../types';

function lsArr<T>(key: string): T[] {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return Array.isArray(v) ? v : []; }
  catch { return []; }
}
function lsSet(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ }
}

// ── HISTORY ─────────────────────────────────────────────
export function saveHistory(record: HistoryRecord) {
  const h = lsArr<HistoryRecord>('gameHistory');
  h.unshift(record);
  if (h.length > 20) h.length = 20; // keep up to 20 games for stats
  lsSet('gameHistory', h);
}

export function getHistory(): HistoryRecord[] {
  return lsArr<HistoryRecord>('gameHistory');
}

// ── AUTOSAVE ────────────────────────────────────────────
const SAVE_KEY = 'gameInProgress';

export function autosave(data: AutosaveData) {
  lsSet(SAVE_KEY, data);
}

export function hasSavedGame(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    return d && Array.isArray(d.decisions) && d.decisions.length > 0
      && Array.isArray(d.eventIds) && d.current < d.eventIds.length;
  } catch { return false; }
}

export function loadSavedGame(): AutosaveData | null {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch { return null; }
}

export function clearSavedGame() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* storage unavailable */ }
}

// ── CLEAR PROGRESS ──────────────────────────────────────
export function clearProgress() {
  try { localStorage.clear(); } catch { /* storage unavailable */ }
}

// ── WEIGHTED POOL SYSTEM ─────────────────────────────────
// Stores {eventId: gameNumber} — tracks when each dilema was last seen.
const SEEN_KEY = 'dilemaSeen';

export function getSeenMap(): Record<number, number> {
  try {
    const v = JSON.parse(localStorage.getItem(SEEN_KEY) || 'null');
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  } catch { return {}; }
}

export function saveSeenMap(map: Record<number, number>) {
  lsSet(SEEN_KEY, map);
}

export function getTotalGamesPlayed(): number {
  return getHistory().length;
}

// ── ACHIEVEMENTS (unlocked ids, cumulative across all games) ────
export function getUnlockedAchievements(): string[] {
  return lsArr<string>('achievements');
}

export function saveUnlockedAchievements(ids: string[]) {
  const prev = getUnlockedAchievements();
  lsSet('achievements', [...new Set([...prev, ...ids])]);
}

// ── SAVED SNAPSHOTS (philosophical reports) ──────────────
export function saveSnapshot(data: ResultSnapshot) {
  const snaps = lsArr<ResultSnapshot>('savedSnapshots');
  snaps.unshift(data);
  if (snaps.length > 5) snaps.length = 5;
  lsSet('savedSnapshots', snaps);
}

export function loadSavedResults(): ResultSnapshot[] {
  return lsArr<ResultSnapshot>('savedSnapshots');
}
