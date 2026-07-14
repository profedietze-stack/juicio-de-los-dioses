import type { AutosaveData, DilemmaOption, HistoryRecord, PhilosophyKey, ResultSnapshot } from '../types';
import { ALL_PHILO_KEYS } from './results';
import { achievements } from '../data/achievements';

function lsSet(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ }
}

// ── SCHEMA VERSIONING ───────────────────────────────────
// Every key stores { version, data } instead of the raw value. If the stored
// version doesn't match what this build expects, the data is treated as
// absent (same fallback as corrupted data) rather than guessed at — there is
// no migrate() step yet because no format change has ever shipped. When one
// does, add the concrete migration for that key at that point.
function parseVersioned<T>(parsed: unknown, expectedVersion: number, isValid: (v: unknown) => v is T): T | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const wrapper = parsed as Record<string, unknown>;
  if (wrapper.version !== expectedVersion) return null;
  return isValid(wrapper.data) ? wrapper.data : null;
}

function readVersioned<T>(key: string, expectedVersion: number, isValid: (v: unknown) => v is T): T | null {
  let parsed: unknown;
  try { parsed = JSON.parse(localStorage.getItem(key) || 'null'); }
  catch { return null; }
  return parseVersioned(parsed, expectedVersion, isValid);
}

function writeVersioned(key: string, version: number, data: unknown) {
  lsSet(key, { version, data });
}

const SAVE_VERSION = 1;
const HISTORY_VERSION = 1;
const SEEN_VERSION = 1;
const ACHIEVEMENTS_VERSION = 1;
const SNAPSHOTS_VERSION = 1;
const PLAY_COUNTS_VERSION = 1;

function isUnknownArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
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
    && Array.isArray(d.eventIds) && d.eventIds.every(id => typeof id === 'number')
    // Optional: absent on saves written before engagement tracking existed.
    && (d.decisionTimes === undefined || (Array.isArray(d.decisionTimes) && d.decisionTimes.every(t => typeof t === 'number')))
    && (d.ateneoConsultCounts === undefined || (Array.isArray(d.ateneoConsultCounts) && d.ateneoConsultCounts.every(c => typeof c === 'number')));
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

function isValidDeliberatedEntry(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const e = v as Record<string, unknown>;
  return typeof e.title === 'string'
    && isPhilosophyKey(e.philosophy)
    && typeof e.optionText === 'string'
    && typeof e.seconds === 'number'
    && typeof e.ateneoCount === 'number';
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
    && typeof s.decisions === 'number'
    // Optional: absent on snapshots saved before the engagement index existed.
    && (s.engagementIndex === undefined || typeof s.engagementIndex === 'number')
    && (s.engagementLabel === undefined || typeof s.engagementLabel === 'string')
    && (s.topDeliberated === undefined || (Array.isArray(s.topDeliberated) && s.topDeliberated.every(isValidDeliberatedEntry)));
}

// ── HISTORY ─────────────────────────────────────────────
export function saveHistory(record: HistoryRecord) {
  const h = getHistory();
  h.unshift(record);
  if (h.length > 20) h.length = 20; // keep up to 20 games for stats
  writeVersioned('gameHistory', HISTORY_VERSION, h);
}

export function getHistory(): HistoryRecord[] {
  const raw = readVersioned('gameHistory', HISTORY_VERSION, isUnknownArray) ?? [];
  const clean = raw.filter(isValidHistoryRecord);
  if (clean.length !== raw.length) writeVersioned('gameHistory', HISTORY_VERSION, clean);
  return clean;
}

// ── AUTOSAVE ────────────────────────────────────────────
const SAVE_KEY = 'gameInProgress';

export function autosave(data: AutosaveData) {
  writeVersioned(SAVE_KEY, SAVE_VERSION, data);
}

export function loadSavedGame(): AutosaveData | null {
  const d = readVersioned(SAVE_KEY, SAVE_VERSION, isValidAutosaveData);
  if (!d) { clearSavedGame(); return null; }
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
  const v = readVersioned(SEEN_KEY, SEEN_VERSION, isPlainRecord) ?? {};
  const clean: Record<number, number> = {};
  let changed = false;
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === 'number' && Number.isFinite(Number(k))) clean[Number(k)] = val;
    else changed = true;
  }
  if (changed) saveSeenMap(clean);
  return clean;
}

export function saveSeenMap(map: Record<number, number>) {
  writeVersioned(SEEN_KEY, SEEN_VERSION, map);
}

export function getTotalGamesPlayed(): number {
  return getHistory().length;
}

// ── PLAY COUNTS (how many times each dilemma id has ever been drawn) ────
const PLAY_COUNTS_KEY = 'dilemaPlayCounts';

