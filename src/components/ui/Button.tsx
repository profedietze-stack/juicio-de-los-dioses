import type { ReactNode } from 'react';
import { snd } from '../../engine/audio';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  ghost?: boolean;
  small?: boolean;
  danger?: boolean;
  sound?: 'nav' | 'start' | 'tab' | 'danger';
  className?: string;
  style?: React.CSSProperties;
}

export function Button({ children, onClick, ghost, small, danger, sound = 'nav', className = '', style }: ButtonProps) {
  return (
    <button
      className={`btn ${ghost ? 'btn-ghost' : ''} ${small ? 'btn-sm' : ''} ${danger ? 'btn-danger' : ''} ${className}`.trim()}
      style={style}
      onClick={() => { snd(sound); onClick(); }}
    >
      {children}
    </button>
  );
}
