import { describe, it, expect } from 'vitest';
import { computeResults } from './results';
import { specialEndings, endings } from '../data/endings';
import type { DilemmaOption } from '../types';

function decisions(philosophy: DilemmaOption['philosophy'], n = 40): DilemmaOption[] {
  return Array.from({ length: n }, () => ({ text: 'x', impact: 1, philosophy }));
}

describe('computeResults special endings', () => {
  it('returns pureAscension when score is 100 and only one philosophy was used', () => {
    const r = computeResults(decisions('virtuosismo'), 100, 1000);
    expect(r.ending).toBe(specialEndings.pureAscension);
    expect(r.endingKey).toBe('deification');
  });

  it('returns pureVoid when score is 0 and only one philosophy was used', () => {
    const r = computeResults(decisions('nihilismo'), 0, 1000);
    expect(r.ending).toBe(specialEndings.pureVoid);
    expect(r.endingKey).toBe('extinction');
  });

  it('returns universalMediator when 8 or more distinct philosophies were used', () => {
    const mixed: DilemmaOption[] = [
      'utilitarismo', 'deontologia', 'nihilismo', 'virtuosismo', 'existencialismo',
      'estoicismo', 'pragmatismo', 'contractualismo',
    ].map(philosophy => ({ text: 'x', impact: 1, philosophy: philosophy as DilemmaOption['philosophy'] }));
    const r = computeResults(mixed, 50, 1000);
    expect(r.ending).toBe(specialEndings.universalMediator);
  });

  it('falls back to the normal score-bucket ending for a typical playthrough', () => {
    const mixed: DilemmaOption[] = [
      { text: 'x', impact: 1, philosophy: 'utilitarismo' },
      { text: 'x', impact: 1, philosophy: 'deontologia' },
      { text: 'x', impact: 1, philosophy: 'virtuosismo' },
    ];
    const r = computeResults(mixed, 60, 1000);
    expect(r.ending).toBe(endings.enlightenment);
  });
});
