import { createContext, useContext, useEffect, useReducer, useRef, useState, type Dispatch, type ReactNode } from 'react';
import type { GameState, Dilemma, DilemmaOption } from '../types';
import { eventPool } from '../data/dilemmas';
import { buildNewSession, recordSeenDilemas, FULL_SESSION_LENGTH } from '../engine/poolBuilder';
import { autosave, clearSavedGame, loadSavedGame, hasSavedGame, saveHistory, saveSnapshot, saveUnlockedAchievements, isStorageAvailable } from '../engine/persistence';
import { checkAchievements } from '../engine/achievements';
import { startMusic, stopMusic } from '../engine/music';
import { computeResults } from '../engine/results';
import { computeEngagement } from '../engine/engagement';
import { PHILO_DATA } from '../data/philosophies';

type Action =
  | { type: 'GO_TO_SCREEN'; screen: GameState['screen'] }
  | { type: 'GO_TO_INTRO'; length: number; hiddenPhilosophy?: boolean; strictJudge?: boolean }
  | { type: 'SET_GAME_MODE'; hiddenPhilosophy?: boolean; strictJudge?: boolean }
  | { type: 'SET_ATENEO_SELECTION'; ids: string[] }
  | { type: 'BEGIN_GAME' }
  | { type: 'CONTINUE_GAME' }
  | { type: 'CHOOSE'; option: DilemmaOption }
  | { type: 'CHOOSE_TIMEOUT'; option: DilemmaOption }
  | { type: 'ATENEO_VIEWED' }
  | { type: 'ADVANCE_FROM_FEEDBACK' }
  | { type: 'TICK_TIMER' }
  | { type: 'EXIT_TO_MENU' }
  | { type: 'SET_UNLOCKED'; unlocked: string[] };

const STRICT_JUDGE_TIMEOUT_PENALTY = 5;

