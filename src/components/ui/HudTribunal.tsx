import { useEffect, useId, useRef, useState } from 'react';
import type { PanKey, TribunalState, ViceKey } from '../../types';
import { balanzas, sombraTotal, umbralCondena, type EstadoBalanza } from '../../engine/tribunal';
import { VICE_KEYS } from '../../data/tribunal/parser';
import { PANES, VICIOS } from '../../data/tribunalTextos';

interface HudTribunalProps {
  current: number;
  total: number;
  tribunal: TribunalState;
  onExit: () => void;
}

// A partir de esta diferencia entre platillos la balanza llega a su inclinacion maxima.
const DIF_MAXIMA = 6;
const GRADOS_MAXIMOS = 13;
const BRAZO = 62;

// Boton «i» que explica el concepto con palabras simples. Abre al tocar (tablets)
// o al pasar el mouse, y se cierra con Escape o tocando afuera.
function Info({ titulo, definicion, ejemplo, lado = 'centro' }: { titulo: string; definicion: string; ejemplo: string; lado?: 'izq' | 'der' | 'centro' }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: Event) => {
      if (e instanceof KeyboardEvent) { if (e.key === 'Escape') setAbierto(false); return; }
      if (!ref.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('keydown', cerrar);
    document.addEventListener('pointerdown', cerrar);
    return () => { document.removeEventListener('keydown', cerrar); document.removeEventListener('pointerdown', cerrar); };
  }, [abierto]);

  return (
    <span className="tr-info-wrap" ref={ref} onMouseEnter={() => setAbierto(true)} onMouseLeave={() => setAbierto(false)}>
      <button
        type="button" className="tr-info" aria-label={`Qué es ${titulo}`} aria-expanded={abierto} aria-controls={id}
        onClick={() => setAbierto(a => !a)}
      >i</button>
      {abierto && (
        <span id={id} role="tooltip" className={`tr-tip tr-tip-${lado}`}>
          <b>{titulo}</b>
          {definicion}
          <i>Ejemplo: {ejemplo}</i>
        </span>
      )}
    </span>
  );
}

function Platillo({ pan, pesa, lado }: { pan: PanKey; pesa: boolean; lado: 'izq' | 'der' }) {
  const p = PANES[pan];
  return (
    <div className={`tr-pl ${pesa ? 'hi' : 'lo'}`} data-pan={pan}>
      <b>{p.nombre}<Info titulo={p.nombre} definicion={p.definicion} ejemplo={p.ejemplo} lado={lado} /></b>
      <small>{p.definicion}</small>
    </div>
  );
}

export function Balanza({ b }: { b: EstadoBalanza }) {
  const tilt = Math.max(-1, Math.min(1, b.dif / DIF_MAXIMA));
  const grados = tilt * GRADOS_MAXIMOS;
  const dy = BRAZO * Math.sin(grados * Math.PI / 180);
  const pesaIzq = b.inclinacion === 'izq', pesaDer = b.inclinacion === 'der';
  const sentido = b.inclinacion === 'equilibrio' ? 'en equilibrio' : `pesa más ${PANES[b.inclinacion === 'izq' ? b.izq : b.der].nombre}`;
  const platillo = (x: number, dyPan: number, pesa: boolean) => (
    <g className="tr-pan" style={{ transform: `translateY(${dyPan}px)` }}>
      <line x1={x} y1={26} x2={x - 17} y2={60} />
      <line x1={x} y1={26} x2={x + 17} y2={60} />
      <path d={`M${x - 22} 60 Q${x} 76 ${x + 22} 60 Z`} className={pesa ? 'pan-hi' : 'pan-lo'} />
    </g>
  );
  return (
    <div className="tr-card" data-par={`${b.izq}-${b.der}`}>
      <svg viewBox="0 0 200 112" role="img" aria-label={`${PANES[b.izq].nombre} y ${PANES[b.der].nombre}: ${sentido}`}>
        <line className="tr-poste" x1="100" y1="26" x2="100" y2="96" />
        <ellipse className="tr-base" cx="100" cy="98" rx="26" ry="5" />
        <line className="tr-brazo" x1={100 - BRAZO} y1="26" x2={100 + BRAZO} y2="26" style={{ transform: `rotate(${grados}deg)` }} />
        <circle className="tr-eje" cx="100" cy="26" r="5" />
        {platillo(100 - BRAZO, -dy, pesaIzq)}
        {platillo(100 + BRAZO, dy, pesaDer)}
      </svg>
      <div className="tr-pans">
        <Platillo pan={b.izq} pesa={pesaIzq} lado="izq" />
        <Platillo pan={b.der} pesa={pesaDer} lado="der" />
      </div>
    </div>
  );
}

// Las tres balanzas y La Sombra, juntas: lo usan la partida y la pantalla final.
export function Tribunal({ tribunal, total }: { tribunal: TribunalState; total: number }) {
  const umbral = umbralCondena(total);
  const sombra = sombraTotal(tribunal);
  // El umbral queda al 80 % de la barra: se ve cuanto falta y tambien pasarse.
  const llenado = Math.min(100, (sombra / umbral) * 80);
  const cerca = sombra / umbral >= 0.85;

  return (
    <div className="tr-court" id="tribunal">
      {balanzas(tribunal).map(b => <Balanza key={b.izq} b={b} />)}
      <div className="tr-card tr-sombra" data-cerca={cerca}>
        <h4>✦ La Sombra · lo que los dioses reprochan
          <Info
            titulo="La Sombra"
            definicion="Crece con cada decisión que daña, engaña o abandona a alguien. Si llega a la línea de condena, los dioses condenan a la humanidad."
            ejemplo="mentir para evitar un problema suma Corrupción"
          />
        </h4>
        <div className="tr-barra" role="meter" aria-label="La Sombra" aria-valuemin={0} aria-valuemax={umbral} aria-valuenow={Math.min(sombra, umbral)}>
          <div className="tr-relleno" style={{ width: `${llenado}%` }} />
          <div className="tr-marca" />
          <span className="tr-marca-txt">Condena</span>
        </div>
        <div className="tr-vicios">
          {VICE_KEYS.map((k: ViceKey) => {
            const v = VICIOS[k];
            const n = tribunal.vices[k];
            return (
              <span key={k} className={`tr-vicio ${n > 0 ? 'on' : ''}`} data-vicio={k}>
                <span className="tr-vicio-nom">{v.nombre}{n > 0 && <em> {n}</em>}
                  <Info titulo={v.nombre} definicion={v.definicion} ejemplo={v.ejemplo} />
                </span>
                <small>{v.corto}</small>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function HudTribunal({ current, total, tribunal, onExit }: HudTribunalProps) {
  return (
    <>
      <div className="hud-top hud-top-sticky">
        <span className="hud-prog">Evento <span id="hud-count">{current + 1}</span> / {total}</span>
        <button className="hud-exit" onClick={onExit}>☰ Salir</button>
        <span className="hud-titulo">⚖ Tribunal</span>
      </div>
      <Tribunal tribunal={tribunal} total={total} />
    </>
  );
}
