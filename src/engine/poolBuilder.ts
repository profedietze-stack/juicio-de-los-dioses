import type { Dilemma } from '../types';
import { eventPool } from '../data/dilemmas';
import { finale } from '../data/dilemmas/finale';
import { getSeenMap, saveSeenMap, getTotalGamesPlayed, getPlayCounts, savePlayCounts } from './persistence';
import { barajar } from './barajar';

const FINALE_ID = 60;

// Priority: never-seen first (score = Infinity), then least-recently-seen
// (higher "games ago" = higher priority), with random tiebreak within a
// score bucket.
export function buildWeightedPool(excludeId?: number): Dilemma[] {
  const seen = getSeenMap();
  const gamesPlayed = getTotalGamesPlayed();
  const eligible = eventPool.filter(e => e.id !== excludeId);

  const scored = eligible.map(e => {
    const lastSeen = seen[e.id];
    const score = lastSeen === undefined ? Infinity : (gamesPlayed - lastSeen);
    return { e, score };
  });

  // Se baraja ANTES de ordenar, y el orden se hace estable por puntaje: asi el
  // desempate dentro de un mismo puntaje es un sorteo de verdad.
  //
  // Antes el desempate era `Math.random() - 0.5` como comparador, que no es un
  // sorteo: contesta distinto cada vez que se le pregunta por el mismo par y deja
  // los elementos cerca de donde estaban. Y aca el orden decide que dilemas entran,
  // porque la sesion se queda con los primeros catorce o treinta y nueve. Medido
  // sobre 4000 corridas de 14 sobre 84: los primeros catorce del archivo entraban
  // 848 veces y los ultimos catorce 530, un 60 % mas, partida tras partida — justo
  // lo contrario de lo que la prioridad por «hace cuanto no sale» busca.
  const sorteados = barajar(scored);
  sorteados.sort((a, b) => b.score - a.score);

  return sorteados.map(s => s.e);
}

export function recordSeenDilemas(sessionEvents: Dilemma[]) {
  const seen = getSeenMap();
  const gameNum = getTotalGamesPlayed();
  const counts = getPlayCounts();
  sessionEvents.forEach(e => {
    if (e.id !== FINALE_ID) {
      seen[e.id] = gameNum;
      counts[e.id] = (counts[e.id] || 0) + 1;
    }
  });
  saveSeenMap(seen);
  savePlayCounts(counts);
}

export const FULL_SESSION_LENGTH = 39;
export const SHORT_SESSION_LENGTH = 14;

// "Comenzar el Juicio" — always starts a fresh session: `count` highest-
// priority dilemmas (shuffled) plus the finale appended last. Defaults to
// the full 39-dilemma session; the short mode passes SHORT_SESSION_LENGTH.
// Las opciones de cada dilema, en orden sorteado.
//
// Este juego no tiene respuesta correcta: mide con que filosofia se alinea el alumno
// y se lo dice al final, asi que el orden de las opciones es el instrumento de
// medicion. En los datos estan escritas en el orden comodo para redactar —primero la
// que calcula consecuencias, despues la del deber, despues la que niega el problema—
// y eso deja al utilitarismo primero en el 64 % de los dilemas y al nihilismo tercero
// en el 51 %. El alumno que elige siempre lo primero que lee terminaba declarado
// utilitarista por la maquetacion.
//
// Se baraja aca y no al pintar: cada opcion lleva su filosofia adentro, asi que
// ningun indice guardado depende de la posicion en pantalla.
export function sortearOpciones(d: Dilemma): Dilemma {
  return { ...d, options: barajar(d.options) };
}

export function buildNewSession(count: number = FULL_SESSION_LENGTH): Dilemma[] {
  const weighted = buildWeightedPool(FINALE_ID);
  const pool = weighted.slice(0, count);
  const shuffled = barajar(pool);
  return [...shuffled, finale].map(sortearOpciones);
}
