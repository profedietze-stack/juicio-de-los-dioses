import { createContext, useContext, type Dispatch } from 'react';
import type { GameState } from '../types';
import type { Action } from './GameContext';

export interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<Action>;
  toast: { visible: boolean; text: string };
}

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
