import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../state/GameContext';
import { wrapTerms } from '../../engine/wrapTerms';
import { getEventImg, getEventThemeLabel } from '../../engine/canvasRenderer';
import { HudTribunal } from '../ui/HudTribunal';
import { ChipsEfectos } from '../ui/ChipsEfectos';
import { PHILO_LABELS, PHILO_CLS } from '../../engine/philosophyDisplay';
import { PHILO_DATA } from '../../data/philosophies';
import { ROMAN_NUMERALS } from '../../engine/romanNumerals';
import { snd } from '../../engine/audio';
import { ATENEO_LECTURA_MIN_MS } from '../../engine/engagement';
import { filosofoDestacado, nombreCorto, opinionesDelAteneo } from '../../engine/ateneo';
import { philosophers } from '../../data/philosophers';
import { AteneoModal } from '../modals/AteneoModal';
import type { DilemmaOption } from '../../types';

const STRICT_JUDGE_SECONDS = 20;

export function EventScreen() {
  const { state, dispatch } = useGame();
  const ev = state.sessionEvents[state.current];
  const [timeLeft, setTimeLeft] = useState(STRICT_JUDGE_SECONDS);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showAteneo, setShowAteneo] = useState(false);
  const ateneoAbiertoEn = useRef(0);
  const cerrarAteneo = () => {
    if (Date.now() - ateneoAbiertoEn.current >= ATENEO_LECTURA_MIN_MS) dispatch({ type: 'ATENEO_VIEWED' });
    setShowAteneo(false);
  };

  useEffect(() => {
    setImgLoaded(false);
    const main = document.getElementById('main');
    if (main) main.scrollTop = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.current]);

  // Countdown for Juez Estricto: resets on each new dilemma and stops once
  // feedback is showing.
  useEffect(() => {
    if (state.strictJudge) setTimeLeft(STRICT_JUDGE_SECONDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.strictJudge, state.current]);

  // Con el Ateneo abierto el reloj espera: leerlo no puede costarle el dilema al alumno.
  useEffect(() => {
    if (!state.strictJudge || state.feedback || !ev || showAteneo) return;
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.strictJudge, state.current, state.feedback, showAteneo]);

  // Auto-pick a random option once the countdown reaches zero.
  useEffect(() => {
    if (!state.strictJudge || state.feedback || !ev || timeLeft > 0) return;
    const random = ev.options[Math.floor(Math.random() * ev.options.length)];
    dispatch({ type: 'CHOOSE_TIMEOUT', option: random });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (!ev) return null;

  const isFinale = ev.id === 60;
  const invitacion = state.ateneoInvitados.find(i => i.en === state.current);
  const invitado = invitacion ? philosophers.find(p => p.id === invitacion.id) : undefined;
  const destacado = filosofoDestacado(state.ateneoSelection, ev.id, state.current, invitacion?.id);
  const yaLeyo = state.ateneoViewsCurrent > 0;
  const elegir = (opt: DilemmaOption) => { snd('choose'); dispatch({ type: 'CHOOSE', option: opt }); };

  return (
    <div className="screen event-screen active" id="screen-event">
      <HudTribunal
        current={state.current}
        total={state.sessionEvents.length}
        tribunal={state.tribunal}
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
      <div className="event-body fade-up" id="event-body" key={state.current}>
        <div className="event-meta">
          <div className="event-num" id="ev-num">Dilema {ROMAN_NUMERALS[state.current] || state.current + 1}</div>
          <div className="event-meta-line" />
        </div>
        <div className="event-title" id="ev-title">{ev.title}</div>
        <div className="event-quote" id="ev-quote" dangerouslySetInnerHTML={{ __html: wrapTerms(`"${ev.quote}"`) }} />
        <div className="event-desc" id="ev-desc" dangerouslySetInnerHTML={{ __html: wrapTerms(ev.description) }} />

        {!state.feedback ? (
          <>
            {invitado && (
              <div className="ateneo-invitado" role="status">
                🏛 <b>{nombreCorto(invitado.name)}</b> se suma al Ateneo: trae una mirada distinta de las que venías eligiendo.
              </div>
            )}
            {destacado && (
              <button
                type="button"
                className={`ateneo-open-btn ${yaLeyo ? 'leido' : ''}`}
                onClick={() => { snd('nav'); ateneoAbiertoEn.current = Date.now(); setShowAteneo(true); }}
              >
                <img src={destacado.portrait} alt="" className="ateneo-aviso-retrato" />
                <span className="ateneo-aviso-texto">
                  {yaLeyo ? (
                    <>🏛 Ya leíste al Ateneo<small>Tocá para volver a abrirlo</small></>
                  ) : (
                    <>🏛 {nombreCorto(destacado.name)} tiene un comentario sobre este dilema<small>Tocá para leer al Ateneo antes de decidir</small></>
                  )}
                </span>
              </button>
            )}
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
                  className="option-card option-enter"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  data-p={opt.philosophy}
                  role="button"
                  tabIndex={0}
                  onClick={() => elegir(opt)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(opt); } }}
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
            seleccion={state.ateneoSelection}
            dilemaId={ev.id}
            isLast={state.current + 1 >= state.sessionEvents.length}
            onAdvance={() => { snd('nav'); dispatch({ type: 'ADVANCE_FROM_FEEDBACK' }); }}
          />
        )}
      </div>
      {showAteneo && (
        <AteneoModal
          dilemmaId={ev.id}
          selection={state.ateneoSelection}
          onClose={cerrarAteneo}
        />
      )}
    </div>
  );
}

function FeedbackPanel({ option, seleccion, dilemaId, isLast, onAdvance }: { option: DilemmaOption; seleccion: string[]; dilemaId: number; isLast: boolean; onAdvance: () => void }) {
  const ateneo = opinionesDelAteneo(seleccion, dilemaId, option);
  const pdata = PHILO_DATA[option.philosophy];
  const cls = PHILO_CLS[option.philosophy];
  const fpCls = `fp-${cls}`;
  // Con teclado, la tarjeta elegida desaparece: el foco pasa al boton de seguir.
  const seguirRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { seguirRef.current?.focus({ preventScroll: true }); }, []);
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

      <div>
        <div className="fb-section-label">Así lo juzgan los dioses</div>
        <ChipsEfectos option={option} />
      </div>

      {(ateneo.coinciden.length > 0 || ateneo.difieren.length > 0) && (
        <div className="fb-ateneo">
          <div className="fb-section-label">Así opinó tu Ateneo</div>
          {ateneo.coinciden.length > 0 && (
            <div className="fb-ateneo-coinciden"><span>Piensa como vos:</span> {ateneo.coinciden.map(p => nombreCorto(p.name)).join(', ')}</div>
          )}
          {ateneo.difieren.length > 0 && (
            <div className="fb-ateneo-difieren"><span>Mira distinto:</span> {ateneo.difieren.map(p => nombreCorto(p.name)).join(', ')}</div>
          )}
        </div>
      )}

      <div className="fb-continue-row">
        <button ref={seguirRef} className={`fb-continue ${fpCls}`} onClick={onAdvance}>{btnLabel}</button>
      </div>
    </div>
  );
}
