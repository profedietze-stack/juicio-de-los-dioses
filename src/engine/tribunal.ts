// Estado y veredicto del Tribunal: tres balanzas (seis platillos) y La Sombra
// (cuatro vicios). Funciones puras: la pantalla solo dibuja lo que esto devuelve.
//
// Condena solo La Sombra. Las balanzas no condenan: dan el tono del final, para
// que un deontologo consecuente no termine condenado por inclinar Justicia.
import type { OptionEffects, PanKey, TribunalState, ViceKey } from '../types';
import { PAN_KEYS, VICE_KEYS, PARES } from '../data/tribunal/parser';

export type { TribunalState };

export function tribunalVacio(): TribunalState {
  return {
    pans: Object.fromEntries(PAN_KEYS.map(k => [k, 0])) as Record<PanKey, number>,
    vices: Object.fromEntries(VICE_KEYS.map(k => [k, 0])) as Record<ViceKey, number>,
  };
}

export function aplicarEfectos(t: TribunalState, fx?: OptionEffects): TribunalState {
  if (!fx) return t;
  const pans = { ...t.pans };
  const vices = { ...t.vices };
  for (const [k, n] of Object.entries(fx.pans)) pans[k as PanKey] += n ?? 0;
  for (const [k, n] of Object.entries(fx.vices)) vices[k as ViceKey] += n ?? 0;
  return { pans, vices };
}

export function sombraTotal(t: TribunalState): number {
  return VICE_KEYS.reduce((a, k) => a + t.vices[k], 0);
}

// Umbral de condena segun el largo de la partida. Medido con 5000 partidas al
// azar: 40 dilemas -> 67 (condena ~12 %), 15 dilemas -> 26 (~17 %). Entre medio, recta.
export function umbralCondena(total: number): number {
  return Math.round(26 + (total - 15) * (67 - 26) / (40 - 15));
}

export type Inclinacion = 'izq' | 'der' | 'equilibrio';

export interface EstadoBalanza {
  izq: PanKey;
  der: PanKey;
  // Positivo: pesa mas el platillo derecho.
  dif: number;
  inclinacion: Inclinacion;
}

export function balanzas(t: TribunalState): EstadoBalanza[] {
  return PARES.map(([izq, der]) => {
    const dif = t.pans[der] - t.pans[izq];
    return { izq, der, dif, inclinacion: dif > 0 ? 'der' : dif < 0 ? 'izq' : 'equilibrio' };
  });
}

// Vicio que mas pesa; en empate gana el primero de VICE_KEYS. Sin vicios, null.
export function viceDominante(t: TribunalState): ViceKey | null {
  let mejor: ViceKey | null = null;
  for (const k of VICE_KEYS) if (t.vices[k] > 0 && (mejor === null || t.vices[k] > t.vices[mejor])) mejor = k;
  return mejor;
}

// Cortes medidos con 4000 partidas: al azar la Sombra cae entre 0.76 y 1.0 del umbral
// (mitad en «purgatorio»); evitando vicios a proposito baja a ~0.3 («deificacion»).
export type FinalKey = 'extinction' | 'purgatory' | 'enlightenment' | 'deification';

export interface Veredicto {
  sombra: number;
  umbral: number;
  condenada: boolean;
  vicio: ViceKey | null;
  // La balanza mas desequilibrada (la que da el tono) o null si todas estan parejas.
  balanzaMayor: EstadoBalanza | null;
  endingKey: FinalKey;
  // 0..100: 100 sin sombra, 0 al llegar al umbral. Alimenta logros, historial y tarjeta.
  score: number;
}

export function veredicto(t: TribunalState, totalDecisiones: number): Veredicto {
  const sombra = sombraTotal(t);
  const umbral = umbralCondena(Math.max(1, totalDecisiones));
  const ratio = sombra / umbral;
  const bs = balanzas(t);
  const mayor = bs.reduce((a, b) => (Math.abs(b.dif) > Math.abs(a.dif) ? b : a), bs[0]);
  const endingKey: FinalKey =
    ratio >= 1 ? 'extinction' : ratio >= 0.85 ? 'purgatory' : ratio >= 0.5 ? 'enlightenment' : 'deification';
  return {
    sombra, umbral, condenada: ratio >= 1,
    vicio: viceDominante(t),
    balanzaMayor: mayor.dif === 0 ? null : mayor,
    endingKey,
    score: 100 - Math.round(100 * Math.min(1, ratio)),
  };
}
