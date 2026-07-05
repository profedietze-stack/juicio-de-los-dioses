import { describe, it, expect } from 'vitest';
import { buildSynthesis } from './synthesis';
import type { PhilosophyKey } from '../types';

describe('buildSynthesis', () => {
  it('returns the pluralism text when dominant share is under 22%', () => {
    const ranked: PhilosophyKey[] = ['utilitarismo', 'deontologia', 'nihilismo'];
    const pcts = { utilitarismo: 20, deontologia: 18, nihilismo: 15 };
    const text = buildSynthesis(ranked, pcts);
    expect(text).toContain('excepcional pluralidad');
  });

  it('returns the tension text when spread between top two is <= 8', () => {
    const ranked: PhilosophyKey[] = ['utilitarismo', 'deontologia', 'nihilismo'];
    const pcts = { utilitarismo: 30, deontologia: 25, nihilismo: 10 };
    const text = buildSynthesis(ranked, pcts);
    expect(text).toContain('tensión productiva');
    expect(text).toContain('Utilitarismo');
    expect(text).toContain('Deontología');
  });

  it('returns the dominant-orientation text otherwise, including tertiary mention above 8%', () => {
    const ranked: PhilosophyKey[] = ['virtuosismo', 'estoicismo', 'budismo'];
    const pcts = { virtuosismo: 50, estoicismo: 20, budismo: 10 };
    const text = buildSynthesis(ranked, pcts);
    expect(text).toContain('orientación predominante');
    expect(text).toContain('Virtuosismo');
    expect(text).toContain("presencia relevante del <span");
    expect(text).toContain('Budismo');
  });
});
