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
  date: string;
  score: number;
  timeSeconds: number;
  totalEvents: number;
  philosophyCounts: Partial<Record<PhilosophyKey, number>>;
}

export type Screen = 'menu' | 'intro' | 'event' | 'result' | 'achievements' | 'info';

export interface GameState {
  screen: Screen;
  sessionEvents: Dilemma[];
  current: number;
  balance: number;
  choicesLog: { dilemmaId: number; philosophy: PhilosophyKey; impact: number }[];
  startedAt: number | null;
  timerSeconds: number;
  feedback: { option: DilemmaOption } | null;
}
