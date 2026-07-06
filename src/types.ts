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
}

export type Screen = 'menu' | 'intro' | 'event' | 'result' | 'achievements' | 'info';

export interface AutosaveData {
  current: number;
  balance: number;
  startTime: number;
  elapsed: number;
  decisions: DilemmaOption[];
  unlocked: string[];
  eventIds: number[];
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
}
