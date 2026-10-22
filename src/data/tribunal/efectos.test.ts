import { describe, it, expect } from 'vitest';
import { eventPool } from '../dilemmas';
import { EFECTOS_RAW } from './efectosRaw';
import { parseEfectos, parseLinea, EfectosError, PAN_KEYS, VICE_KEYS } from './parser';
import type { DilemmaOption } from '../../types';

const opciones = eventPool.flatMap(d => d.options.map((o, i) => ({ d, o, i })));

function viciosTotales(o: DilemmaOption) {
  return Object.values(o.effects!.vices).reduce((a, b) => a + (b ?? 0), 0);
}

describe('parser de efectos', () => {
  it('lee ganancias, costos y vicios', () => {
    const { clave, effects } = parseLinea('12.3 Fel2 Bien3 Lib-1 | Sob1 Ind2', 1);
    expect(clave).toBe('12.3');
    expect(effects.pans).toEqual({ Fel: 2, Bien: 3, Lib: -1 });
    expect(effects.vices).toEqual({ Sob: 1, Ind: 2 });
  });

  it('una opcion sin vicios es valida', () => {
    expect(parseLinea('1.0 Fel3 Jus-2 |', 1).effects.vices).toEqual({});
  });

  it.each([
    ['clave sin punto', '12 Fel2 Jus-1 |'],
    ['platillo desconocido', '1.0 Foo2 Jus-1 |'],
    ['platillo repetido', '1.0 Fel2 Fel-1 |'],
    ['platillo en cero', '1.0 Fel0 Jus-1 |'],
    ['platillo fuera de rango', '1.0 Fel5 Jus-1 |'],
    ['vicio desconocido', '1.0 Fel2 Jus-1 | Foo1'],
    ['vicio repetido', '1.0 Fel2 Jus-1 | Sob1 Sob2'],
    ['vicio fuera de rango', '1.0 Fel2 Jus-1 | Sob4'],
    ['vicio negativo', '1.0 Fel2 Jus-1 | Sob-1'],
  ])('rechaza %s', (_, linea) => {
    expect(() => parseLinea(linea, 1)).toThrow(EfectosError);
  });

  it('rechaza una clave repetida', () => {
    expect(() => parseEfectos('1.0 Fel1 Jus-1 |\n1.0 Fel2 Jus-1 |')).toThrow(EfectosError);
  });
});

describe('efectos del banco', () => {
  it('todas las opciones tienen efectos y no sobra ninguna linea', () => {
    expect(opciones.filter(x => !x.o.effects)).toEqual([]);
    expect(parseEfectos(EFECTOS_RAW).size).toBe(opciones.length);
  });

  it('cada opcion suma en algun platillo y tiene un costo (un platillo que baja o un vicio)', () => {
    const sinGanancia = opciones.filter(({ o }) => !Object.values(o.effects!.pans).some(n => (n ?? 0) > 0));
    const sinCosto = opciones.filter(({ o }) =>
      !Object.values(o.effects!.pans).some(n => (n ?? 0) < 0) && viciosTotales(o) === 0);
    expect(sinGanancia.map(x => `${x.d.id}.${x.i}`)).toEqual([]);
    expect(sinCosto.map(x => `${x.d.id}.${x.i}`)).toEqual([]);
  });

  it('ningun platillo ni vicio de una opcion sale de las claves conocidas', () => {
    for (const { o } of opciones) {
      for (const k of Object.keys(o.effects!.pans)) expect(PAN_KEYS).toContain(k);
      for (const k of Object.keys(o.effects!.vices)) expect(VICE_KEYS).toContain(k);
    }
  });

  it('ninguna opcion es mejor que otra del mismo dilema en todo', () => {
    // A domina a B si suma al menos lo mismo en cada platillo y alimenta los
    // vicios no mas que B, ganando estrictamente en algo. Sin esto, una decision
    // deja de ser una decision.
    const dominadas: string[] = [];
    for (const d of eventPool) {
      for (const a of d.options) for (const b of d.options) {
        if (a === b) continue;
        const pa = a.effects!.pans, pb = b.effects!.pans;
        const mejorOIgual = PAN_KEYS.every(k => (pa[k] ?? 0) >= (pb[k] ?? 0));
        const estricto = PAN_KEYS.some(k => (pa[k] ?? 0) > (pb[k] ?? 0)) || viciosTotales(a) < viciosTotales(b);
        const viciosOk = VICE_KEYS.every(k => (a.effects!.vices[k] ?? 0) <= (b.effects!.vices[k] ?? 0));
        if (mejorOIgual && viciosOk && estricto) dominadas.push(`${d.id}: «${a.text.slice(0, 30)}» domina a «${b.text.slice(0, 30)}»`);
      }
    }
    expect(dominadas).toEqual([]);
  });

  it('reparte los vicios por opcion: algunas ninguno, otras uno, dos o tres', () => {
    const n = opciones.length;
    const por = [0, 1, 2, 3].map(c => opciones.filter(({ o }) => Object.keys(o.effects!.vices).length === c).length / n);
    expect(por[0]).toBeGreaterThan(0.15);
    expect(por[1]).toBeGreaterThan(0.25);
    expect(por[2]).toBeGreaterThan(0.15);
    expect(por[3]).toBeGreaterThan(0.03);
    expect(por[3]).toBeLessThan(0.2);
  });

  it('el final lleva sus efectos aunque se arme desde poolBuilder', async () => {
    const { buildNewSession } = await import('../../engine/poolBuilder');
    const sesion = buildNewSession(3);
    const final = sesion[sesion.length - 1];
    expect(final.id).toBe(60);
    expect(final.options.every(o => o.effects)).toBe(true);
  });
});
