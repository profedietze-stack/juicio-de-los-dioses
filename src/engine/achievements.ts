import type { DilemmaOption } from '../types';

export interface AchievementContext {
  score: number;
  time: number;
  decisions: DilemmaOption[];
}

// Mirrors checkAchievements(score, time) from the original: evaluates all 12
// conditions and returns the ids that are currently true for this playthrough.
export function checkAchievements({ score, time, decisions }: AchievementContext): string[] {
  const ph = new Set(decisions.map(x => x.philosophy));
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
  };
  return Object.keys(c).filter(k => c[k]);
}
