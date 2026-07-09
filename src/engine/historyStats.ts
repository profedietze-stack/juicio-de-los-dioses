import type { HistoryRecord, PhilosophyKey } from '../types';
import { getHistory, getSeenMap, getPlayCounts } from './persistence';
import { ALL_PHILO_KEYS } from './results';
import { eventPool } from '../data/dilemmas';
import { FULL_SESSION_LENGTH } from './poolBuilder';

export interface HistoryStats {
  totalGames: number;
  totalSecs: number;
  avgScore: number;
  avgTime: number;
  bestScore: number;
  worstScore: number;
  avgDiversity: string;
  endingCounts: Record<string, number>;
  topDom: PhilosophyKey | null;
  aggCounts: Record<PhilosophyKey, number>;
  sortedPhilo: PhilosophyKey[];
  totalDecisions: number;
  trend: number[];
  seenCount: number;
  freshCount: number;
  freshPct: number;
  nextGameFresh: number;
  nextGameRecycled: number;
  poolSize: number;
  history: HistoryRecord[];
  mostPlayed: { id: number; title: string; count: number }[];
  leastPlayed: { id: number; title: string; count: number }[];
}

// Eligible dilemmas excluding the finale (whatever the current pool size is).
const POOL_SIZE = eventPool.length - 1;

// Top N philosophies (by percentage) for a single game's HistoryRecord.pcts,
// used to compare how the player's profile shifted across recent games.
export function topPhilosophies(pcts: Partial<Record<PhilosophyKey, number>>, limit = 3): [PhilosophyKey, number][] {
  return (Object.entries(pcts) as [PhilosophyKey, number][])
    .filter(([, pct]) => pct > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

// Mirrors loadHistory()'s aggregate-stats computation from the original.
export function computeHistoryStats(): HistoryStats | null {
  const h = getHistory();
  if (!h.length) return null;

  const totalGames = h.length;
  const totalSecs = h.reduce((a, r) => a + (r.time || 0), 0);
  const avgScore = Math.round(h.reduce((a, r) => a + (r.score || 0), 0) / totalGames);
  const avgTime = Math.round(totalSecs / totalGames);
  const bestScore = Math.max(...h.map(r => r.score || 0));
  const worstScore = Math.min(...h.map(r => r.score || 0));
  const avgDiversity = (h.reduce((a, r) => a + (r.diversity || 0), 0) / totalGames).toFixed(1);

  const endingCounts: Record<string, number> = {};
  h.forEach(r => { const k = r.ending || '—'; endingCounts[k] = (endingCounts[k] || 0) + 1; });

  const domCounts: Partial<Record<PhilosophyKey, number>> = {};
  h.forEach(r => { if (r.dominant) domCounts[r.dominant] = (domCounts[r.dominant] || 0) + 1; });
  const topDomEntry = Object.entries(domCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
  const topDom = (topDomEntry?.[0] as PhilosophyKey) || null;

  const aggCounts = Object.fromEntries(ALL_PHILO_KEYS.map(k => [k, 0])) as Record<PhilosophyKey, number>;
  h.forEach(r => {
    if (r.counts) ALL_PHILO_KEYS.forEach(k => { aggCounts[k] += (r.counts[k] || 0); });
  });
  const totalDecisions = Object.values(aggCounts).reduce((a, b) => a + b, 0) || 1;
  const sortedPhilo = [...ALL_PHILO_KEYS].sort((a, b) => aggCounts[b] - aggCounts[a]);

  const trend = h.slice(0, 5).map(r => r.score || 0);

  const seenMap = getSeenMap();
  const seenCount = Object.keys(seenMap).length;
  const freshCount = POOL_SIZE - seenCount;
  const freshPct = Math.round(freshCount / POOL_SIZE * 100);
  const nextGameFresh = Math.min(FULL_SESSION_LENGTH, freshCount);
  const nextGameRecycled = FULL_SESSION_LENGTH - nextGameFresh;

  // Which dilemmas the player has been drawn into most/least across all
  // games — only counts dilemmas that have actually been played at least
  // once, so a never-seen dilemma doesn't show up as "least played (0)".
  const playCounts = getPlayCounts();
  const played = eventPool
    .filter(d => d.id !== 60 && playCounts[d.id] > 0)
    .map(d => ({ id: d.id, title: d.title, count: playCounts[d.id] }));
  const byCountDesc = [...played].sort((a, b) => b.count - a.count);
  const mostPlayed = byCountDesc.slice(0, 5);
  const leastPlayed = [...byCountDesc].reverse().slice(0, 5);

  return {
    totalGames, totalSecs, avgScore, avgTime, bestScore, worstScore, avgDiversity,
    endingCounts, topDom, aggCounts, sortedPhilo, totalDecisions, trend,
    seenCount, freshCount, freshPct, nextGameFresh, nextGameRecycled, poolSize: POOL_SIZE, history: h,
    mostPlayed, leastPlayed,
  };
}
