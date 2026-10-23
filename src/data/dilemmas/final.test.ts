import { describe, it, expect } from 'vitest';
import { eventPool } from './index';

// El final pregunta si la humanidad merece existir. Un banco donde casi toda
// opcion empieza con «Si» le dice al alumno cual es la respuesta esperada: condenar
// tiene que ser una postura con fundamento, no solo la del que se encoge de hombros.
describe('el dilema final', () => {
  const final = eventPool.find(d => d.id === 60)!;
  const empieza = (re: RegExp) => final.options.filter(o => re.test(o.text));

  it('incluye varias posturas de condena, cada una con su argumento', () => {
    const noes = empieza(/^No\b/);
    expect(noes.length).toBeGreaterThanOrEqual(3);
    for (const o of noes) expect(o.text.length).toBeGreaterThan(80);
  });

  it('las condenas vienen de corrientes distintas', () => {
    const corrientes = new Set(empieza(/^No\b/).map(o => o.philosophy));
    expect(corrientes.size).toBeGreaterThanOrEqual(3);
  });

  it('sigue habiendo una opcion por corriente', () => {
    expect(new Set(final.options.map(o => o.philosophy)).size).toBe(final.options.length);
  });
});
