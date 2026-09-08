import { describe, it, expect } from 'vitest';
import { barajar } from './barajar';

// El orden de la sesión se armaba con `sort(() => Math.random() - 0.5)`. El
// pool viene ordenado por prioridad, así que ese comparador —que deja los
// elementos cerca de donde estaban— hacía que los dilemas mejor puntuados
// cayeran al principio bastante más seguido de lo que corresponde.

describe('barajar', () => {
  it('no pierde ni inventa elementos, y no toca el original', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 0; i < 300; i++) {
      expect([...barajar(original)].sort((a, b) => a - b)).toEqual(original);
    }
    expect(original).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('reparte parejo: el primer elemento llega a cualquier posición', () => {
    const lista = [0, 1, 2, 3, 4];
    const veces = [0, 0, 0, 0, 0];
    const N = 25000;
    for (let i = 0; i < N; i++) veces[barajar(lista).indexOf(0)]!++;
    for (const [pos, n] of veces.entries()) {
      const p = n / N;
      expect(p, `el primero cae en la posición ${pos} el ${(p * 100).toFixed(1)}% de las veces`)
        .toBeGreaterThan(0.17);
      expect(p).toBeLessThan(0.23);
    }
  });

  it('deja una pieza en su lugar en promedio, no más', () => {
    // Es la firma del comparador tramposo: con él quedan quietas 1,4 de cada 5.
    const lista = [0, 1, 2, 3, 4];
    let quietas = 0;
    const N = 25000;
    for (let i = 0; i < N; i++) {
      quietas += barajar(lista).filter((v, i2) => v === i2).length;
    }
    expect(quietas / N).toBeGreaterThan(0.85);
    expect(quietas / N).toBeLessThan(1.15);
  });

  it('aguanta listas vacías y de un elemento', () => {
    expect(barajar([])).toEqual([]);
    expect(barajar(['uno'])).toEqual(['uno']);
  });
});
