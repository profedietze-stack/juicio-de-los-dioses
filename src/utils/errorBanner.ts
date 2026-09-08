interface Opciones {
  /**
   * Devuelve `true` para los errores que NO merecen tapar la pantalla.
   *
   * El banner existe para que un fallo real no pase desapercibido, pero hay
   * fallos transitorios de biblioteca que se recuperan solos y que al alumno no
   * le dicen nada. Cada juego decide cuales son los suyos: este archivo no
   * conoce ninguna biblioteca en particular.
   */
  ignorar?: (motivo: string) => boolean;
}

export function initErrorBanner(opciones: Opciones = {}): void {
  const BANNER_ID = '__error_banner__';
  const ignorar = opciones.ignorar ?? (() => false);

  function show(title: string, detail: string): void {
    if (document.getElementById(BANNER_ID)) return;

    const banner = document.createElement('div');
    banner.id = BANNER_ID;
    Object.assign(banner.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '99999',
      background: 'linear-gradient(135deg,#7b0000,#c0392b)',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '13px',
      padding: '12px 48px 12px 16px',
      lineHeight: '1.5',
      boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      cursor: 'pointer',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
    });

    banner.textContent = `⚠ ERROR — toca para copiar\n${title}\n${detail}`;

    const close = document.createElement('button');
    Object.assign(close.style, {
      position: 'absolute',
      top: '8px',
      right: '10px',
      background: 'none',
      border: 'none',
      color: '#fff',
      fontSize: '18px',
      cursor: 'pointer',
      lineHeight: '1',
    });
    close.textContent = '✕';
    close.onclick = (e) => { e.stopPropagation(); banner.remove(); };

    banner.onclick = () => {
      navigator.clipboard?.writeText(`${title}\n${detail}`).catch(() => {});
    };

    banner.appendChild(close);
    document.body.prepend(banner);
  }

  window.addEventListener('error', (e) => {
    const detail = e.error?.stack ?? `${e.filename}:${e.lineno}:${e.colno}`;
    if (ignorar(detail)) { console.warn('[errorBanner] ignorado:', e.message); return; }
    show(e.message, detail);
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason instanceof Error
      ? `${e.reason.message}\n${e.reason.stack ?? ''}`
      : String(e.reason);
    if (ignorar(reason)) { console.warn('[errorBanner] ignorado:', reason); return; }
    show('Unhandled Promise rejection', reason);
  });
}
