export type PhilosophyKey =
  | 'utilitarismo' | 'deontologia' | 'nihilismo' | 'virtuosismo'
  | 'existencialismo' | 'estoicismo' | 'pragmatismo' | 'contractualismo'
  | 'feminismo' | 'budismo';

// Los seis platillos de las tres balanzas del Tribunal, en pares:
// Felicidad/Justicia, Libertad/Bien comun, Corazon/Razon.
export type PanKey = 'Fel' | 'Jus' | 'Lib' | 'Bien' | 'Cor' | 'Raz';
// Los cuatro vicios de La Sombra: Soberbia, Corrupcion, Crueldad, Indiferencia.
export type ViceKey = 'Sob' | 'Corr' | 'Cru' | 'Ind';

export interface OptionEffects {
  // Ganancia (+) o perdida (-) de cada platillo. Solo figuran los que se mueven.
  pans: Partial<Record<PanKey, number>>;
  // Cuanto alimenta cada vicio (1 a 3). Puede estar vacio.
  vices: Partial<Record<ViceKey, number>>;
}

// Lo que el Tribunal lleva contado en una partida: cuanto pesa cada platillo y
// cuanto se alimento cada vicio. Ver engine/tribunal.ts.
export interface TribunalState {
  pans: Record<PanKey, number>;
  vices: Record<ViceKey, number>;
}

export interface DilemmaOption {
  text: string;
  impact: number;
  philosophy: PhilosophyKey;
  // Efectos en el Tribunal; los agrega src/data/tribunal/aplicar.ts.
  effects?: OptionEffects;
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
  engagementEvidence?: string[]; // frases de Dedicación y Exploración (reemplazan al índice)
  topDeliberated?: DeliberatedEntry[];
}

export type Screen = 'menu' | 'intro' | 'ateneo' | 'event' | 'result' | 'achievements' | 'info' | 'review';

export interface AutosaveData {
  current: number;
  tribunal: TribunalState;
  // Modos y Ateneo de la partida: sin esto, al retomar se perdian.
  hiddenPhilosophy: boolean;
  strictJudge: boolean;
  ateneoSelection: string[];
  ateneoInvitados?: { id: string; en: number }[];
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
  ateneoLeidos?: string[][];
}

export interface GameState {
  screen: Screen;
  sessionEvents: Dilemma[];
  current: number;
  tribunal: TribunalState; // balanzas y Sombra acumuladas
  decisions: DilemmaOption[];
  startTime: number | null;
  timerSeconds: number;
  unlocked: string[];
  feedback: DilemmaOption | null;
  pendingLength: number; // number of non-finale dilemmas to draw on the next BEGIN_GAME
  // Reflective-engagement tracking: how long each decision took and how many
  // times the Ateneo was consulted before choosing — see engine/engagement.ts.
  dilemmaStartTime: number | null;
  dilemmaPausedAt: number | null; // momento en que se ocultó la pestaña; null si está visible
  decisionTimes: number[];
  ateneoViewsCurrent: number;
  ateneoConsultCounts: number[];
  ateneoLeidosCurrent: string[]; // pensadores leídos en el dilema actual
  ateneoLeidos: string[][]; // por dilema ya decidido: ids de los pensadores que leyó
  hiddenPhilosophy: boolean; // hide the philosophy chip on option cards before choosing
  strictJudge: boolean; // enable the per-dilemma countdown timer
  ateneoSelection: string[]; // philosopher ids chosen for this playthrough (3..6, mandatory) + invitados
  ateneoInvitados: { id: string; en: number }[]; // pensadores que el Ateneo sumó solo; en = decisiones al llegar
}
