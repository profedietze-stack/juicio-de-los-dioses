import { createContext, useContext, useEffect, useReducer, useRef, type Dispatch, type ReactNode } from 'react';
import type { GameState, Dilemma, DilemmaOption } from '../types';
import { eventPool } from '../data/dilemmas';
import { buildNewSession, recordSeenDilemas } from '../engine/poolBuilder';
import { autosave, clearSavedGame, loadSavedGame, hasSavedGame, saveHistory, saveSnapshot, saveUnlockedAchievements } from '../engine/persistence';
import { checkAchievements } from '../engine/achievements';
import { computeResults } from '../engine/results';
import { PHILO_DATA } from '../data/philosophies';

type Action =
  | { type: 'GO_TO_SCREEN'; screen: GameState['screen'] }
  | { type: 'BEGIN_GAME' }
  | { type: 'CONTINUE_GAME' }
  | { type: 'CHOOSE'; option: DilemmaOption }
  | { type: 'ADVANCE_FROM_FEEDBACK' }
  | { type: 'TICK_TIMER' }
  | { type: 'EXIT_TO_MENU' }
  | { type: 'SET_UNLOCKED'; unlocked: string[] };

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
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GO_TO_SCREEN':
      return { ...state, screen: action.screen };

    case 'BEGIN_GAME': {
      // "Comenzar el Juicio" — always starts fresh (clearSavedGame happens as a side effect).
      const sessionEvents = buildNewSession();
      return {
        ...initialState,
        screen: 'event',
        sessionEvents,
        balance: 50,
        startTime: Date.now(),
      };
    }

    case 'CONTINUE_GAME': {
      const saved = loadSavedGame();
      if (!saved) return { ...state, screen: 'intro' };
      const idMap = new Map(eventPool.map(e => [e.id, e]));
      const sessionEvents = saved.eventIds.map(id => idMap.get(id)).filter((e): e is Dilemma => Boolean(e));
      if (!sessionEvents.length) return { ...state, screen: 'intro' };
      return {
        ...initialState,
        screen: 'event',
        sessionEvents,
        current: saved.current || 0,
        balance: saved.balance ?? 50,
        decisions: saved.decisions || [],
        unlocked: saved.unlocked || [],
        startTime: Date.now() - (saved.elapsed || 0) * 1000,
      };
    }

    case 'CHOOSE': {
      const balance = Math.max(0, Math.min(100, state.balance + action.option.impact));
      return {
        ...state,
        balance,
        decisions: [...state.decisions, action.option],
        current: state.current + 1,
        feedback: action.option,
      };
    }

    case 'ADVANCE_FROM_FEEDBACK': {
      if (state.current >= state.sessionEvents.length) {
        return { ...state, screen: 'result', feedback: null };
      }
      return { ...state, feedback: null };
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

const GameContext = createContext<{ state: GameState; dispatch: Dispatch<Action> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const finishedRef = useRef(false);

  // Timer tick while an event is in progress.
  useEffect(() => {
    if (state.screen !== 'event') return;
    const id = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
    return () => clearInterval(id);
  }, [state.screen]);

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
    });
  }, [state.screen, state.current]);

  // On reaching the result screen: compute the ending, persist history +
  // snapshot + achievements + seen-dilemma stamps, exactly once per game.
  useEffect(() => {
    if (state.screen !== 'result' || finishedRef.current) return;
    finishedRef.current = true;
    clearSavedGame();

    const totalTime = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
    const r = computeResults(state.decisions, state.balance, totalTime);
    const unlocked = checkAchievements({ score: r.score, time: totalTime, decisions: state.decisions });
    dispatch({ type: 'SET_UNLOCKED', unlocked });
    saveUnlockedAchievements(unlocked);

    const date = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
    saveHistory({
      score: r.score, time: totalTime, ending: r.ending.title, endingKey: r.endingKey,
      dominant: r.dom, pcts: r.pcts, counts: r.counts, diversity: r.diversity,
      date, dateISO: new Date().toISOString(),
    });
    saveSnapshot({
      id: 'snap_' + Date.now(), date, score: r.score, time: totalTime,
      ending: r.ending.title, endingIcon: r.ending.icon,
      dominant: r.dom, domLabel: PHILO_DATA[r.dom]?.label || r.dom,
      sec: r.sec, secLabel: PHILO_DATA[r.sec]?.label || r.sec,
      thr: r.thr, thrLabel: PHILO_DATA[r.thr]?.label || r.thr,
      pcts: r.pcts, ranked: r.ranked, diversity: r.diversity,
      narrative: r.ending.narrative, decisions: state.decisions.length,
    });
    recordSeenDilemas(state.sessionEvents);
  }, [state.screen]);

  // Reset the "finished" guard whenever a new game starts.
  useEffect(() => {
    if (state.screen === 'event' && state.current === 0) finishedRef.current = false;
  }, [state.screen, state.current, state.sessionEvents]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}

export { hasSavedGame };
