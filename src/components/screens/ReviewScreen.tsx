import { useGame } from '../../state/GameContext';
import { Button } from '../ui/Button';
import { PHILO_DATA } from '../../data/philosophies';
import { PHILO_CLS } from '../../engine/philosophyDisplay';

// Full playthrough review: one card per dilemma the player faced this game,
// with the option they chose and the philosophical position it represents.
export function ReviewScreen() {
  const { state, dispatch } = useGame();

  return (
    <div className="screen review-screen active" id="screen-review">
      <div className="screen-heading">Modo Repaso</div>
      <div className="review-list">
        {state.sessionEvents.map((ev, i) => {
          const opt = state.decisions[i];
          if (!opt) return null;
          const pdata = PHILO_DATA[opt.philosophy];
          const cls = PHILO_CLS[opt.philosophy];
          return (
            <div className="review-card" key={ev.id}>
              <div className="review-card-num">Dilema {i + 1}</div>
              <div className="review-card-title">{ev.title}</div>
              <div className="review-card-chosen">{opt.text}</div>
              <div className="review-card-foot">
                <span className={`chip ${cls}`} style={{ fontSize: '.6rem' }}>{pdata.label}</span>
                <span className={`review-card-impact ${opt.impact > 0 ? 'fb-impact-pos' : opt.impact < 0 ? 'fb-impact-neg' : 'fb-impact-neu'}`}>
                  {opt.impact > 0 ? '+' : ''}{opt.impact}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <Button ghost onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'result' })} style={{ margin: '.5rem auto 1rem' }}>
        Volver al Veredicto
      </Button>
    </div>
  );
}
