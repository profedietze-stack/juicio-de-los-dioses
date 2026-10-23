import type { DilemmaOption, PhilosophyKey, Ending, TribunalState } from '../types';
import { veredicto, type Veredicto } from './tribunal';
import { endings, specialEndings } from '../data/endings';

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
  // Lo que pesaron las balanzas y La Sombra: define el final y su tono.
  tribunal: TribunalState;
  veredicto: Veredicto;
}

// Mirrors finishGame()'s scoring/aggregation logic from the original.
export function computeResults(decisions: DilemmaOption[], tribunal: TribunalState, totalTime: number): ComputedResult {
  const v = veredicto(tribunal, decisions.length);
  const score = v.score;
  const n = decisions.length || 1;
  const counts = Object.fromEntries(ALL_PHILO_KEYS.map(k => [k, 0])) as Record<PhilosophyKey, number>;
  decisions.forEach(d => { if (counts[d.philosophy] !== undefined) counts[d.philosophy]++; });
  const pcts = Object.fromEntries(ALL_PHILO_KEYS.map(k => [k, Math.round(counts[k] / n * 100)])) as Record<PhilosophyKey, number>;
  const diversity = ALL_PHILO_KEYS.filter(k => pcts[k] > 0).length;

  const sortedKeys = [...ALL_PHILO_KEYS].sort((a, b) => (pcts[b] || 0) - (pcts[a] || 0));
  const ranked = sortedKeys.filter(k => pcts[k] > 0);
  const [dom, sec, thr] = ranked;

  // El final lo decide La Sombra (ver engine/tribunal.ts), no las corrientes.
  const endingKey: keyof typeof endings = v.endingKey;

  // Rare-combo overrides: the philosophy profile itself was extraordinary,
  // not just the final score. endingKey (the score bucket) stays as-is so
  // stats/history grouping is unaffected — only the shown narrative changes.
  let ending: Ending = endings[endingKey];
  if (score === 100 && diversity === 1) ending = specialEndings.pureAscension;
  else if (score === 0 && diversity === 1) ending = specialEndings.pureVoid;
  else if (diversity >= 8) ending = specialEndings.universalMediator;

  return {
    score, totalTime, totalDecisions: decisions.length,
    counts, pcts, diversity, ranked, dom, sec, thr,
    ending, endingKey, tribunal, veredicto: v,
  };
}
