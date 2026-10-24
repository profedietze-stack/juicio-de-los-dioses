import type { Dilemma, DilemmaOption, DeliberatedEntry, PhilosophyKey } from '../types';
import { philosophers } from '../data/philosophers';
import { PHILO_LABELS } from './philosophyDisplay';

// This is deliberately NOT a correctness score and NOT a grade: no dilemma has
// a "right" option, and a single number invites playing for the number. It
// describes, in plain words and with the counts behind them, how the session
// was played — so the teacher has something to talk about, not something to
// mark. Two separate readings, never added together:
//   Dedicación  — time spent (only while the tab was visible), and whether the
//                 Ateneo was actually read, including a philosopher who thinks
//                 differently from the option finally chosen.
//   Exploración — how many of the ten currents were actually chosen.
// What is NOT measured on purpose: how many philosophers were picked for the
// Ateneo (one click, nothing read) and which options were chosen.
// See ResultScreen's disclaimer copy, which must ship alongside any UI that
// shows this.

export const ATENEO_MIN_SELECTION = 3;
export const ATENEO_MAX_SELECTION = 6;

// Abrir el Ateneo y cerrarlo enseguida no es consultarlo: la consulta cuenta solo si
// el modal estuvo abierto al menos este tiempo.
export const ATENEO_LECTURA_MIN_MS = 5000;

const APURADO_MAX_S = 4;
const DETENIDO_MIN_S = 20;
const TOTAL_CORRIENTES = 10;

export interface EngagementResult {
  total: number; // dilemas decididos
  detenidos: number; // dilemas con 20 s o más de tiempo activo
  apurados: number; // dilemas resueltos en menos de 4 s
  ateneoLeido: number; // dilemas donde se leyó el Ateneo
  contraste: number; // ...y se leyó a alguien de una corriente distinta de la elegida
  corrientes: number; // corrientes distintas elegidas (de 10)
  dominante: { key: PhilosophyKey; pct: number } | null;
  dedicacion: string[]; // frases listas para mostrar
  exploracion: string[];
  topDeliberated: DeliberatedEntry[];
}

const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios);

export function computeEngagement(
  events: Dilemma[],
  decisions: DilemmaOption[],
  decisionTimesMs: number[],
  ateneoConsultCounts: number[],
  ateneoLeidos: string[][] = [],
): EngagementResult {
  const total = decisions.length;
  const seconds = decisions.map((_, i) => Math.max(0, decisionTimesMs[i] ?? 0) / 1000);

  const detenidos = seconds.filter(s => s >= DETENIDO_MIN_S).length;
  const apurados = seconds.filter(s => s < APURADO_MAX_S).length;

  const leyo = decisions.map((_, i) => (ateneoConsultCounts[i] ?? 0) > 0);
  const ateneoLeido = leyo.filter(Boolean).length;

  // Contraste: leyó, en ese dilema, a un pensador de una corriente distinta de la que después eligió.
  const contraste = decisions.filter((d, i) =>
    (ateneoLeidos[i] ?? []).some(id => {
      const p = philosophers.find(x => x.id === id);
      return !!p && p.philosophy !== d.philosophy;
    }),
  ).length;

  const cuenta = new Map<PhilosophyKey, number>();
  for (const d of decisions) cuenta.set(d.philosophy, (cuenta.get(d.philosophy) ?? 0) + 1);
  const corrientes = cuenta.size;
  const masElegida = [...cuenta.entries()].sort((a, b) => b[1] - a[1])[0];
  const dominante = masElegida ? { key: masElegida[0], pct: Math.round((masElegida[1] / total) * 100) } : null;

  const dedicacion: string[] = [];
  const exploracion: string[] = [];
  if (total > 0) {
    dedicacion.push(`Se detuvo 20 s o más en ${detenidos} de ${total} ${plural(total, 'dilema', 'dilemas')}.`);
    if (apurados > 0) dedicacion.push(`Resolvió en menos de 4 s ${apurados} de ${total} ${plural(total, 'dilema', 'dilemas')}.`);
    dedicacion.push(
      ateneoLeido > 0
        ? `Leyó el Ateneo en ${ateneoLeido} de ${total} ${plural(total, 'dilema', 'dilemas')}.`
        : 'No leyó el Ateneo en ningún dilema.',
    );
    if (ateneoLeido > 0) {
      dedicacion.push(`En ${contraste} de ellos leyó a alguien de una corriente distinta de la que después eligió.`);
    }
    exploracion.push(`Eligió opciones de ${corrientes} de ${TOTAL_CORRIENTES} corrientes.`);
    if (dominante) exploracion.push(`La que más eligió: ${PHILO_LABELS[dominante.key] ?? dominante.key} (${dominante.pct} %).`);
  }

  // "Most deliberated" = longest time, with a bonus per Ateneo consult, so a
  // well-considered-but-quick decision can still surface.
  const topDeliberated: DeliberatedEntry[] = decisions
    .map((d, i) => ({
      title: events[i]?.title ?? `Dilema ${i + 1}`,
      philosophy: d.philosophy,
      optionText: d.text,
      seconds: Math.round(seconds[i] ?? 0),
      ateneoCount: ateneoConsultCounts[i] ?? 0,
    }))
    .sort((a, b) => (b.seconds + b.ateneoCount * 30) - (a.seconds + a.ateneoCount * 30))
    .slice(0, 3);

  return { total, detenidos, apurados, ateneoLeido, contraste, corrientes, dominante, dedicacion, exploracion, topDeliberated };
}