export function getPlayCounts(): Record<number, number> {
  const v = readVersioned(PLAY_COUNTS_KEY, PLAY_COUNTS_VERSION, isPlainRecord) ?? {};
  const clean: Record<number, number> = {};
  let changed = false;
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === 'number' && Number.isFinite(Number(k))) clean[Number(k)] = val;
    else changed = true;
  }
  if (changed) savePlayCounts(clean);
  return clean;
}

export function savePlayCounts(counts: Record<number, number>) {
  writeVersioned(PLAY_COUNTS_KEY, PLAY_COUNTS_VERSION, counts);
}

// ── ACHIEVEMENTS (unlocked ids, cumulative across all games) ────
export function getUnlockedAchievements(): string[] {
  const raw = readVersioned('achievements', ACHIEVEMENTS_VERSION, isUnknownArray) ?? [];
  const validIds = new Set(achievements.map(a => a.id));
  const clean = raw.filter((id): id is string => typeof id === 'string' && validIds.has(id));
  if (clean.length !== raw.length) writeVersioned('achievements', ACHIEVEMENTS_VERSION, clean);
  return clean;
}

export function saveUnlockedAchievements(ids: string[]) {
  const prev = getUnlockedAchievements();
  writeVersioned('achievements', ACHIEVEMENTS_VERSION, [...new Set([...prev, ...ids])]);
}

// ── SAVED SNAPSHOTS (philosophical reports) ──────────────
export function saveSnapshot(data: ResultSnapshot) {
  const snaps = loadSavedResults();
  snaps.unshift(data);
  if (snaps.length > 5) snaps.length = 5;
  writeVersioned('savedSnapshots', SNAPSHOTS_VERSION, snaps);
}

export function loadSavedResults(): ResultSnapshot[] {
  const raw = readVersioned('savedSnapshots', SNAPSHOTS_VERSION, isUnknownArray) ?? [];
  const clean = raw.filter(isValidSnapshot);
  if (clean.length !== raw.length) writeVersioned('savedSnapshots', SNAPSHOTS_VERSION, clean);
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

// ── EXPORT / IMPORT PROGRESS ─────────────────────────────
export interface ExportedProgress {
  exportedAt: string;
  keys: Partial<Record<'gameInProgress' | 'gameHistory' | 'dilemaSeen' | 'achievements' | 'savedSnapshots', unknown>>;
}

const EXPORT_KEYS = ['gameInProgress', 'gameHistory', 'dilemaSeen', 'achievements', 'savedSnapshots'] as const;

export function exportProgress(): ExportedProgress {
  const keys: ExportedProgress['keys'] = {};
  for (const k of EXPORT_KEYS) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    try { keys[k] = JSON.parse(raw); } catch { /* unreadable entry, skip it */ }
  }
  return { exportedAt: new Date().toISOString(), keys };
}

// Validates every key before writing anything: a corrupted or hand-edited
// import file must never wipe the player's existing progress for nothing.
export function importProgress(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  if (!p.keys || typeof p.keys !== 'object') return false;
  const keys = p.keys as Record<string, unknown>;

  const toWrite: Record<string, unknown> = {};

  if (parseVersioned(keys.gameInProgress, SAVE_VERSION, isValidAutosaveData) !== null) {
    toWrite.gameInProgress = keys.gameInProgress;
  }

  const history = parseVersioned(keys.gameHistory, HISTORY_VERSION, isUnknownArray);
  if (history) {
    const clean = history.filter(isValidHistoryRecord);
    if (clean.length) toWrite.gameHistory = { version: HISTORY_VERSION, data: clean };
  }

  const seen = parseVersioned(keys.dilemaSeen, SEEN_VERSION, isPlainRecord);
  if (seen) {
    const clean: Record<number, number> = {};
    for (const [k, val] of Object.entries(seen)) if (typeof val === 'number') clean[Number(k)] = val;
    if (Object.keys(clean).length) toWrite.dilemaSeen = { version: SEEN_VERSION, data: clean };
  }

  const ach = parseVersioned(keys.achievements, ACHIEVEMENTS_VERSION, isUnknownArray);
  if (ach) {
    const validIds = new Set(achievements.map(a => a.id));
    const clean = ach.filter((id): id is string => typeof id === 'string' && validIds.has(id));
    if (clean.length) toWrite.achievements = { version: ACHIEVEMENTS_VERSION, data: clean };
  }

  const snaps = parseVersioned(keys.savedSnapshots, SNAPSHOTS_VERSION, isUnknownArray);
  if (snaps) {
    const clean = snaps.filter(isValidSnapshot);
    if (clean.length) toWrite.savedSnapshots = { version: SNAPSHOTS_VERSION, data: clean };
  }

  if (!Object.keys(toWrite).length) return false;

  clearProgress();
  for (const [key, val] of Object.entries(toWrite)) lsSet(key, val);
  return true;
}
