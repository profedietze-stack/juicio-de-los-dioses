import { describe, it, expect } from 'vitest';
import { computeResults } from './results';
import { specialEndings, endings } from '../data/endings';
import type { DilemmaOption, TribunalState } from '../types';
import { tribunalVacio } from './tribunal';

function conSombra(n: number): TribunalState {
  const t = tribunalVacio();
  t.vices.Ind = n;
  return t;
}

function decisions(philosophy: DilemmaOption['philosophy'], n = 40): DilemmaOption[] {
  return Array.from({ length: n }, () => ({ text: 'x', impact: 1, philosophy }));
}

describe('computeResults special endings', () => {
  it('returns pureAscension when La Sombra is empty and only one philosophy was used', () => {
    const r = computeResults(decisions('virtuosismo'), tribunalVacio(), 1000);
    expect(r.ending).toBe(specialEndings.pureAscension);
    expect(r.endingKey).toBe('deification');
  });

  it('returns pureVoid when La Sombra passes the condemnation line and only one philosophy was used', () => {
    const r = computeResults(decisions('nihilismo'), conSombra(70), 1000);
    expect(r.ending).toBe(specialEndings.pureVoid);
    expect(r.endingKey).toBe('extinction');
  });

  it('falls back to the normal score-bucket ending for a typical playthrough', () => {
    const mixed: DilemmaOption[] = [
      { text: 'x', impact: 1, philosophy: 'utilitarismo' },
      { text: 'x', impact: 1, philosophy: 'deontologia' },
      { text: 'x', impact: 1, philosophy: 'virtuosismo' },
    ];
    const r = computeResults(mixed, conSombra(4), 1000);
    expect(r.ending).toBe(endings.enlightenment);
  });
});

describe('Mediador Universal es un final raro', () => {
  const claves = ['utilitarismo', 'deontologia', 'nihilismo', 'virtuosismo', 'existencialismo', 'estoicismo', 'pragmatismo', 'contractualismo', 'feminismo', 'budismo'] as const;
  const reparto = (n: number, pesos: number[]): DilemmaOption[] =>
    claves.flatMap((philosophy, i) => Array.from({ length: pesos[i] }, () => ({ text: 'x', impact: 1, philosophy }))).slice(0, n);

  it('ocho corrientes ya no alcanzan: el final lo decide La Sombra', () => {
    const ocho = [...reparto(40, [5, 5, 5, 5, 5, 5, 5, 5, 0, 0]), ...decisions('utilitarismo', 0)];
    const r = computeResults(ocho, conSombra(70), 1000);
    expect(r.ending).not.toBe(specialEndings.universalMediator);
    expect(r.endingKey).toBe('extinction');
  });

  it('diez corrientes parejas en una partida larga si', () => {
    const r = computeResults(reparto(40, [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]), conSombra(70), 1000);
    expect(r.ending).toBe(specialEndings.universalMediator);
  });

  it('una partida corta nunca lo logra', () => {
    const r = computeResults(reparto(15, [2, 2, 2, 2, 2, 1, 1, 1, 1, 1]), tribunalVacio(), 1000);
    expect(r.ending).not.toBe(specialEndings.universalMediator);
  });
});
