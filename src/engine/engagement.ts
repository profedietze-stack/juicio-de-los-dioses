import type { Dilemma, DilemmaOption, DeliberatedEntry } from '../types';

// This is deliberately NOT a correctness score — no dilemma has a "right"
// option. It measures how reflectively the session was played: time spent
// per decision, how many philosophers were chosen for the Ateneo, how often
// it was actually consulted, and how many distinct philosophical currents
// were explored rather than defaulting to one. See ResultScreen's disclaimer
// copy, which must ship alongside any UI that shows this number.

export const ATENEO_MIN_SELECTION = 3;
export const ATENEO_MAX_SELECTION = 6;

export interface EngagementResult {
  index: number; // 0..100
  label: 'Bajo' | 'Medio' | 'Alto';
  timeScore: number; // 0..100
  selectionScore: number; // 0..100 — breadth of philosophers chosen (3..6)
  ateneoScore: number; // 0..100 — how often the Ateneo was actually consulted
  diversityScore: number; // 0..100
  topDeliberated: DeliberatedEntry[];
}

const IMPULSIVE_THRESHOLD_S = 4;
// A ceiling avoids over-rewarding: sitting on one dilemma for ten minutes
// isn't "more reflective" than ninety seconds — both already read as
// thoughtful, so score them the same instead of chasing an unbounded number.
const REFLECTIVE_CEILING_S = 90;

function timeScoreFor(seconds: number): number {
  if (seconds < IMPULSIVE_THRESHOLD_S) return 0;
  if (seconds >= REFLECTIVE_CEILING_S) return 100;
  return Math.round(((seconds - IMPULSIVE_THRESHOLD_S) / (REFLECTIVE_CEILING_S - IMPULSIVE_THRESHOLD_S)) * 100);
}

// Average consults per dilemma at/above this counts as full credit — beyond
// this, more clicking isn't more reflection, so it doesn't score higher.
const CONSULTS_PER_DILEMMA_FOR_FULL_CREDIT = 2;

export function computeEngagement(
  events: Dilemma[],
  decisions: DilemmaOption[],
  decisionTimesMs: number[],
  ateneoConsultCounts: number[],
  ateneoSelectionCount: number,
  diversity: number,
): EngagementResult {
  const n = decisions.length || 1;
  const seconds = decisions.map((_, i) => Math.max(0, decisionTimesMs[i] ?? 0) / 1000);

  const timeScore = seconds.length
    ? Math.round(seconds.reduce((sum, s) => sum + timeScoreFor(s), 0) / seconds.length)
    : 0;

  const selectionSpan = ATENEO_MAX_SELECTION - ATENEO_MIN_SELECTION;
  const selectionScore = selectionSpan > 0
    ? Math.round(Math.max(0, Math.min(1, (ateneoSelectionCount - ATENEO_MIN_SELECTION) / selectionSpan)) * 100)
    : 100;

  const totalConsults = ateneoConsultCounts.reduce((a, b) => a + b, 0);
  const avgConsultsPerDilemma = totalConsults / n;
  const ateneoScore = Math.round(Math.min(1, avgConsultsPerDilemma / CONSULTS_PER_DILEMMA_FOR_FULL_CREDIT) * 100);

  const diversityScore = Math.round((diversity / 10) * 100);

  const index = Math.round((timeScore + selectionScore + ateneoScore + diversityScore) / 4);
  const label: EngagementResult['label'] = index < 40 ? 'Bajo' : index < 70 ? 'Medio' : 'Alto';

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

  return { index, label, timeScore, selectionScore, ateneoScore, diversityScore, topDeliberated };
}
