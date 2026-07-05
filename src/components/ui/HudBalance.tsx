interface HudBalanceProps {
  current: number;
  total: number;
  balance: number; // 0..100, neutral = 50
  onExit: () => void;
}

export function HudBalance({ current, total, balance, onExit }: HudBalanceProps) {
  // Mirrors updateHud(): deviation from 50 drives which half fills and by how much.
  const deviation = balance - 50;
  const leftPct = deviation < 0 ? Math.abs(deviation) * 2 : 0;
  const rightPct = deviation > 0 ? deviation * 2 : 0;
  const pctLeft = deviation < 0 ? 50 - leftPct / 2 : deviation > 0 ? 50 + rightPct / 2 : 50;
  const pctText = deviation === 0 ? '' : deviation < 0 ? `${Math.round(leftPct)}%` : `+${Math.round(rightPct)}%`;
  const pctColor = deviation < 0 ? 'rgba(192,57,43,.7)' : 'rgba(39,174,96,.7)';

  return (
    <div className="hud">
      <div className="hud-top">
        <span className="hud-prog">Evento <span id="hud-count">{current + 1}</span> / {total}</span>
        <button className="hud-exit" onClick={onExit}>☰ Salir</button>
      </div>
      <div className="hud-balance">
        <div className="hud-bal-label doom">☠ Perdición</div>
        <div className="hud-bal-track" id="hud-track" style={{ width: '100%', minWidth: 120 }}>
          <div className="hud-bal-left" style={{ width: `${leftPct}%` }} />
          <div className="hud-bal-right" style={{ width: `${rightPct}%` }} />
          <div className="hud-bal-pct" style={{ left: `${pctLeft}%`, color: pctColor }}>{pctText}</div>
        </div>
        <div className="hud-bal-label save">Salvación ✦</div>
      </div>
    </div>
  );
}
