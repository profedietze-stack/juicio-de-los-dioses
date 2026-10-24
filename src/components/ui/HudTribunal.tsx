import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
// o al pasar el mouse, y se cierra con Escape o tocando afuera. El globo sale a un
// portal y se acomoda dentro de la pantalla: las columnas de los costados no lo recortan.
const ANCHO_GLOBO = 210;

function Info({ titulo, definicion, ejemplo }: { titulo: string; definicion: string; ejemplo: string }) {
  const [pos, setPos] = useState<{ left: number; top: number; arriba: boolean } | null>(null);
  // Abierto con un toque o click: no se cierra al sacar el mouse, solo con otro toque, Escape o afuera.
  const [fijo, setFijo] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  const abrir = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const ancho = Math.min(ANCHO_GLOBO, window.innerWidth - 16);
    const left = Math.max(8, Math.min(r.left + r.width / 2 - ancho / 2, window.innerWidth - ancho - 8));
    const arriba = r.top > 150;
    setPos({ left, top: arriba ? r.top - 6 : r.bottom + 6, arriba });
  };

  useEffect(() => {
    if (!pos) return;
    const cerrar = (e: Event) => {
      if (e instanceof KeyboardEvent) { if (e.key === 'Escape') { setPos(null); setFijo(false); } return; }
      if (!ref.current?.contains(e.target as Node)) { setPos(null); setFijo(false); }
    };
    const mover = () => { setPos(null); setFijo(false); };
    document.addEventListener('keydown', cerrar);
    document.addEventListener('pointerdown', cerrar);
    window.addEventListener('scroll', mover, true);
    window.addEventListener('resize', mover);
    return () => {
      document.removeEventListener('keydown', cerrar);
      document.removeEventListener('pointerdown', cerrar);
      window.removeEventListener('scroll', mover, true);
      window.removeEventListener('resize', mover);
    };
  }, [pos]);

  return (
    <span className="tr-info-wrap" ref={ref} onMouseEnter={abrir} onMouseLeave={() => { if (!fijo) setPos(null); }}>
      <button
        type="button" className="tr-info" aria-label={`Qué es ${titulo}`} aria-expanded={pos !== null} aria-controls={id}
        onClick={() => { if (pos && fijo) { setPos(null); setFijo(false); } else { abrir(); setFijo(true); } }}
      >i</button>
      {pos && createPortal(
        <span
          id={id} role="tooltip" className="tr-tip"
          style={{ left: pos.left, top: pos.top, width: Math.min(ANCHO_GLOBO, window.innerWidth - 16), transform: pos.arriba ? 'translateY(-100%)' : undefined }}
        >
          <b>{titulo}</b>
          {definicion}
          <i>Ejemplo: {ejemplo}</i>
        </span>,
        document.body,
      )}
    </span>
  );
}

function Platillo({ pan, pesa }: { pan: PanKey; pesa: boolean }) {
  const p = PANES[pan];
  return (
    <div className={`tr-pl ${pesa ? 'hi' : 'lo'}`} data-pan={pan}>
      <b>{p.nombre}<Info titulo={p.nombre} definicion={p.definicion} ejemplo={p.ejemplo} /></b>
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
        <Platillo pan={b.izq} pesa={pesaIzq} />
        <Platillo pan={b.der} pesa={pesaDer} />
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

function sentidoDe(b: EstadoBalanza): string {
  return b.inclinacion === 'equilibrio' ? 'en equilibrio' : `pesa más ${PANES[b.inclinacion === 'izq' ? b.izq : b.der].nombre}`;
}

// Version de bolsillo de una balanza: solo el brazo inclinado, para ver de un vistazo hacia donde pesa.
function MiniBalanza({ b }: { b: EstadoBalanza }) {
  const tilt = Math.max(-1, Math.min(1, b.dif / DIF_MAXIMA));
  return (
    <span className="tr-mini" data-par={`${b.izq}-${b.der}`} title={`${PANES[b.izq].nombre} y ${PANES[b.der].nombre}: ${sentidoDe(b)}`}>
      <svg viewBox="0 0 44 24" role="img" aria-label={`${PANES[b.izq].nombre} y ${PANES[b.der].nombre}: ${sentidoDe(b)}`}>
        <line x1="22" y1="8" x2="22" y2="21" className="tr-mini-poste" />
        <line x1="6" y1="8" x2="38" y2="8" className="tr-mini-brazo" style={{ transform: `rotate(${tilt * 22}deg)`, transformOrigin: '22px 8px' }} />
        <circle cx="22" cy="8" r="2.5" className="tr-mini-eje" />
      </svg>
      <small>{PANES[b.izq].nombre.split(' ')[0]}·{PANES[b.der].nombre.split(' ')[0]}</small>
    </span>
  );
}

export function HudTribunal({ current, total, tribunal, onExit }: HudTribunalProps) {
  // Entero en el primer dilema, para conocerlo; despues, una barra que no le quita la pantalla al dilema.
  const [abierto, setAbierto] = useState(current === 0);
  const yaPlegado = useRef(current > 0);
  useEffect(() => {
    if (current > 0 && !yaPlegado.current) { yaPlegado.current = true; setAbierto(false); }
  }, [current]);
  const umbral = umbralCondena(total);
  const sombra = sombraTotal(tribunal);
  const llenado = Math.min(100, (sombra / umbral) * 100);
  return (
    <>
      <div className="hud-top-sticky hud-stack">
        <div className="hud-fila">
          <span className="hud-prog">Evento <span id="hud-count">{current + 1}</span> / {total}</span>
          <button className="hud-exit" onClick={onExit}>☰ Salir</button>
          <span className="hud-titulo">⚖ Tribunal</span>
        </div>
        <div className="tr-compact">
          {balanzas(tribunal).map(b => <MiniBalanza key={b.izq} b={b} />)}
          <span className="tr-mini-sombra" data-cerca={sombra / umbral >= 0.85}>
            <span className="tr-mini-barra" role="meter" aria-label="La Sombra" aria-valuemin={0} aria-valuemax={umbral} aria-valuenow={Math.min(sombra, umbral)}>
              <span className="tr-mini-relleno" style={{ width: `${llenado}%` }} />
            </span>
            <small>Sombra {sombra}/{umbral}</small>
          </span>
          <button
            type="button" className="tr-toggle" aria-expanded={abierto} aria-controls="tribunal"
            aria-label={abierto ? 'Ocultar el Tribunal' : 'Ver el Tribunal'}
            onClick={() => setAbierto(a => !a)}
          >
            <span className="tr-toggle-largo">{abierto ? 'Ocultar el Tribunal ▴' : 'Ver el Tribunal ▾'}</span>
            <span className="tr-toggle-corto" aria-hidden="true">⚖ {abierto ? '▴' : '▾'}</span>
          </button>
        </div>
      </div>
      {abierto && <Tribunal tribunal={tribunal} total={total} />}
    </>
  );
}
