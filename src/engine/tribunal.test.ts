import { describe, it, expect } from 'vitest';
import { tribunalVacio, aplicarEfectos, balanzas, sombraTotal, umbralCondena, veredicto, viceDominante } from './tribunal';

describe('aplicarEfectos', () => {
  it('suma platillos y vicios sin tocar el estado anterior', () => {
    const a = tribunalVacio();
    const b = aplicarEfectos(a, { pans: { Fel: 3, Jus: -2 }, vices: { Corr: 2 } });
    expect(b.pans.Fel).toBe(3);
    expect(b.pans.Jus).toBe(-2);
    expect(b.vices.Corr).toBe(2);
    expect(a.pans.Fel).toBe(0);
    expect(a.vices.Corr).toBe(0);
  });

  it('una opcion sin efectos no cambia nada', () => {
    const a = tribunalVacio();
    expect(aplicarEfectos(a, undefined)).toBe(a);
  });
});

describe('balanzas', () => {
  it('inclina hacia el platillo que mas pesa', () => {
    let t = tribunalVacio();
    t = aplicarEfectos(t, { pans: { Fel: 1, Jus: 4, Lib: 2, Bien: 2 }, vices: {} });
    const [fj, lb, cr] = balanzas(t);
    expect(fj).toMatchObject({ izq: 'Fel', der: 'Jus', dif: 3, inclinacion: 'der' });
    expect(lb.inclinacion).toBe('equilibrio');
    expect(cr.inclinacion).toBe('equilibrio');
  });
});

describe('umbral de condena', () => {
  it('es 67 con 40 dilemas y 26 con 15 (los valores medidos y acordados)', () => {
    expect(umbralCondena(40)).toBe(67);
    expect(umbralCondena(15)).toBe(26);
  });
});

describe('veredicto', () => {
  const conSombra = (n: number) => aplicarEfectos(tribunalVacio(), { pans: {}, vices: { Ind: Math.min(3, n) } }) && {
    ...tribunalVacio(), vices: { Sob: 0, Corr: 0, Cru: 0, Ind: n },
  };

  it('condena solo por La Sombra, nunca por una balanza desequilibrada', () => {
    const t = aplicarEfectos(tribunalVacio(), { pans: { Fel: 4, Jus: -4 }, vices: {} });
    const t2 = { ...t, pans: { ...t.pans, Fel: 100, Jus: -100 } };
    expect(veredicto(t2, 40).condenada).toBe(false);
  });

  it('condena al llegar al umbral y no antes', () => {
    expect(veredicto(conSombra(66), 40).condenada).toBe(false);
    expect(veredicto(conSombra(67), 40).condenada).toBe(true);
    expect(veredicto(conSombra(67), 40).endingKey).toBe('extinction');
  });

  it('sin Sombra el puntaje es 100 y el final el mas alto', () => {
    const v = veredicto(tribunalVacio(), 40);
    expect(v.score).toBe(100);
    expect(v.endingKey).toBe('deification');
    expect(v.vicio).toBeNull();
    expect(v.balanzaMayor).toBeNull();
  });

  it('el vicio dominante es el que mas se alimento', () => {
    const t = { ...tribunalVacio(), vices: { Sob: 2, Corr: 5, Cru: 1, Ind: 0 } };
    expect(viceDominante(t)).toBe('Corr');
    expect(sombraTotal(t)).toBe(8);
  });

  it('el mismo vicio pesa mas en una partida corta', () => {
    expect(veredicto(conSombra(26), 15).condenada).toBe(true);
    expect(veredicto(conSombra(26), 40).condenada).toBe(false);
  });
});
