interface ToastProps {
  show: boolean;
  text?: string;
}

export function Toast({ show, text = 'Partida guardada' }: ToastProps) {
  return (
    <div id="autosave-toast" className={show ? 'show' : ''}>
      <span className="toast-icon">✦</span>
      <span className="toast-text">{text}</span>
    </div>
  );
}
