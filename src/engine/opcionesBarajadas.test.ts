import { describe, it, expect, beforeEach, vi } from 'vitest';
import { eventPool } from '../data/dilemmas';
import { buildNewSession, buildWeightedPool, sortearOpciones } from './poolBuilder';
import { saveSeenMap } from './persistence';

/**
 * El orden de las opciones decide el resultado del juego.
 *
 * Este juego no tiene respuesta correcta: mide con cuál filosofía se alinea el
 * alumno y se lo dice al final. Por eso el orden en que se muestran las cuatro
 * opciones no es un detalle estético, es el instrumento de medición.
 *
 * Y estaba sesgado de fábrica. Contando las 84 opciones de la partida principal
 * tal como están escritas en los datos:
 *
 *     posición 1 → utilitarismo 54 de 84   (64 %)
 *     posición 3 → nihilismo    43 de 84   (51 %)
 *     posición 4 → virtuosismo y pragmatismo, 46 entre las dos
 *
 * Está escrito así por comodidad al redactar —primero la respuesta que calcula
 * consecuencias, después la del deber, después la que niega el problema— y se
 * entiende. Pero el alumno que tiende a elegir lo primero que lee termina
 * declarado utilitarista por la maquetación, no por lo que piensa. Y el que
 * elige siempre la última, pragmático.
 *
 * Se baraja al armar la sesión, no al pintar: cada opción lleva su propia
 * filosofía adentro, así que el orden en pantalla no tiene que coincidir con
 * ningún índice guardado.
 */
describe('el orden de las opciones', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('los datos siguen escritos en el orden cómodo para redactar', () => {
    // Este test no pide que los datos cambien: documenta el sesgo que hay en el
    // archivo, que es el motivo por el que la sesión tiene que barajar.
    const principales = eventPool.filter(d => d.id !== 60);
    const primeras = principales.map(d => d.options[0]!.philosophy);
    const utilitaristas = primeras.filter(p => p === 'utilitarismo').length;
    expect(utilitaristas / principales.length).toBeGreaterThan(0.5);
  });

  it('pero la sesión no entrega ninguna filosofía siempre en el mismo lugar', () => {
    const conteo: Record<number, Record<string, number>> = {};
    let total = 0;

    for (let n = 0; n < 40; n++) {
      localStorage.clear();
      for (const d of buildNewSession(14)) {
        d.options.forEach((o, i) => {
          conteo[i] = conteo[i] || {};
          conteo[i][o.philosophy] = (conteo[i][o.philosophy] || 0) + 1;
        });
        total++;
      }
    }

    // Con cuatro opciones, lo esperable es un 25 % por posición. Se deja margen
    // ancho —hasta 40 %— porque los dilemas no tienen las mismas cuatro
    // filosofías entre sí; lo que no puede pasar es el 64 % de antes.
    for (const [pos, filos] of Object.entries(conteo)) {
      const veces = Object.values(filos);
      const masRepetida = Math.max(...veces);
      const suma = veces.reduce((a, b) => a + b, 0);
      expect(masRepetida / suma,
        `posición ${Number(pos) + 1}: ${JSON.stringify(filos)}`).toBeLessThan(0.4);
    }
    expect(total).toBeGreaterThan(400);
  });

  it('y barajar no pierde, duplica ni inventa opciones', () => {
    localStorage.clear();
    const sesion = buildNewSession(14);
    for (const d of sesion) {
      const original = eventPool.find(e => e.id === d.id)!;
      expect(d.options).toHaveLength(original.options.length);

      const orden = (os: typeof d.options) =>
        [...os].map(o => `${o.philosophy}|${o.impact}|${o.text}`).sort();
      expect(orden(d.options)).toEqual(orden(original.options));
    }
  });

  it('el pool de datos original no se modifica al barajar', () => {
    const antes = eventPool.map(d => d.options.map(o => o.philosophy).join(','));
    localStorage.clear();
    buildNewSession(14);
    buildNewSession(14);
    const despues = eventPool.map(d => d.options.map(o => o.philosophy).join(','));
    expect(despues).toEqual(antes);
  });
});