const initialState: GameState = {
  screen: 'menu',
  sessionEvents: [],
  current: 0,
  balance: 50,
  decisions: [],
  startTime: null,
  timerSeconds: 0,
  unlocked: [],
  feedback: null,
  pendingLength: FULL_SESSION_LENGTH,
  hiddenPhilosophy: false,
  strictJudge: false,
  ateneoSelection: [],
  dilemmaStartTime: null,
  decisionTimes: [],
  ateneoViewsCurrent: 0,
  ateneoConsultCounts: [],
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GO_TO_SCREEN':
      return { ...state, screen: action.screen };

    case 'GO_TO_INTRO':
      return {
        ...state,
        screen: 'intro',
        pendingLength: action.length,
        hiddenPhilosophy: action.hiddenPhilosophy ?? false,
        strictJudge: action.strictJudge ?? false,
        ateneoSelection: [],
      };

    case 'SET_GAME_MODE':
      return {
        ...state,
        hiddenPhilosophy: action.hiddenPhilosophy ?? state.hiddenPhilosophy,
        strictJudge: action.strictJudge ?? state.strictJudge,
      };

    case 'SET_ATENEO_SELECTION':
      return { ...state, ateneoSelection: action.ids.slice(0, 6) };

    case 'BEGIN_GAME': {
      // "Comenzar el Juicio" — always starts fresh (clearSavedGame happens as a side effect).
      const sessionEvents = buildNewSession(state.pendingLength);
      return {
        ...initialState,
        screen: 'event',
        sessionEvents,
        balance: 50,
        startTime: Date.now(),
        hiddenPhilosophy: state.hiddenPhilosophy,
        strictJudge: state.strictJudge,
        ateneoSelection: state.ateneoSelection,
        dilemmaStartTime: Date.now(),
      };
    }

    case 'CONTINUE_GAME': {
      const saved = loadSavedGame();
      if (!saved) return { ...state, screen: 'intro' };
      const idMap = new Map(eventPool.map(e => [e.id, e]));
      const sessionEvents = saved.eventIds.map(id => idMap.get(id)).filter((e): e is Dilemma => Boolean(e));
      // If any saved dilema id no longer exists in the current pool (e.g. a
      // content update removed one), `current` and `decisions` were indexed
      // against a session shape that no longer matches — discard the whole
      // save rather than risk misaligning the two.
      const isConsistent = sessionEvents.length === saved.eventIds.length
        && saved.current >= 0 && saved.current < sessionEvents.length;
      if (!isConsistent) {
        clearSavedGame();
        return { ...state, screen: 'intro' };
      }
      return {
        ...initialState,
        screen: 'event',
        sessionEvents,
        current: saved.current,
        balance: saved.balance,
        decisions: saved.decisions,
        unlocked: saved.unlocked,
        startTime: Date.now() - saved.elapsed * 1000,
        // Deliberation time for decisions made before this save point isn't
        // recoverable; pad with 0s so `decisionTimes` stays aligned 1:1 with
        // `decisions` rather than shifting the engagement calc out of sync.
        decisionTimes: saved.decisionTimes ?? saved.decisions.map(() => 0),
        ateneoConsultCounts: saved.ateneoConsultCounts ?? saved.decisions.map(() => 0),
        dilemmaStartTime: Date.now(),
      };
    }

    case 'CHOOSE': {
      // Note: `current` deliberately does NOT advance here. The original
      // keeps showing the just-answered dilemma underneath the feedback
      // panel and only calls loadEvent() again (which reads the advanced
      // index) once the player clicks "Continuar". Advancing `current`
      // immediately would make EventScreen re-render with the *next*
      // dilemma's title/quote/description while the feedback panel still
      // describes the previous choice.
      const balance = Math.max(0, Math.min(100, state.balance + action.option.impact));
      const elapsed = state.dilemmaStartTime ? Date.now() - state.dilemmaStartTime : 0;
      return {
        ...state,
        balance,
        decisions: [...state.decisions, action.option],
        decisionTimes: [...state.decisionTimes, elapsed],
        ateneoConsultCounts: [...state.ateneoConsultCounts, state.ateneoViewsCurrent],
        feedback: action.option,
      };
    }

    case 'CHOOSE_TIMEOUT': {
      // Same as CHOOSE, plus a fixed penalty for letting the clock run out
      // under Juez Estricto mode.
      const balance = Math.max(0, Math.min(100, state.balance + action.option.impact - STRICT_JUDGE_TIMEOUT_PENALTY));
      const elapsed = state.dilemmaStartTime ? Date.now() - state.dilemmaStartTime : 0;
      return {
        ...state,
        balance,
        decisions: [...state.decisions, action.option],
        decisionTimes: [...state.decisionTimes, elapsed],
        ateneoConsultCounts: [...state.ateneoConsultCounts, state.ateneoViewsCurrent],
        feedback: action.option,
      };
    }

    case 'ATENEO_VIEWED':
      return { ...state, ateneoViewsCurrent: state.ateneoViewsCurrent + 1 };

    case 'ADVANCE_FROM_FEEDBACK': {
      const nextCurrent = state.current + 1;
      if (nextCurrent >= state.sessionEvents.length) {
        return { ...state, current: nextCurrent, screen: 'result', feedback: null };
      }
      return { ...state, current: nextCurrent, feedback: null, dilemmaStartTime: Date.now(), ateneoViewsCurrent: 0 };
    }

    case 'TICK_TIMER':
      return { ...state, timerSeconds: state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0 };

    case 'EXIT_TO_MENU':
      return { ...state, screen: 'menu' };

    case 'SET_UNLOCKED':
      return { ...state, unlocked: action.unlocked };

    default:
      return state;
  }
}

