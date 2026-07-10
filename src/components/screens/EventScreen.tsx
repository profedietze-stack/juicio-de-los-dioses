import { useEffect, useState } from 'react';
import { useGame } from '../../state/GameContext';
import { wrapTerms } from '../../engine/wrapTerms';
import { getEventImg, getEventThemeLabel } from '../../engine/canvasRenderer';
import { HudBalance } from '../ui/HudBalance';
import { PHILO_LABELS, PHILO_CLS } from '../../engine/philosophyDisplay';
import { PHILO_DATA } from '../../data/philosophies';
import { ROMAN_NUMERALS } from '../../engine/romanNumerals';
import { snd } from '../../engine/audio';
import type { DilemmaOption } from '../../types';

const STRICT_JUDGE_SECONDS = 20;

export function EventScreen() {
  const { state, dispatch } = useGame();
  const ev = state.sessionEvents[state.current];
  const [timeLeft, setTimeLeft] = useState(STRICT_JUDGE_SECONDS);
  const [imgLoaded, setImgLoaded] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setImgLoaded(false);
    const main = document.getElementById('main');
    if (main) main.scrollTop = 0;
  }, [state.current]);

  // Countdown for Juez Estricto: resets on each new dilemma and stops once
  // feedback is showing.
  useEffect(() => {
    if (!state.strictJudge || state.feedback || !ev) return;
    setTimeLeft(STRICT_JUDGE_SECONDS);
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.strictJudge, state.current, state.feedback]);

  // Auto-pick a random option once the countdown reaches zero.
  useEffect(() => {
    if (!state.strictJudge || state.feedback || !ev || timeLeft > 0) return;
    const random = ev.options[Math.floor(Math.random() * ev.options.length)];
    dispatch({ type: 'CHOOSE_TIMEOUT', option: random });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (!ev) return null;

  const isFinale = ev.id === 60;

  return (
    <div className="screen event-screen active" id="screen-event">
      <HudBalance
        current={state.current}
        total={state.sessionEvents.length}
        balance={state.balance}
        onExit={() => { snd('nav'); dispatch({ type: 'EXIT_TO_MENU' }); }}
      />
      <div className="ev-img-wrap" id="ev-img-wrap">
        <img
          id="ev-img"
          className={imgLoaded ? 'ev-img-loaded' : ''}
          src={getEventImg(ev.id)}
          alt={getEventThemeLabel(ev.id)}
          aria-hidden="true"
          loading="eager"
          onLoad={() => setImgLoaded(true)}
        />
        <div className="ev-img-veil" />
      </div>
      <div className="event-body fade-up" id="event-body">
        <div className="event-meta">
          <div className="event-num" id="ev-num">Dilema {ROMAN_NUMERALS[state.current] || state.current + 1}</div>
          <div className="event-meta-line" />
        </div>
        <div className="event-title" id="ev-title">{ev.title}</div>
        <div className="event-quote" id="ev-quote" dangerouslySetInnerHTML={{ __html: wrapTerms(`"${ev.quote}"`) }} />
        <div className="event-desc" id="ev-desc" dangerouslySetInnerHTML={{ __html: wrapTerms(ev.description) }} />

        {!state.feedback ? (
          <>
            <div className="verdict-prompt" id="verdict-prompt">
              {isFinale ? '— El veredicto definitivo de la humanidad —' : '— Pronuncia tu veredicto —'}
            </div>
            {state.strictJudge && (
              <div className="strict-timer" data-warn={timeLeft <= 5}>⏱ {timeLeft}s</div>
            )}
            <div className={`options-grid ${ev.options.length > 4 ? 'many' : ''}`} id="opts">
              {ev.options.map((opt, i) => (
                <div
                  key={i}
                  className="option-card"
                  data-p={opt.philosophy}
                  onClick={() => { snd('choose'); dispatch({ type: 'CHOOSE', option: opt }); }}
                >
                  {!state.hiddenPhilosophy && (
                    <div className="option-tag">{PHILO_LABELS[opt.philosophy] || opt.philosophy}</div>
                  )}
                  <div className="option-text" dangerouslySetInnerHTML={{ __html: wrapTerms(opt.text) }} />
                  <div className="option-arrow">→</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <FeedbackPanel
            option={state.feedback}
            isLast={state.current + 1 >= state.sessionEvents.length}
            onAdvance={() => { snd('nav'); dispatch({ type: 'ADVANCE_FROM_FEEDBACK' }); }}
          />
        )}
      </div>
    </div>
  );
}

function FeedbackPanel({ option, isLast, onAdvance }: { option: DilemmaOption; isLast: boolean; onAdvance: () => void }) {
  const pdata = PHILO_DATA[option.philosophy];
  const cls = PHILO_CLS[option.philosophy];
  const fpCls = `fp-${cls}`;
  const impactVal = option.impact;
  const impactSign = impactVal > 0 ? '+' : '';
  const impactCls = impactVal > 0 ? 'fb-impact-pos' : impactVal < 0 ? 'fb-impact-neg' : 'fb-impact-neu';
  const balanceLabel = impactVal > 0
    ? 'La balanza se inclina hacia la Salvación'
    : impactVal < 0 ? 'La balanza se inclina hacia la Perdición' : 'La balanza permanece en equilibrio';
  const btnLabel = isLast ? 'Ver el Veredicto Final →' : 'Continuar →';

  return (
    <div className={`feedback-panel ${fpCls}`} id="feedback-panel">
      <div className="fb-header">
        <span className={`chip ${cls}`} style={{ fontSize: '.62rem' }}>{pdata.label}</span>
        <span className="fb-verdict-label">Tu posición filosófica</span>
      </div>

      <div className="fb-chosen-text" style={{ color: `var(--${cls})` }}>{option.text}</div>

      <div className="fb-divider" />

      <div>
        <div className="fb-section-label">Argumento central de esta corriente</div>
        <div className="fb-argument">{pdata.short}</div>
        <div className="fb-founders">{pdata.founders}</div>
      </div>

      <div>
        <div className="fb-section-label">Desarrollo filosófico</div>
        <div className="fb-argument">{pdata.long}</div>
      </div>

      <div>
        <div className="fb-section-label">Tensión interna de esta posición</div>
        <div className="fb-tension">{pdata.tension}</div>
      </div>

      <div className="fb-divider" />

      <div className="fb-impact">
        <span className={`fb-impact-val ${impactCls}`}>{impactSign}{impactVal}</span>
        <span style={{ color: 'var(--muted)' }}>{balanceLabel}</span>
      </div>

      <div className="fb-continue-row">
        <button className={`fb-continue ${fpCls}`} onClick={onAdvance}>{btnLabel}</button>
      </div>
    </div>
  );
}
