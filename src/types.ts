export type PhilosophyKey =
  | 'utilitarismo' | 'deontologia' | 'nihilismo' | 'virtuosismo'
  | 'existencialismo' | 'estoicismo' | 'pragmatismo' | 'contractualismo'
  | 'feminismo' | 'budismo';

export interface DilemmaOption {
  text: string;
  impact: number;
  philosophy: PhilosophyKey;
}

export interface Dilemma {
  id: number;
  title: string;
  quote: string;
  description: string;
  options: DilemmaOption[];
}

export interface PhilosophyInfo {
  label: string;
  cls: string;
  founders: string;
  short: string;
  long: string;
  tension: string;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  condition: string;
}

export interface Ending {
  icon: string;
  title: string;
  narrative: string;
}

export interface EventTheme {
  label: string;
  fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

export interface HistoryRecord {
  score: number;
  time: number;
  ending: string;
  endingKey: string;
  dominant: PhilosophyKey;
  pcts: Partial<Record<PhilosophyKey, number>>;
  counts: Partial<Record<PhilosophyKey, number>>;
  diversity: number;
  date: string;
  dateISO: string;
  engagementIndex?: number;
}

// One of the up-to-3 dilemmas a player spent the most time on (or consulted
// the Ateneo for) in a session — shown to the teacher as concrete material
// for discussion, not as a "right/wrong" data point.
export interface DeliberatedEntry {
  title: string;
  philosophy: PhilosophyKey;
  optionText: string;
  seconds: number;
  ateneoCount: number;
}

export interface ResultSnapshot {
  id: string;
  date: string;
  score: number;
  time: number;
  ending: string;
  endingIcon: string;
  dominant: PhilosophyKey;
  domLabel: string;
  sec: PhilosophyKey;
  secLabel: string;
  thr: PhilosophyKey;
  thrLabel: string;
  pcts: Partial<Record<PhilosophyKey, number>>;
  ranked: PhilosophyKey[];
  diversity: number;
  narrative: string;
  decisions: number;
  // Optional: absent on snapshots saved before the engagement index existed.
  engagementIndex?: number;
  engagementLabel?: string;
  topDeliberated?: DeliberatedEntry[];
}

export type Screen = 'menu' | 'intro' | 'ateneo' | 'event' | 'result' | 'achievements' | 'info' | 'review';

export interface AutosaveData {
  current: number;
  balance: number;
  startTime: number;
  elapsed: number;
  decisions: DilemmaOption[];
  unlocked: string[];
  eventIds: number[];
  // Optional: absent on saves written before the reflective-engagement index
  // existed. Missing values are treated as "no data for those decisions"
  // rather than corrupting/discarding the whole save.
  decisionTimes?: number[];
  // Number of times the Ateneo modal was opened before choosing each
  // decision (0 = never consulted for that dilemma). Renamed from a boolean
  // "consulted at all" flag once consult *frequency* started counting
  // toward the engagement index, not just whether it happened once.
  ateneoConsultCounts?: number[];
}

export interface GameState {
  screen: Screen;
  sessionEvents: Dilemma[];
  current: number;
  balance: number; // 0..100, neutral = 50
  decisions: DilemmaOption[];
  startTime: number | null;
  timerSeconds: number;
  unlocked: string[];
  feedback: DilemmaOption | null;
  pendingLength: number; // number of non-finale dilemmas to draw on the next BEGIN_GAME
  // Reflective-engagement tracking: how long each decision took and how many
  // times the Ateneo was consulted before choosing — see engine/engagement.ts.
  dilemmaStartTime: number | null;
  decisionTimes: number[];
  ateneoViewsCurrent: number;
  ateneoConsultCounts: number[];
  hiddenPhilosophy: boolean; // hide the philosophy chip on option cards before choosing
  strictJudge: boolean; // enable the per-dilemma countdown timer
  ateneoSelection: string[]; // philosopher ids chosen for this playthrough (3..6, mandatory)
}
