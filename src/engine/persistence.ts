import type { AutosaveData, DilemmaOption, HistoryRecord, PhilosophyKey, ResultSnapshot } from '../types';
import { ALL_PHILO_KEYS } from './results';
import { achievements } from '../data/achievements';

function lsArr<T>(key: string): T[] {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return Array.isArray(v) ? v : []; }
  catch { return []; }
}
function lsSet(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ }
}

// ── VALIDATION GUARDS ───────────────────────────────────
// Every value read back from localStorage may have been written by an older
// version of the game, corrupted by hand-editing, or truncated by a full
// quota. These guards check shape/type before the rest of the app ever sees
// the data; anything that fails validation is silently dropped.

function isPhilosophyKey(v: unknown): v is PhilosophyKey {
  return typeof v === 'string' && (ALL_PHILO_KEYS as string[]).includes(v);
}

function isValidDilemmaOption(v: unknown): v is DilemmaOption {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.text === 'string' && typeof o.impact === 'number' && isPhilosophyKey(o.philosophy);
}

export function isValidAutosaveData(v: unknown): v is AutosaveData {
  if (!v || typeof v !== 'object') return false;
  const d = v as Record<string, unknown>;
  return typeof d.current === 'number'
    && typeof d.balance === 'number'
    && typeof d.startTime === 'number'
    && typeof d.elapsed === 'number'
    && Array.isArray(d.decisions) && d.decisions.every(isValidDilemmaOption)
    && Array.isArray(d.unlocked) && d.unlocked.every(u => typeof u === 'string')
    && Array.isArray(d.eventIds) && d.eventIds.every(id => typeof id === 'number');
}

export function isValidHistoryRecord(v: unknown): v is HistoryRecord {
  if (!v || typeof v !== 'object') return false;
  const r = v as Record<string, unknown>;
  return typeof r.score === 'number'
    && typeof r.time === 'number'
    && typeof r.ending === 'string'
    && typeof r.endingKey === 'string'
    && isPhilosophyKey(r.dominant)
    && typeof r.pcts === 'object' && r.pcts !== null
    && typeof r.counts === 'object' && r.counts !== null
    && typeof r.diversity === 'number'
    && typeof r.date === 'string'
    && typeof r.dateISO === 'string';
}

export function isValidSnapshot(v: unknown): v is ResultSnapshot {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return typeof s.id === 'string'
    && typeof s.date === 'string'
    && typeof s.score === 'number'
    && typeof s.time === 'number'
    && typeof s.ending === 'string'
    && typeof s.endingIcon === 'string'
    && isPhilosophyKey(s.dominant)
    && typeof s.domLabel === 'string'
    && isPhilosophyKey(s.sec)
    && typeof s.secLabel === 'string'
    && isPhilosophyKey(s.thr)
    && typeof s.thrLabel === 'string'
    && typeof s.pcts === 'object' && s.pcts !== null
    && Array.isArray(s.ranked) && s.ranked.every(isPhilosophyKey)
    && typeof s.diversity === 'number'
    && typeof s.narrative === 'string'
    && typeof s.decisions === 'number';
}

// ── HISTORY ─────────────────────────────────────────────
export function saveHistory(record: HistoryRecord) {
  const h = getHistory();
  h.unshift(record);
  if (h.length > 20) h.length = 20; // keep up to 20 games for stats
  lsSet('gameHistory', h);
}

export function getHistory(): HistoryRecord[] {
  const raw = lsArr<unknown>('gameHistory');
  const clean = raw.filter(isValidHistoryRecord);
  if (clean.length !== raw.length) lsSet('gameHistory', clean);
  return clean;
}

// ── AUTOSAVE ────────────────────────────────────────────
const SAVE_KEY = 'gameInProgress';

export function autosave(data: AutosaveData) {
  lsSet(SAVE_KEY, data);
}

export function loadSavedGame(): AutosaveData | null {
  let d: unknown;
  try { d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); }
  catch { clearSavedGame(); return null; }
  if (!isValidAutosaveData(d)) { clearSavedGame(); return null; }
  return d;
}

export function hasSavedGame(): boolean {
  const d = loadSavedGame();
  return d !== null && d.decisions.length > 0 && d.current < d.eventIds.length;
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
  let v: unknown;
  try { v = JSON.parse(localStorage.getItem(SEEN_KEY) || 'null'); }
  catch { return {}; }
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const clean: Record<number, number> = {};
  let changed = false;
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === 'number' && Number.isFinite(Number(k))) clean[Number(k)] = val;
    else changed = true;
  }
  if (changed) saveSeenMap(clean);
  return clean;
}

export function saveSeenMap(map: Record<number, number>) {
  lsSet(SEEN_KEY, map);
}

export function getTotalGamesPlayed(): number {
  return getHistory().length;
}

// ── ACHIEVEMENTS (unlocked ids, cumulative across all games) ────
export function getUnlockedAchievements(): string[] {
  const raw = lsArr<unknown>('achievements');
  const validIds = new Set(achievements.map(a => a.id));
  const clean = raw.filter((id): id is string => typeof id === 'string' && validIds.has(id));
  if (clean.length !== raw.length) lsSet('achievements', clean);
  return clean;
}

export function saveUnlockedAchievements(ids: string[]) {
  const prev = getUnlockedAchievements();
  lsSet('achievements', [...new Set([...prev, ...ids])]);
}

// ── SAVED SNAPSHOTS (philosophical reports) ──────────────
export function saveSnapshot(data: ResultSnapshot) {
  const snaps = loadSavedResults();
  snaps.unshift(data);
  if (snaps.length > 5) snaps.length = 5;
  lsSet('savedSnapshots', snaps);
}

export function loadSavedResults(): ResultSnapshot[] {
  const raw = lsArr<unknown>('savedSnapshots');
  const clean = raw.filter(isValidSnapshot);
  if (clean.length !== raw.length) lsSet('savedSnapshots', clean);
  return clean;
}

// ── STORAGE AVAILABILITY ─────────────────────────────────
export function isStorageAvailable(): boolean {
  try {
    const k = '__storage_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch { return false; }
}
