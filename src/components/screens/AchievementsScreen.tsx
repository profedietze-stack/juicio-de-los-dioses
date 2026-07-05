import { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { SnapshotDetailModal } from '../modals/SnapshotDetailModal';
import { achievements } from '../../data/achievements';
import { getUnlockedAchievements, loadSavedResults, clearProgress } from '../../engine/persistence';
import { computeHistoryStats } from '../../engine/historyStats';
import { PHILO_DATA } from '../../data/philosophies';
import { PHILO_CLS } from '../../engine/philosophyDisplay';
import { fmtTime } from '../../engine/fmtTime';
import { snd } from '../../engine/audio';

const ZONE_COLORS: Record<string, string> = {
  deification: 'var(--gold)', enlightenment: 'rgba(39,174,96,.85)',
  purgatory: 'rgba(58,110,168,.85)', extinction: 'rgba(176,50,50,.85)',
};
function zoneOf(score: number): keyof typeof ZONE_COLORS {
  return score > 80 ? 'deification' : score > 50 ? 'enlightenment' : score > 20 ? 'purgatory' : 'extinction';
}

export function AchievementsScreen() {
  const { dispatch } = useGame();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [openSnapshotIdx, setOpenSnapshotIdx] = useState<number | null>(null);
  const [, forceRefresh] = useState(0);

  const unlocked = getUnlockedAchievements();
  const stats = computeHistoryStats();
  const snapshots = loadSavedResults();

  return (
    <div className="screen achievements-screen active" id="screen-achievements">
      <div className="screen-heading">Galería de Logros</div>
      <div className="ach-grid" id="ach-grid">
        {achievements.map(a => (
          <div className={`ach-card${unlocked.includes(a.id) ? '' : ' locked'}`} key={a.id}>
            <div className="ach-icon">{a.icon}</div>
            <div className="ach-name">{a.name}</div>
            <div className="ach-cond">{a.condition}</div>
          </div>
        ))}
      </div>

      <div className="history-section">
        <div className="history-heading">Estadísticas del Jugador</div>
        <div id="history-list">
          {!stats ? (
            <div className="history-empty">Aún no se registraron partidas.</div>
          ) : (
            <div className="stats-panel">
              <div className="stats-kpi-grid">
                <div className="stats-kpi"><div className="stats-kpi-val">{stats.totalGames}</div><div className="stats-kpi-label">Partidas jugadas</div></div>
                <div className="stats-kpi"><div className="stats-kpi-val">{fmtTime(stats.totalSecs)}</div><div className="stats-kpi-label">Tiempo total</div></div>
                <div className="stats-kpi"><div className="stats-kpi-val">{fmtTime(stats.avgTime)}</div><div className="stats-kpi-label">Tiempo promedio</div></div>
                <div className="stats-kpi"><div className="stats-kpi-val">{stats.avgScore}</div><div className="stats-kpi-label">Veredicto promedio</div></div>
                <div className="stats-kpi"><div className="stats-kpi-val">{stats.bestScore}</div><div className="stats-kpi-label">Mejor veredicto</div></div>
                <div className="stats-kpi"><div className="stats-kpi-val">{stats.worstScore}</div><div className="stats-kpi-label">Veredicto más bajo</div></div>
                <div className="stats-kpi"><div className="stats-kpi-val">{stats.avgDiversity}/10</div><div className="stats-kpi-label">Diversidad filosófica prom.</div></div>
                <div className="stats-kpi">
                  <div className="stats-kpi-val">
                    {stats.topDom ? <span className={`chip ${PHILO_CLS[stats.topDom]}`} style={{ fontSize: '.75rem' }}>{PHILO_DATA[stats.topDom].label}</span> : '—'}
                  </div>
                  <div className="stats-kpi-label">Corriente más frecuente</div>
                </div>
              </div>

              <div className="stats-section-title">Pool de dilemas</div>
              <div className="stats-pool-wrap">
                <div className="stats-pool-bar-row">
                  <span className="stats-pool-label">Sin ver</span>
                  <div className="stats-pool-track" style={{ flexDirection: 'row' }}>
                    <div className="stats-pool-fill stats-pool-fresh" style={{ width: `${100 - stats.freshPct}%` }} />
                    <div className="stats-pool-fill stats-pool-unseen" style={{ width: `${stats.freshPct}%` }} />
                  </div>
                  <span className="stats-pool-counts">{stats.seenCount} vistos · <span style={{ color: 'var(--gold)' }}>{stats.freshCount} nuevos</span> de 79</span>
                </div>
                <div className="stats-pool-meta">
                  Próxima partida: <strong style={{ color: 'var(--gold)' }}>{stats.nextGameFresh} dilemas nuevos</strong>{stats.nextGameRecycled > 0 ? ` + ${stats.nextGameRecycled} revisión` : ''}
                  <span className={`stats-pool-badge${stats.freshCount === 0 ? ' stats-pool-badge-warn' : stats.freshCount < 10 ? ' stats-pool-badge-low' : ''}`}>
                    {stats.freshCount === 0 ? 'Pool completo — reiniciando prioridad' : stats.freshCount < 10 ? 'Casi agotado' : 'Prioridad activa'}
                  </span>
                </div>
              </div>

              {stats.trend.length > 1 && (
                <>
                  <div className="stats-section-title">Tendencia de veredictos (últimas {stats.trend.length} partidas)</div>
                  <div className="stats-trend-wrap">
                    <div className="stats-trend-bars">
                      {stats.trend.map((s, i) => {
                        const zone = zoneOf(s);
                        return (
                          <div className="stats-trend-col" key={i}>
                            <div className="stats-trend-score" style={{ color: ZONE_COLORS[zone] }}>{s}</div>
                            <div className="stats-trend-bar-wrap"><div className="stats-trend-bar" style={{ height: `${s}%`, background: ZONE_COLORS[zone] }} /></div>
                            <div className="stats-trend-num">{stats.trend.length - i}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="stats-trend-legend">
                      <span style={{ color: 'var(--gold)' }}>■ Deificación (81–100)</span>
                      <span style={{ color: 'rgba(39,174,96,.85)' }}>■ Ilustración (51–80)</span>
                      <span style={{ color: 'rgba(58,110,168,.85)' }}>■ Purgatorio (21–50)</span>
                      <span style={{ color: 'rgba(176,50,50,.85)' }}>■ Extinción (0–20)</span>
                    </div>
                  </div>
                </>
              )}

              <div className="stats-section-title">Distribución filosófica acumulada</div>
              <div className="stats-philo-bars">
                {stats.sortedPhilo.filter(k => stats.aggCounts[k] > 0).map(k => {
                  const pct = Math.round(stats.aggCounts[k] / stats.totalDecisions * 100);
                  return (
                    <div className="stats-philo-row" key={k}>
                      <span className={`stats-philo-name chip ${PHILO_CLS[k]}`}>{PHILO_DATA[k].label}</span>
                      <div className="stats-philo-track"><div className={`philo-bar-fill ${PHILO_CLS[k]}`} style={{ width: `${pct}%`, transition: 'width 1s ease' }} /></div>
                      <span className="stats-philo-pct">{pct}% <span style={{ color: 'var(--muted)', fontSize: '.62rem' }}>({stats.aggCounts[k]} elecciones)</span></span>
                    </div>
                  );
                })}
              </div>

              <div className="stats-section-title">Distribución de finales</div>
              <div className="stats-endings-grid">
                {Object.entries(stats.endingCounts).map(([ending, count]) => {
                  const pct = Math.round(count / stats.totalGames * 100);
                  return (
                    <div className="stats-ending-card" key={ending}>
                      <div className="stats-ending-name">{ending}</div>
                      <div className="stats-ending-count">{count}× <span style={{ color: 'var(--muted)', fontSize: '.65rem' }}>({pct}%)</span></div>
                    </div>
                  );
                })}
              </div>

              <div className="stats-section-title">Historial por partida</div>
              <div className="stats-history-list">
                {stats.history.slice(0, 10).map((r, i) => {
                  const domLabel = r.dominant ? PHILO_DATA[r.dominant]?.label || r.dominant : '—';
                  const domCl = r.dominant ? PHILO_CLS[r.dominant] : '';
                  const zone = zoneOf(r.score);
                  return (
                    <div className="history-card" key={i}>
                      <div className="history-num">#{i + 1}</div>
                      <div>
                        <div className="history-title">{r.ending || '—'}</div>
                        <div className="history-philo"><span className={`chip ${domCl}`} style={{ fontSize: '.52rem' }}>{domLabel}</span>{r.diversity ? ` · ${r.diversity}/10 corrientes` : ''}</div>
                      </div>
                      <div className="history-score" style={{ color: ZONE_COLORS[zone] }}>{r.score ?? '—'}<span style={{ fontSize: '.6rem', color: 'var(--muted)' }}> pts</span></div>
                      <div className="history-time">{fmtTime(r.time || 0)}{r.date ? <><br /><span style={{ fontSize: '.55rem', color: 'var(--muted)' }}>{r.date}</span></> : null}</div>
                    </div>
                  );
                })}
              </div>
              <div className="history-total">
                {stats.history.length > 10 ? `Mostrando 10 de ${stats.history.length} partidas · ` : 'Tiempo total acumulado: '}
                {fmtTime(stats.totalSecs)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="saved-results-section">
        <div className="saved-results-title">Informes Guardados</div>
        <div className="saved-results-grid" id="saved-results-grid">
          {!snapshots.length ? (
            <div className="saved-empty">No hay informes guardados. Completá una partida para guardar tu informe filosófico.</div>
          ) : snapshots.map((s, i) => (
            <div className="saved-result-card" key={s.id} onClick={() => setOpenSnapshotIdx(i)}>
              <div className="src-date">{s.date || '—'}</div>
              <div className="src-ending">{s.endingIcon || '⚖'} {s.ending || '—'}</div>
              <div className="src-score">{s.score}<span style={{ fontSize: '.6rem', color: 'var(--muted)' }}> pts</span></div>
              <div className="src-dom"><span className={`chip ${PHILO_CLS[s.dominant] || ''}`} style={{ fontSize: '.52rem' }}>{s.domLabel || s.dominant || '—'}</span></div>
              <div className="src-dom" style={{ marginTop: '.3rem', fontSize: '.6rem' }}>{fmtTime(s.time || 0)} · {s.decisions || '—'} dilemas · {s.diversity || '—'}/10 corrientes</div>
              <button className="src-view-btn" onClick={(e) => { e.stopPropagation(); setOpenSnapshotIdx(i); }}>Ver informe completo →</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', marginTop: '.5rem' }}>
        <Button ghost onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'menu' })}>Volver al Menú</Button>
        <Button danger small sound="danger" onClick={() => setConfirmingClear(true)}>⚠ Borrar progreso y volver a empezar</Button>
      </div>

      {confirmingClear && (
        <ConfirmDialog
          title="Borrar progreso"
          body="¿Borrar todo el progreso guardado? Esta acción no se puede deshacer."
          confirmLabel="Borrar todo"
          cancelLabel="Cancelar"
          onConfirm={() => { clearProgress(); setConfirmingClear(false); forceRefresh(n => n + 1); }}
          onCancel={() => setConfirmingClear(false)}
        />
      )}

      {openSnapshotIdx !== null && snapshots[openSnapshotIdx] && (
        <SnapshotDetailModal snapshot={snapshots[openSnapshotIdx]} onClose={() => { snd('nav'); setOpenSnapshotIdx(null); }} />
      )}
    </div>
  );
}
