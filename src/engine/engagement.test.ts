import { describe, it, expect } from 'vitest';
import { computeEngagement } from './engagement';
import type { Dilemma, DilemmaOption, PhilosophyKey } from '../types';

function opt(philosophy: PhilosophyKey, text = 'x'): DilemmaOption {
  return { text, impact: 0, philosophy };
}

// Los ids 1..n existen en el banco del Ateneo, con comentario de los diez filosofos.
function events(n: number): Dilemma[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1, title: `Dilema ${i + 1}`, quote: '', description: '', options: [],
  }));
}


describe('computeEngagement: evidencia, no nota', () => {
  it('no devuelve un indice unico ni un puntaje por componente', () => {
    const r = computeEngagement(events(1), [opt('utilitarismo')], [30000], [0]);
    expect(r).not.toHaveProperty('index');
    expect(r).not.toHaveProperty('label');
    expect(r).not.toHaveProperty('selectionScore');
  });

  it('cuenta los dilemas en que se detuvo 20 s o mas y los resueltos en menos de 4 s', () => {
    const d = [opt('utilitarismo'), opt('deontologia'), opt('nihilismo'), opt('estoicismo')];
    const r = computeEngagement(events(4), d, [1000, 3999, 20000, 90000], [0, 0, 0, 0]);
    expect(r.apurados).toBe(2);
    expect(r.detenidos).toBe(2);
  });

  it('el Ateneo cuenta solo en los dilemas donde se consulto', () => {
    const d = [opt('utilitarismo'), opt('deontologia'), opt('nihilismo')];
    const r = computeEngagement(events(3), d, [30000, 30000, 30000], [1, 0, 3]);
    expect(r.ateneoLeido).toBe(2);
  });

  it('el contraste exige haber leido a un filosofo de una corriente distinta de la elegida', () => {
    const d = [opt('deontologia'), opt('deontologia')];
    // En el 1 leyo solo a Kant (misma corriente que eligio); en el 2 leyo a Mill.
    const r = computeEngagement(events(2), d, [30000, 30000], [1, 1], [['kant'], ['mill']]);
    expect(r.contraste).toBe(1);
  });

  it('haber abierto el Ateneo no alcanza: sin pensadores leidos no hay contraste', () => {
    const d = [opt('utilitarismo'), opt('nihilismo')];
    expect(computeEngagement(events(2), d, [30000, 30000], [1, 1], [[], []]).contraste).toBe(0);
    expect(computeEngagement(events(2), d, [30000, 30000], [1, 1]).contraste).toBe(0);
  });

  it('sin consultar el Ateneo no hay contraste', () => {
    const r = computeEngagement(events(2), [opt('utilitarismo'), opt('nihilismo')], [30000, 30000], [0, 0], [[], []]);
    expect(r.contraste).toBe(0);
  });

  it('exploracion: cuenta las corrientes distintas y nombra la que mas eligio', () => {
    const d = [opt('utilitarismo'), opt('utilitarismo'), opt('utilitarismo'), opt('nihilismo')];
    const r = computeEngagement(events(4), d, [30000, 30000, 30000, 30000], [0, 0, 0, 0]);
    expect(r.corrientes).toBe(2);
    expect(r.dominante).toEqual({ key: 'utilitarismo', pct: 75 });
  });

  it('las frases dicen numeros concretos de la partida', () => {
    const d = [opt('utilitarismo'), opt('deontologia')];
    const r = computeEngagement(events(2), d, [30000, 2000], [1, 0]);
    const todo = [...r.dedicacion, ...r.exploracion].join(' | ');
    expect(todo).toContain('1 de 2 dilemas');
    expect(todo).toContain('2 de 10 corrientes');
  });

  it('nunca mira qué opción se eligió para evaluar: mismos tiempos y lecturas, mismas frases de dedicación', () => {
    const a = computeEngagement(events(1), [opt('utilitarismo', 'A')], [30000], [0]);
    const b = computeEngagement(events(1), [opt('nihilismo', 'B')], [30000], [0]);
    expect(a.dedicacion).toEqual(b.dedicacion);
  });

  it('topDeliberated devuelve hasta 3 dilemas, por tiempo con bonus por Ateneo', () => {
    const d = [opt('utilitarismo', 'A'), opt('deontologia', 'B'), opt('nihilismo', 'C'), opt('estoicismo', 'D')];
    const r = computeEngagement(events(4), d, [5000, 60000, 10000, 10000], [0, 0, 1, 0]);
    expect(r.topDeliberated).toHaveLength(3);
    expect(r.topDeliberated[0].optionText).toBe('B');
    expect(r.topDeliberated.some(e => e.optionText === 'C')).toBe(true);
  });

  it('una partida vacía no tira', () => {
    expect(() => computeEngagement([], [], [], [])).not.toThrow();
  });
});
