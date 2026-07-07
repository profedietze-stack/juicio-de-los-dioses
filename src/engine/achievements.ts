import type { DilemmaOption } from '../types';

export interface AchievementContext {
  score: number;
  time: number;
  decisions: DilemmaOption[];
  // Dilemma id for each entry in `decisions`, same length and order —
  // lets block-specific achievements know which dilemma a choice belongs to.
  eventIds?: number[];
}

// Mirrors checkAchievements(score, time) from the original: evaluates all 12
// conditions and returns the ids that are currently true for this playthrough.
export function checkAchievements({ score, time, decisions, eventIds = [] }: AchievementContext): string[] {
  const ph = new Set(decisions.map(x => x.philosophy));
  const byId = new Map(eventIds.map((id, i) => [id, decisions[i]]));

  const opt81 = byId.get(81);
  const opt82 = byId.get(82);
  const opt84 = byId.get(84);
  const opt85 = byId.get(85);

  const c: Record<string, boolean> = {
    defensor: score > 75,
    tirano: score < 25,
    equilibrio: score >= 45 && score <= 55,
    rapido: time < 900,
    reflexivo: time > 3600,
    etico: decisions.every(x => x.philosophy === 'virtuosismo'),
    pragmatico: decisions.every(x => x.philosophy === 'utilitarismo'),
    rebelde: decisions.every(x => x.philosophy === 'nihilismo'),
    consistente: ph.size <= 1,
    cambio: ph.size >= 7,
    ascendido: score === 100,
    extincion: score === 0,
    'guardian-digital': !!opt81 && !!opt82 && opt81.philosophy !== 'utilitarismo' && opt82.philosophy !== 'utilitarismo',
    'voz-del-rio': opt84?.philosophy === 'feminismo',
    'mano-que-toca': opt85?.philosophy === 'feminismo',
  };
  return Object.keys(c).filter(k => c[k]);
}
