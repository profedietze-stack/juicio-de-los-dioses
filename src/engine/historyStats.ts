import type { HistoryRecord, PhilosophyKey } from '../types';
import { getHistory, getSeenMap } from './persistence';
import { ALL_PHILO_KEYS } from './results';

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
  history: HistoryRecord[];
}

const POOL_SIZE = 79; // eligible dilemmas (excl. finale id=60)

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
  const nextGameFresh = Math.min(39, freshCount);
  const nextGameRecycled = 39 - nextGameFresh;

  return {
    totalGames, totalSecs, avgScore, avgTime, bestScore, worstScore, avgDiversity,
    endingCounts, topDom, aggCounts, sortedPhilo, totalDecisions, trend,
    seenCount, freshCount, freshPct, nextGameFresh, nextGameRecycled, history: h,
  };
}
