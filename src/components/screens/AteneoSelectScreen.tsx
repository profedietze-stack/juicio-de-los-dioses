import { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { Button } from '../ui/Button';
import { philosophers } from '../../data/philosophers';
import { PHILO_CLS } from '../../engine/philosophyDisplay';
import { snd } from '../../engine/audio';

const MAX_SELECTION = 4;

export function AteneoSelectScreen() {
  const { dispatch } = useGame();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    snd('tab');
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  }

  function start() {
    dispatch({ type: 'SET_ATENEO_SELECTION', ids: selected });
    dispatch({ type: 'BEGIN_GAME' });
  }

  function skip() {
    dispatch({ type: 'SET_ATENEO_SELECTION', ids: [] });
    dispatch({ type: 'BEGIN_GAME' });
  }

  return (
    <div className="screen ateneo-select-screen active" id="screen-ateneo">
      <div className="screen-heading">El Ateneo de los Filósofos</div>
      <div className="ateneo-intro-text">
        Elegí hasta {MAX_SELECTION} pensadores que te acompañen durante el juicio.
        Cuando lo necesites, vas a poder consultar cómo interpretarían el dilema
        que tenés delante.
      </div>
      <div className="ateneo-grid">
        {philosophers.map(p => {
          const isSelected = selected.includes(p.id);
          const disabled = !isSelected && selected.length >= MAX_SELECTION;
          const cls = PHILO_CLS[p.philosophy];
          return (
            <button
              key={p.id}
              type="button"
              className={`ateneo-card ${cls} ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => toggle(p.id)}
              disabled={disabled}
            >
              <img src={p.portrait} alt={p.name} className="ateneo-card-portrait" />
              <div className="ateneo-card-name">{p.name}</div>
              <div className="ateneo-card-meta">{p.years} · {p.civilization}</div>
              <div className="ateneo-card-bio">{p.bio}</div>
              {isSelected && <div className="ateneo-card-check">✓</div>}
            </button>
          );
        })}
      </div>
      <div className="ateneo-footer">
        <Button sound="start" onClick={start}>Comenzar el Juicio</Button>
        <Button ghost small onClick={skip}>Omitir</Button>
      </div>
    </div>
  );
}
