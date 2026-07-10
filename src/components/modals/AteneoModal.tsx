import { philosophers } from '../../data/philosophers';
import { ateneoComments } from '../../data/ateneoComments';

interface AteneoModalProps {
  dilemmaId: number;
  selection: string[];
  onClose: () => void;
}

export function AteneoModal({ dilemmaId, selection, onClose }: AteneoModalProps) {
  const comments = ateneoComments[dilemmaId] ?? {};
  const shown = philosophers.filter(p => selection.includes(p.id) && comments[p.id]);

  return (
    <div
      id="ateneo-modal"
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
                <div className="ateneo-modal-comment">{comments[p.id]}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: '.5rem', alignSelf: 'center' }} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
