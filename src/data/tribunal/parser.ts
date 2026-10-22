import type { OptionEffects, PanKey, ViceKey } from '../../types';

export const PAN_KEYS: PanKey[] = ['Fel', 'Jus', 'Lib', 'Bien', 'Cor', 'Raz'];
export const VICE_KEYS: ViceKey[] = ['Sob', 'Corr', 'Cru', 'Ind'];

// Las tres balanzas: [platillo izquierdo, platillo derecho].
export const PARES: [PanKey, PanKey][] = [['Fel', 'Jus'], ['Lib', 'Bien'], ['Cor', 'Raz']];

const PAN_RE = /^(Fel|Jus|Lib|Bien|Cor|Raz)(-?\d+)$/;
const VICE_RE = /^(Sob|Corr|Cru|Ind)(\d+)$/;

export class EfectosError extends Error {}

// "12.3 Fel2 Bien3 Lib-1 | Sob1 Ind2" -> { clave: "12.3", effects }
// Una linea mal escrita corta la carga con el numero de linea: preferimos que
// el juego no arranque en desarrollo a que una opcion quede sin efectos.
export function parseLinea(linea: string, nro: number): { clave: string; effects: OptionEffects } {
  const [izq, der = ''] = linea.split('|');
  const toks = izq.trim().split(/\s+/);
  const clave = toks.shift() ?? '';
  if (!/^\d+\.\d+$/.test(clave)) throw new EfectosError(`línea ${nro}: clave inválida «${clave}»`);

  const pans: OptionEffects['pans'] = {};
  for (const t of toks) {
    const m = PAN_RE.exec(t);
    if (!m) throw new EfectosError(`línea ${nro}: platillo inválido «${t}»`);
    const k = m[1] as PanKey;
    if (k in pans) throw new EfectosError(`línea ${nro}: platillo repetido «${k}»`);
    const n = Number(m[2]);
    if (n === 0 || Math.abs(n) > 4) throw new EfectosError(`línea ${nro}: ${k} fuera de rango (${n})`);
    pans[k] = n;
  }

  const vices: OptionEffects['vices'] = {};
  for (const t of der.trim().split(/\s+/).filter(Boolean)) {
    const m = VICE_RE.exec(t);
    if (!m) throw new EfectosError(`línea ${nro}: vicio inválido «${t}»`);
    const k = m[1] as ViceKey;
    if (k in vices) throw new EfectosError(`línea ${nro}: vicio repetido «${k}»`);
    const n = Number(m[2]);
    if (n < 1 || n > 3) throw new EfectosError(`línea ${nro}: ${k} fuera de rango (${n})`);
    vices[k] = n;
  }
  return { clave, effects: { pans, vices } };
}

export function parseEfectos(raw: string): Map<string, OptionEffects> {
  const out = new Map<string, OptionEffects>();
  raw.split('\n').forEach((linea, i) => {
    if (!linea.trim()) return;
    const { clave, effects } = parseLinea(linea, i + 1);
    if (out.has(clave)) throw new EfectosError(`línea ${i + 1}: clave repetida ${clave}`);
    out.set(clave, effects);
  });
  return out;
}
