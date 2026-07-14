import { useGame } from '../../state/GameContext';
import { Button } from '../ui/Button';
import { computeResults, ALL_PHILO_KEYS } from '../../engine/results';
import { computeEngagement } from '../../engine/engagement';
import { buildSynthesis } from '../../engine/synthesis';
import { PHILO_DATA } from '../../data/philosophies';
import { PHILO_LABELS, PHILO_CLS, BORDER_COLOR_VARS } from '../../engine/philosophyDisplay';
import { achievements } from '../../data/achievements';
import { fmtTime } from '../../engine/fmtTime';
import { downloadShareCard } from '../../engine/shareCard';
import { topPhilosophies } from '../../engine/historyStats';
import { useState } from 'react';

export function ResultScreen() {
  const { state, dispatch } = useGame();
  const [saved, setSaved] = useState(false);
  const r = computeResults(state.decisions, state.balance, state.timerSeconds);
  const engagement = computeEngagement(
    state.sessionEvents, state.decisions, state.decisionTimes,
    state.ateneoConsultCounts, state.ateneoSelection.length, r.diversity,
  );

  const rankLabels = ['Corriente Dominante', 'Segunda Corriente', 'Tercera Corriente'];
  const barsSorted = [...ALL_PHILO_KEYS].sort((a, b) => (r.pcts[b] || 0) - (r.pcts[a] || 0)).filter(k => r.pcts[k] > 0);
  const lastAchievementId = state.unlocked[state.unlocked.length - 1];
  const lastAchievement = achievements.find(a => a.id === lastAchievementId);
  const synthesis = buildSynthesis(r.ranked, r.pcts);

  return (
    <div className="screen result-screen active" id="screen-result">
      <div className="result-icon" id="r-icon">{r.ending.icon}</div>
      <div className="result-title" id="r-title">{r.ending.title}</div>

      <div className="result-card">
        <div className="result-narrative" id="r-narrative">{r.ending.narrative}</div>
      </div>

      <div className="result-metrics">
        <div className="metric"><div className="metric-label">Veredicto</div><div className="metric-value" id="r-score">{r.score}</div></div>
        <div className="metric"><div className="metric-label">Tiempo</div><div className="metric-value" id="r-time">{fmtTime(r.totalTime)}</div></div>
        <div className="metric"><div className="metric-label">Dilemas</div><div className="metric-value" id="r-total">{r.totalDecisions}</div></div>
        <div className="metric"><div className="metric-label">Corrientes</div><div className="metric-value" id="r-diversity">{r.diversity}/10</div></div>
      </div>

      <div className="philo-report">
        <div className="philo-report-title">Distribución Filosófica</div>
        <div className="philo-bars" id="philo-bars">
          {barsSorted.map(key => (
            <div className="philo-bar-row" key={key}>
              <div className="philo-bar-head">
                <span className={`philo-bar-name chip ${PHILO_CLS[key]}`}>{PHILO_LABELS[key]}</span>
                <span className="philo-bar-pct">{r.pcts[key]}%</span>
              </div>
              <div className="philo-bar-track">
                <div className={`philo-bar-fill ${PHILO_CLS[key]}`} style={{ width: `${r.pcts[key]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="philo-triad">
        <div className="philo-triad-header">Análisis Filosófico Profundo</div>
        <div id="triad-cards">
          {[r.dom, r.sec, r.thr].map((key, ri) => {
            if (!key || !r.pcts[key]) return null;
            const d = PHILO_DATA[key];
            const cls = PHILO_CLS[key];
            const bc = BORDER_COLOR_VARS[cls] || 'var(--gold)';
            return (
              <div className="triad-card" style={{ borderColor: bc, marginBottom: '.7rem' }} key={key}>
                <div className="triad-card-head">
                  <span className="triad-rank">{rankLabels[ri]}</span>
                  <span className={`chip ${cls}`}>{d.label}</span>
                  <span className="triad-pct" style={{ color: bc }}>{r.pcts[key]}%</span>
                </div>
                <div className="triad-body">{d.long || d.short}</div>
                <div className="triad-authors">
                  <strong>Referentes filosóficos:</strong> {d.founders}<br />
                  <strong>Tensión interna:</strong> {d.tension}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="philo-synthesis">
        <div className="philo-synthesis-title">Síntesis de Pensamiento</div>
        <div className="philo-synthesis-text" id="philo-text" dangerouslySetInnerHTML={{ __html: synthesis }} />
      </div>

      <div className="engagement-disclaimer" id="engagement-disclaimer">
        ⚠ Este índice <strong>no mide si las decisiones fueron "correctas"</strong> — ninguna lo es.
        Mide el <strong>grado de reflexión</strong> con que se atravesó el juego: tiempo dedicado a
        pensar, uso de las herramientas de consulta filosófica y amplitud de perspectivas exploradas.
        Es un insumo para el diálogo docente-estudiante, no una calificación.
      </div>

      <div className="philo-report" id="engagement-report">
        <div className="philo-report-title">Índice de Compromiso Reflexivo</div>
        <div className="engagement-header">
          <span className="engagement-index" id="engagement-index">{engagement.index}/100</span>
          <span className="engagement-label" id="engagement-label">{engagement.label}</span>
        </div>
        <div className="philo-bars">
          <div className="philo-bar-row">
            <div className="philo-bar-head">
              <span className="philo-bar-name chip">Tiempo de reflexión</span>
              <span className="philo-bar-pct">{engagement.timeScore}%</span>
            </div>
            <div className="philo-bar-track"><div className="philo-bar-fill chip" style={{ width: `${engagement.timeScore}%` }} /></div>
          </div>
          <div className="philo-bar-row">
            <div className="philo-bar-head">
              <span className="philo-bar-name chip">Diversidad filosófica</span>
              <span className="philo-bar-pct">{engagement.diversityScore}%</span>
            </div>
            <div className="philo-bar-track"><div className="philo-bar-fill chip" style={{ width: `${engagement.diversityScore}%` }} /></div>
          </div>
          <div className="philo-bar-row">
            <div className="philo-bar-head">
              <span className="philo-bar-name chip">Amplitud del Ateneo elegido</span>
              <span className="philo-bar-pct">{engagement.selectionScore}%</span>
            </div>
            <div className="philo-bar-track"><div className="philo-bar-fill chip" style={{ width: `${engagement.selectionScore}%` }} /></div>
          </div>
          <div className="philo-bar-row">
            <div className="philo-bar-head">
              <span className="philo-bar-name chip">Consultas al Ateneo</span>
              <span className="philo-bar-pct">{engagement.ateneoScore}%</span>
            </div>
            <div className="philo-bar-track"><div className="philo-bar-fill chip" style={{ width: `${engagement.ateneoScore}%` }} /></div>
          </div>
        </div>

        {engagement.topDeliberated.length > 0 && (
          <div className="engagement-deliberated" id="engagement-deliberated">
            <div className="engagement-deliberated-title">Dilemas más deliberados — insumo para la rúbrica de evaluación</div>
            {engagement.topDeliberated.map((d, i) => (
              <div className="engagement-deliberated-item" key={i}>
                <div className="engagement-deliberated-item-title">{d.title}</div>
                <div className="engagement-deliberated-item-meta">
                  <span className={`chip ${PHILO_CLS[d.philosophy]}`}>{PHILO_LABELS[d.philosophy] || d.philosophy}</span>
                  <span>{d.seconds}s reflexionando</span>
                  {d.ateneoCount > 0 && <span>🏛 consultó el Ateneo {d.ateneoCount > 1 ? `${d.ateneoCount} veces` : '1 vez'}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lastAchievement && (
        <div className="result-achievement" id="r-ach">
          <div className="ach-label">🏆 Logro Desbloqueado</div>
          <div id="r-ach-body" style={{ color: 'var(--text)', fontSize: '.85rem' }}>
            {lastAchievement.icon} <strong>{lastAchievement.name}</strong> — {lastAchievement.condition}
          </div>
        </div>
      )}

      <div className="btn-group" style={{ marginTop: '.5rem' }}>
        <Button sound="start" onClick={() => dispatch({ type: 'BEGIN_GAME' })}>Nuevo Juicio</Button>
        <Button ghost onClick={() => setSaved(true)}>{saved ? 'Informe guardado ✓' : 'Guardar Informe'}</Button>
        <Button ghost onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'review' })}>Modo Repaso</Button>
        <Button
          ghost
          onClick={() => downloadShareCard({ icon: r.ending.icon, title: r.ending.title, score: r.score, top: topPhilosophies(r.pcts) })}
        >
          Compartir Resultado
        </Button>
        <Button ghost onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'menu' })}>Menú Principal</Button>
      </div>
    </div>
  );
}
