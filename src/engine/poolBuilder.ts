import type { Dilemma } from '../types';
import { eventPool } from '../data/dilemmas';
import { finale } from '../data/dilemmas/finale';
import { getSeenMap, saveSeenMap, getTotalGamesPlayed } from './persistence';

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
  sessionEvents.forEach(e => {
    if (e.id !== FINALE_ID) seen[e.id] = gameNum;
  });
  saveSeenMap(seen);
}

// "Comenzar el Juicio" — always starts a fresh session: 39 highest-priority
// dilemmas (shuffled) plus the finale appended last.
export function buildNewSession(): Dilemma[] {
  const weighted = buildWeightedPool(FINALE_ID);
  const pool39 = weighted.slice(0, 39);
  const shuffled = [...pool39].sort(() => Math.random() - 0.5);
  return [...shuffled, finale];
}
