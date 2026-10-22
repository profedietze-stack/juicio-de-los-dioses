// Mide el equilibrio del Tribunal sobre TODO el banco, con los efectos reales.
//
//   npx vite-node scripts/medir-tribunal.ts            # 10.000 partidas por estrategia
//   N=2000 npx vite-node scripts/medir-tribunal.ts     # mas rapido
//
// Que mira:
//  1. Estatico: por corriente, el efecto medio de sus opciones (platillos, vicios).
//  2. Simulado: partidas de 40 y de 15 jugando al azar, siempre una corriente, o
//     siempre la opcion «mas sana» — y cuantas terminarian condenadas.
// Los umbrales de condena todavia no estan fijados: se calibran aca, con el azar.
import { eventPool } from '../src/data/dilemmas';
import { PARES, PAN_KEYS, VICE_KEYS } from '../src/data/tribunal/parser';
import type { Dilemma, DilemmaOption, PhilosophyKey, PanKey, ViceKey } from '../src/types';

const N = Number(process.env.N ?? 10000);
const CORRIENTES: PhilosophyKey[] = ['utilitarismo', 'deontologia', 'nihilismo', 'virtuosismo', 'existencialismo', 'estoicismo', 'pragmatismo', 'contractualismo', 'feminismo', 'budismo'];
const FINAL_ID = 60;

const fx = (o: DilemmaOption) => o.effects!;
const viciosDe = (o: DilemmaOption) => Object.values(fx(o).vices).reduce((a, b) => a + (b ?? 0), 0);
const f1 = (x: number) => x.toFixed(1);
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

function barajar<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

// ── 1. Estatico ─────────────────────────────────────────────────────────────
console.log('## 1. Efecto medio por opcion, segun la corriente de la opcion\n');
console.log('| corriente | n | ganancia | costo | neto | vicios | ' + PAN_KEYS.join(' | ') + ' |');
console.log('|---|---|---|---|---|---|' + PAN_KEYS.map(() => '---').join('|') + '|');
for (const c of CORRIENTES) {
  const os = eventPool.flatMap(d => d.options).filter(o => o.philosophy === c);
  const gan = os.reduce((a, o) => a + Object.values(fx(o).pans).filter(n => n! > 0).reduce((x, y) => x + y!, 0), 0) / os.length;
  const cos = os.reduce((a, o) => a + Object.values(fx(o).pans).filter(n => n! < 0).reduce((x, y) => x + y!, 0), 0) / os.length;
  const vic = os.reduce((a, o) => a + viciosDe(o), 0) / os.length;
  const porPan = PAN_KEYS.map(k => f1(os.reduce((a, o) => a + (fx(o).pans[k] ?? 0), 0) / os.length));
  console.log(`| ${c} | ${os.length} | ${f1(gan)} | ${f1(cos)} | ${f1(gan + cos)} | ${f1(vic)} | ${porPan.join(' | ')} |`);
}

if (process.env.SOLO_ESTATICO) process.exit(0);

// ── 2. Simulado ─────────────────────────────────────────────────────────────
interface Resultado { S: number; tilt: number; D: number[]; vic: Record<ViceKey, number>; }

function jugar(largo: number, elegir: (d: Dilemma, estado: Estado) => DilemmaOption): Resultado {
  const base = eventPool.filter(d => d.id !== FINAL_ID);
  const final = eventPool.find(d => d.id === FINAL_ID)!;
  const sesion = [...barajar(base).slice(0, largo), final];
  const e: Estado = { pans: Object.fromEntries(PAN_KEYS.map(k => [k, 0])) as Record<PanKey, number>, vic: Object.fromEntries(VICE_KEYS.map(k => [k, 0])) as Record<ViceKey, number> };
  for (const d of sesion) {
    const o = elegir({ ...d, options: barajar(d.options) }, e);
    for (const [k, n] of Object.entries(fx(o).pans)) e.pans[k as PanKey] += n!;
    for (const [k, n] of Object.entries(fx(o).vices)) e.vic[k as ViceKey] += n!;
  }
  const D = PARES.map(([l, r]) => e.pans[r] - e.pans[l]);
  return { S: VICE_KEYS.reduce((a, k) => a + e.vic[k], 0), tilt: Math.max(...D.map(Math.abs)), D, vic: e.vic };
}
interface Estado { pans: Record<PanKey, number>; vic: Record<ViceKey, number>; }

// Para no atarnos a un puntaje inventado: la opcion «mas sana» minimiza lo que
// acaba de pesar en La Sombra y en el desequilibrio de las balanzas.
function sana(d: Dilemma, e: Estado): DilemmaOption {
  let mejor = d.options[0], mejorC = Infinity;
  for (const o of d.options) {
    const p = { ...e.pans }; for (const [k, n] of Object.entries(fx(o).pans)) p[k as PanKey] += n!;
    const tilt = Math.max(...PARES.map(([l, r]) => Math.abs(p[r] - p[l])));
    const c = viciosDe(o) * 2 + tilt;
    if (c < mejorC) { mejorC = c; mejor = o; }
  }
  return mejor;
}

const estrategias: Record<string, (d: Dilemma, e: Estado) => DilemmaOption> = {
  azar: d => d.options[Math.floor(Math.random() * d.options.length)],
  sana,
};
for (const c of CORRIENTES) estrategias['siempre ' + c] = d => d.options.find(o => o.philosophy === c) ?? d.options[0];

const percentil = (xs: number[], p: number) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(xs.length * p))];

for (const largo of [39, 14]) {
  console.log(`\n## 2. Partidas de ${largo + 1} dilemas (${N} por estrategia)\n`);
  const sims: Record<string, Resultado[]> = {};
  for (const [nombre, f] of Object.entries(estrategias)) sims[nombre] = Array.from({ length: N }, () => jugar(largo, f));

  const S = sims.azar.map(r => r.S), T = sims.azar.map(r => r.tilt);
  const p = (q: number) => `S p${q * 100}=${percentil(S, q)}, desequilibrio p${q * 100}=${percentil(T, q)}`;
  console.log(`Al azar: ${p(0.5)} | ${p(0.75)} | ${p(0.9)}\n`);
  const SCOND = Number(process.env.SCOND ?? percentil(S, 0.8));
  console.log(`Umbral de prueba: se condena con Sombra >= ${SCOND} (el azar condena ~20 %)\n`);

  // Solo La Sombra condena. Las balanzas no condenan: dan el tono del final.
  console.log('| estrategia | Sombra | ' + PARES.map(([l, r]) => `${l}↔${r}`).join(' | ') + ' | ' + VICE_KEYS.join(' | ') + ' | condena |');
  console.log('|---|---|' + PARES.map(() => '---').join('|') + '|' + VICE_KEYS.map(() => '---').join('|') + '|---|');
  for (const [nombre, rs] of Object.entries(sims)) {
    const m = (f: (r: Resultado) => number) => rs.reduce((a, r) => a + f(r), 0) / rs.length;
    const cS = rs.filter(r => r.S >= SCOND).length / rs.length;
    console.log(`| ${nombre} | ${f1(m(r => r.S))} | ${PARES.map((_, i) => f1(m(r => r.D[i]))).join(' | ')} | ${VICE_KEYS.map(k => f1(m(r => r.vic[k]))).join(' | ')} | ${pct(cS)} |`);
  }
}