const GameContext = createContext<{ state: GameState; dispatch: Dispatch<Action>; toast: { visible: boolean; text: string } } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const finishedRef = useRef(false);
  const [toast, setToast] = useState<{ visible: boolean; text: string }>({ visible: false, text: 'Partida guardada' });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(text: string, duration: number) {
    setToast({ visible: true, text });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), duration);
  }

  // One-time check: if localStorage can't actually be written to (private
  // browsing, full quota), tell the player their progress won't persist.
  useEffect(() => {
    if (!isStorageAvailable()) {
      showToast('No se podrá guardar tu progreso en este navegador.', 5000);
    }
  }, []);

  // Timer tick while an event is in progress.
  useEffect(() => {
    if (state.screen !== 'event') return;
    const id = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
    return () => clearInterval(id);
  }, [state.screen]);

  // One continuous session playlist, independent of which screen is showing
  // — starts once when GameProvider mounts (after the splash screen, see
  // App.tsx) and keeps playing through menu<->game navigation. The engine
  // is idempotent while already playing, so this is a single start, not a
  // per-screen restart.
  useEffect(() => {
    startMusic();
  }, []);

  // Autosave at the beginning of each dilema, skipping the very first
  // (nothing to resume yet) — matches the original's `if (S.current > 0)`.
  useEffect(() => {
    if (state.screen !== 'event' || state.current === 0 || !state.startTime) return;
    autosave({
      current: state.current,
      balance: state.balance,
      startTime: state.startTime,
      elapsed: Math.floor((Date.now() - state.startTime) / 1000),
      decisions: state.decisions,
      unlocked: state.unlocked,
      eventIds: state.sessionEvents.map(e => e.id),
      decisionTimes: state.decisionTimes,
      ateneoConsultCounts: state.ateneoConsultCounts,
    });
    showToast('Partida guardada', 2400);
  }, [state.screen, state.current]);

  // On reaching the result screen: compute the ending, persist history +
  // snapshot + achievements + seen-dilemma stamps, exactly once per game.
  useEffect(() => {
    if (state.screen !== 'result' || finishedRef.current) return;
    finishedRef.current = true;
    clearSavedGame();

    const totalTime = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
    const r = computeResults(state.decisions, state.balance, totalTime);
    const unlocked = checkAchievements({
      score: r.score, time: totalTime, decisions: state.decisions,
      eventIds: state.sessionEvents.map(e => e.id),
    });
    dispatch({ type: 'SET_UNLOCKED', unlocked });
    saveUnlockedAchievements(unlocked);

    const engagement = computeEngagement(
      state.sessionEvents, state.decisions, state.decisionTimes,
      state.ateneoConsultCounts, state.ateneoSelection.length, r.diversity,
    );

    const date = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
    saveHistory({
      score: r.score, time: totalTime, ending: r.ending.title, endingKey: r.endingKey,
      dominant: r.dom, pcts: r.pcts, counts: r.counts, diversity: r.diversity,
      date, dateISO: new Date().toISOString(),
      engagementIndex: engagement.index,
    });
    saveSnapshot({
      id: 'snap_' + Date.now(), date, score: r.score, time: totalTime,
      ending: r.ending.title, endingIcon: r.ending.icon,
      dominant: r.dom, domLabel: PHILO_DATA[r.dom]?.label || r.dom,
      sec: r.sec, secLabel: PHILO_DATA[r.sec]?.label || r.sec,
      thr: r.thr, thrLabel: PHILO_DATA[r.thr]?.label || r.thr,
      pcts: r.pcts, ranked: r.ranked, diversity: r.diversity,
      narrative: r.ending.narrative, decisions: state.decisions.length,
      engagementIndex: engagement.index, engagementLabel: engagement.label,
      topDeliberated: engagement.topDeliberated,
    });
    recordSeenDilemas(state.sessionEvents);
  }, [state.screen]);

  // Reset the "finished" guard whenever a new game starts.
  useEffect(() => {
    if (state.screen === 'event' && state.current === 0) finishedRef.current = false;
  }, [state.screen, state.current, state.sessionEvents]);

  return <GameContext.Provider value={{ state, dispatch, toast }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}

export { hasSavedGame };
