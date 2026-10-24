import { useState } from 'react';
import { createPortal } from 'react-dom';
import { philosophers } from '../../data/philosophers';
import { ateneoComments } from '../../data/ateneoComments';
import { useModal } from './useModal';
import { primeraFrase } from '../../engine/ateneo';

// Con mas de tres pensadores el modal pasa de un minuto de lectura: cada uno muestra su primera
// frase y el resto se abre a pedido. Con tres o menos se lee todo de corrido.
const MAX_EN_LECTURA_COMPLETA = 3;

interface AteneoModalProps {
  dilemmaId: number;
  selection: string[];
  onClose: () => void;
}

export function AteneoModal({ dilemmaId, selection, onClose }: AteneoModalProps) {
  const modalRef = useModal<HTMLDivElement>(onClose);
  const comments = ateneoComments[dilemmaId] ?? {};
  const shown = philosophers.filter(p => selection.includes(p.id) && comments[p.id]);
  const resumido = shown.length > MAX_EN_LECTURA_COMPLETA;
  const [abiertos, setAbiertos] = useState<string[]>([]);
  const alternar = (id: string) => setAbiertos(a => (a.includes(id) ? a.filter(x => x !== id) : [...a, id]));

  // En <body>: dentro de una pantalla con transform, `fixed` se corre con el scroll.
  return createPortal(
    <div
      id="ateneo-modal"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="El Ateneo opina"
      style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="ateneo-modal-panel fade-up">
        <div className="ateneo-modal-title">🏛 El Ateneo Opina</div>
        <div className="ateneo-modal-list">
          {shown.map(p => (
            <div key={p.id} className="ateneo-modal-entry">
              <img src={p.portrait} alt={p.name} className="ateneo-modal-portrait" />
              <div>
                <div className="ateneo-modal-name">{p.name}</div>
                {(() => {
                  const completo = comments[p.id];
                  const corto = primeraFrase(completo);
                  const abierto = abiertos.includes(p.id);
                  const hayMas = resumido && corto.length < completo.length;
                  return (
                    <>
                      <div className="ateneo-modal-comment">{hayMas && !abierto ? corto : completo}</div>
                      {hayMas && (
                        <button type="button" className="ateneo-leer-mas" aria-expanded={abierto} onClick={() => alternar(p.id)}>
                          {abierto ? 'Leer menos' : 'Leer más'}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: '.5rem', alignSelf: 'center' }} onClick={onClose}>Cerrar</button>
      </div>
    </div>,
    document.body,
  );
}
