import type { ResultSnapshot } from '../../types';
import { PHILO_DATA } from '../../data/philosophies';
import { PHILO_CLS, BORDER_COLOR_VARS } from '../../engine/philosophyDisplay';
import { ALL_PHILO_KEYS } from '../../engine/results';
import { buildSynthesis } from '../../engine/synthesis';
import { fmtTime } from '../../engine/fmtTime';

interface SnapshotDetailModalProps {
  snapshot: ResultSnapshot;
  onClose: () => void;
}

const RANK_LABELS = ['Corriente Dominante', 'Segunda Corriente', 'Tercera Corriente'];

export function SnapshotDetailModal({ snapshot: s, onClose }: SnapshotDetailModalProps) {
  const pcts = s.pcts;
  const ranked = s.ranked;
  const sortedBars = [...ALL_PHILO_KEYS].sort((a, b) => (pcts[b] || 0) - (pcts[a] || 0)).filter(b => (pcts[b] || 0) > 0);
  const synth = buildSynthesis(ranked, pcts);

  return (
    <div
      id="saved-modal"
      className="open"
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.88)', overflowY: 'auto', padding: '2rem 1rem' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="saved-modal-inner" style={{ maxWidth: 720, margin: '0 auto', background: 'rgba(8,8,20,.98)', border: '1px solid rgba(212,175,55,.3)', padding: '2rem', position: 'relative' }}>
        <button className="saved-modal-close" onClick={onClose}>✕ Cerrar</button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '.3rem' }}>{s.endingIcon || '⚖'}</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.4rem', color: 'var(--gold)', letterSpacing: 2, marginBottom: '.3rem' }}>{s.ending || '—'}</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.65rem', color: 'var(--muted)', letterSpacing: 2 }}>{s.date || '—'}</div>
        </div>

        <div style={{ fontStyle: 'italic', fontSize: '.88rem', lineHeight: 1.85, color: 'var(--text)', marginBottom: '1.2rem', borderLeft: '2px solid rgba(212,175,55,.3)', paddingLeft: '1rem' }}>
          {s.narrative}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem', marginBottom: '1.2rem' }}>
          <div className="metric"><div className="metric-label">Veredicto</div><div className="metric-value">{s.score}</div></div>
          <div className="metric"><div className="metric-label">Tiempo</div><div className="metric-value" style={{ fontSize: '1rem' }}>{fmtTime(s.time || 0)}</div></div>
          <div className="metric"><div className="metric-label">Dilemas</div><div className="metric-value">{s.decisions || '—'}</div></div>
          <div className="metric"><div className="metric-label">Corrientes</div><div className="metric-value">{s.diversity || '—'}/10</div></div>
        </div>

        <div className="philo-report-title" style={{ fontFamily: "'Cinzel',serif", fontSize: '.68rem', color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '.8rem' }}>Distribución Filosófica</div>
        <div className="philo-bars" style={{ marginBottom: '1.2rem' }}>
          {sortedBars.map(key => (
            <div className="philo-bar-row" key={key}>
              <div className="philo-bar-head">
                <span className={`philo-bar-name chip ${PHILO_CLS[key]}`}>{PHILO_DATA[key].label}</span>
                <span className="philo-bar-pct">{pcts[key] || 0}%</span>
              </div>
              <div className="philo-bar-track"><div className={`philo-bar-fill ${PHILO_CLS[key]}`} style={{ width: `${pcts[key] || 0}%` }} /></div>
            </div>
          ))}
        </div>

        <div className="philo-triad-header" style={{ fontFamily: "'Cinzel',serif", fontSize: '.68rem', color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '.8rem' }}>Análisis Filosófico Profundo</div>
        {ranked.slice(0, 3).map((key, ri) => {
          if (!key || !pcts[key]) return null;
          const d = PHILO_DATA[key];
          const cls = PHILO_CLS[key];
          const bc = BORDER_COLOR_VARS[cls] || 'var(--gold)';
          return (
            <div className="triad-card" style={{ borderColor: bc, marginBottom: '.7rem' }} key={key}>
              <div className="triad-card-head">
                <span className="triad-rank">{RANK_LABELS[ri]}</span>
                <span className={`chip ${cls}`}>{d.label}</span>
                <span className="triad-pct" style={{ color: bc }}>{pcts[key]}%</span>
              </div>
              <div className="triad-body">{d.long || d.short}</div>
              <div className="triad-authors"><strong>Referentes:</strong> {d.founders}<br /><strong>Tensión:</strong> {d.tension}</div>
            </div>
          );
        })}

        <div style={{ border: '1px solid rgba(212,175,55,.25)', background: 'linear-gradient(135deg,rgba(212,175,55,.04),rgba(100,80,200,.03))', padding: '1.2rem 1.5rem', marginTop: '.5rem' }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.68rem', color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '.65rem' }}>Síntesis de Pensamiento</div>
          <div style={{ fontSize: '.88rem', lineHeight: 1.85, color: 'var(--text)' }} dangerouslySetInnerHTML={{ __html: synth }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontFamily: "'Cinzel',serif", fontSize: '.58rem', color: 'var(--muted)', letterSpacing: 1.5 }}>
          EL JUICIO DE LOS DIOSES · CREADO POR PROFD.
        </div>
      </div>
    </div>
  );
}
