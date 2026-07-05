import { snd } from '../../engine/audio';

interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Ports showCustomConfirm(): a full-screen overlay confirm dialog.
export function ConfirmDialog({ title, body, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div
      id="custom-confirm"
      style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      onClick={(e) => { if (e.target === e.currentTarget) { onCancel(); } }}
    >
      <div
        className="fade-up"
        style={{ maxWidth: 420, width: '100%', background: 'rgba(10,10,24,.99)', border: '1px solid rgba(212,175,55,.4)', padding: '2rem 1.8rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.98rem', color: 'var(--gold)', letterSpacing: 2, textAlign: 'center', lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: '.88rem', lineHeight: 1.8, color: 'var(--text)', textAlign: 'center' }}>{body}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginTop: '.2rem' }}>
          <button className="btn" style={{ fontSize: '.8rem', padding: '.8rem 1.5rem' }} onClick={() => { snd('start'); onConfirm(); }}>{confirmLabel}</button>
          <button className="btn btn-ghost" style={{ fontSize: '.78rem', padding: '.7rem 1.5rem' }} onClick={() => { snd('nav'); onCancel(); }}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
}