/**
 * Y el desempate de la prioridad, que era un comparador inconsistente.
 *
 * `buildWeightedPool` ordena los dilemas por cuánto hace que no salen, y dentro
 * de un mismo puntaje desempataba con `Math.random() - 0.5` **como comparador**.
 * Eso no es un sorteo: el comparador contesta distinto cada vez que se le
 * pregunta por el mismo par, y `sort` deja los elementos cerca de donde estaban.
 *
 * Acá el orden de llegada importa de verdad, porque la sesión se queda con los
 * primeros catorce o treinta y nueve: los dilemas que están antes en el archivo
 * salían elegidos más seguido que los del final, partida tras partida, que es
 * justo lo contrario de lo que la prioridad por «hace cuánto no sale» busca.
 */
describe('el desempate entre dilemas con la misma prioridad', () => {
  beforeEach(() => localStorage.clear());

  it('reparte parejo entre los que nunca se vieron', () => {
    // Sin nada visto, los 84 tienen prioridad infinita: el desempate es lo unico
    // que decide. Lo que se mide es el sesgo POSICIONAL, que es la señal estable:
    // cuantas veces entran los primeros del archivo contra los ultimos.
    //
    // Medido con el comparador viejo, sobre 4000 corridas de 14 sobre 84:
    // primeros catorce 848 veces, ultimos catorce 530 — un 60 % mas. Con
    // Fisher-Yates: 664 contra 665.
    const veces: Record<number, number> = {};
    const CORRIDAS = 1500;
    const CUANTOS = 14;

    for (let n = 0; n < CORRIDAS; n++) {
      localStorage.clear();
      for (const d of buildWeightedPool(60).slice(0, CUANTOS)) {
        veces[d.id] = (veces[d.id] || 0) + 1;
      }
    }

    const enOrdenDeArchivo = eventPool.filter(d => d.id !== 60).map(d => veces[d.id] || 0);
    expect(enOrdenDeArchivo.filter(v => v === 0), 'hay dilemas que no salieron nunca').toEqual([]);

    const media = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const primeros = media(enOrdenDeArchivo.slice(0, 14));
    const ultimos = media(enOrdenDeArchivo.slice(-14));

    expect(primeros / ultimos,
      `primeros 14: ${primeros.toFixed(0)} · ultimos 14: ${ultimos.toFixed(0)}`)
      .toBeLessThan(1.2);
  });

  it('y sigue respetando la prioridad: lo no visto va antes que lo visto', () => {
    // Se escribe con la propia API: el guardado va versionado y con otra clave.
    saveSeenMap({ 1: 0, 2: 0, 3: 0 });
    const orden = buildWeightedPool(60).map(d => d.id);
    const posicionDeVistos = [1, 2, 3].map(id => orden.indexOf(id));
    const noVistos = orden.filter(id => ![1, 2, 3].includes(id));
    for (const p of posicionDeVistos) {
      expect(p, 'un dilema ya visto se coló antes que los no vistos').toBeGreaterThan(noVistos.length - 1);
    }
  });
});

/**
 * Y al retomar una partida guardada.
 *
 * El autosave guarda sólo los ids (`eventIds`), así que al continuar la sesión se
 * reconstruye desde `eventPool` — y de ahí salen las opciones en el orden en que
 * están escritas, o sea con el sesgo intacto para todo lo que quede de partida.
 *
 * Reordenar al retomar no le cambia nada al alumno: los dilemas ya respondidos no
 * se vuelven a mostrar, así que sólo ve el orden nuevo en los que le faltan.
 */
describe('las opciones al continuar una partida', () => {
  it('vuelven sorteadas, no en el orden del archivo', () => {
    const conteo: Record<string, number> = {};
    let total = 0;
    for (let n = 0; n < 200; n++) {
      for (const d of eventPool.filter(e => e.id !== 60).slice(0, 20)) {
        const primera = sortearOpciones(d).options[0]!.philosophy;
        conteo[primera] = (conteo[primera] || 0) + 1;
        total++;
      }
    }
    const masRepetida = Math.max(...Object.values(conteo));
    expect(masRepetida / total, JSON.stringify(conteo)).toBeLessThan(0.4);
  });

  it('y siguen siendo las mismas opciones', () => {
    for (const d of eventPool) {
      const s = sortearOpciones(d);
      const clave = (os: typeof d.options) => [...os].map(o => o.text).sort();
      expect(clave(s.options)).toEqual(clave(d.options));
      expect(d.options.map(o => o.text), 'el pool original se modificó')
        .toEqual(eventPool.find(e => e.id === d.id)!.options.map(o => o.text));
    }
  });
});
