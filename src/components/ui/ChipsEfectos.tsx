import type { DilemmaOption, PanKey, ViceKey } from '../../types';
import { PANES, VICIOS } from '../../data/tribunalTextos';

// Lo que una decision movio en el Tribunal: platillos que suben, que bajan y
// vicios que alimenta. Se usa en el feedback y en el repaso.
export function ChipsEfectos({ option }: { option: DilemmaOption }) {
  const fx = option.effects;
  const pans = fx ? (Object.entries(fx.pans) as [PanKey, number][]) : [];
  const vices = fx ? (Object.entries(fx.vices) as [ViceKey, number][]) : [];
  return (
    <div className="fb-chips">
      {pans.filter(([, n]) => n > 0).map(([k, n]) => (
        <span key={k} className="fb-chip sube">▲ {PANES[k].nombre} +{n}</span>
      ))}
      {pans.filter(([, n]) => n < 0).map(([k, n]) => (
        <span key={k} className="fb-chip baja">▼ {PANES[k].nombre} −{Math.abs(n)}</span>
      ))}
      {vices.map(([k, n]) => (
        <span key={k} className="fb-chip sombra">✦ Sombra +{n} · {VICIOS[k].nombre}</span>
      ))}
      {pans.length === 0 && vices.length === 0 && <span className="fb-ninguno">Esta decisión no movió ninguna balanza.</span>}
    </div>
  );
}
