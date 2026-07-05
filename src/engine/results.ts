import type { DilemmaOption, PhilosophyKey, Ending } from '../types';
import { endings } from '../data/endings';

export const ALL_PHILO_KEYS: PhilosophyKey[] = [
  'utilitarismo', 'deontologia', 'nihilismo', 'virtuosismo', 'existencialismo',
  'estoicismo', 'pragmatismo', 'contractualismo', 'feminismo', 'budismo',
];

export interface ComputedResult {
  score: number;
  totalTime: number;
  totalDecisions: number;
  counts: Record<PhilosophyKey, number>;
  pcts: Record<PhilosophyKey, number>;
  diversity: number;
  ranked: PhilosophyKey[];
  dom: PhilosophyKey;
  sec: PhilosophyKey;
  thr: PhilosophyKey;
  ending: Ending;
  endingKey: keyof typeof endings;
}

// Mirrors finishGame()'s scoring/aggregation logic from the original.
export function computeResults(decisions: DilemmaOption[], balance: number, totalTime: number): ComputedResult {
  const score = balance;
  const n = decisions.length || 1;
  const counts = Object.fromEntries(ALL_PHILO_KEYS.map(k => [k, 0])) as Record<PhilosophyKey, number>;
  decisions.forEach(d => { if (counts[d.philosophy] !== undefined) counts[d.philosophy]++; });
  const pcts = Object.fromEntries(ALL_PHILO_KEYS.map(k => [k, Math.round(counts[k] / n * 100)])) as Record<PhilosophyKey, number>;
  const diversity = ALL_PHILO_KEYS.filter(k => pcts[k] > 0).length;

  const sortedKeys = [...ALL_PHILO_KEYS].sort((a, b) => (pcts[b] || 0) - (pcts[a] || 0));
  const ranked = sortedKeys.filter(k => pcts[k] > 0);
  const [dom, sec, thr] = ranked;

  let endingKey: keyof typeof endings;
  if (score <= 20) endingKey = 'extinction';
  else if (score <= 50) endingKey = 'purgatory';
  else if (score <= 80) endingKey = 'enlightenment';
  else endingKey = 'deification';

  return {
    score, totalTime, totalDecisions: decisions.length,
    counts, pcts, diversity, ranked, dom, sec, thr,
    ending: endings[endingKey], endingKey,
  };
}
