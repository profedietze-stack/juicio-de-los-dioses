import type { Dilemma } from '../types';
import { eventPool } from '../data/dilemmas';
import { finale } from '../data/dilemmas/finale';
import { getSeenMap, saveSeenMap, getTotalGamesPlayed, getPlayCounts, savePlayCounts } from './persistence';

const FINALE_ID = 60;

// Priority: never-seen first (score = Infinity), then least-recently-seen
// (higher "games ago" = higher priority), with random tiebreak within a
// score bucket.
export function buildWeightedPool(excludeId?: number): Dilemma[] {
  const seen = getSeenMap();
  const gamesPlayed = getTotalGamesPlayed();
  const eligible = eventPool.filter(e => e.id !== excludeId);

  const scored = eligible.map(e => {
    const lastSeen = seen[e.id];
    const score = lastSeen === undefined ? Infinity : (gamesPlayed - lastSeen);
    return { e, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Math.random() - 0.5;
  });

  return scored.map(s => s.e);
}

export function recordSeenDilemas(sessionEvents: Dilemma[]) {
  const seen = getSeenMap();
  const gameNum = getTotalGamesPlayed();
  const counts = getPlayCounts();
  sessionEvents.forEach(e => {
    if (e.id !== FINALE_ID) {
      seen[e.id] = gameNum;
      counts[e.id] = (counts[e.id] || 0) + 1;
    }
  });
  saveSeenMap(seen);
  savePlayCounts(counts);
}

export const FULL_SESSION_LENGTH = 39;
export const SHORT_SESSION_LENGTH = 14;

// "Comenzar el Juicio" — always starts a fresh session: `count` highest-
// priority dilemmas (shuffled) plus the finale appended last. Defaults to
// the full 39-dilemma session; the short mode passes SHORT_SESSION_LENGTH.
export function buildNewSession(count: number = FULL_SESSION_LENGTH): Dilemma[] {
  const weighted = buildWeightedPool(FINALE_ID);
  const pool = weighted.slice(0, count);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return [...shuffled, finale];
}
