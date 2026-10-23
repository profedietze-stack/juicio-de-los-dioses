import { useEffect, useRef } from 'react';

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Accesibilidad de un dialogo modal: el foco entra al abrir, Tab no se escapa
// hacia la pantalla de atras, Escape cierra y el foco vuelve a donde estaba.
export function useModal<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  const cerrar = useRef(onClose);
  cerrar.current = onClose;

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    const raiz = ref.current;
    const foco = () => (raiz ? Array.from(raiz.querySelectorAll<HTMLElement>(FOCUSABLE)) : []);
    foco()[0]?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); cerrar.current(); return; }
      if (e.key !== 'Tab') return;
      const f = foco();
      if (f.length === 0) { e.preventDefault(); return; }
      const primero = f[0], ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
      else if (!raiz?.contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
    };
    document.addEventListener('keydown', alTeclear);
    return () => { document.removeEventListener('keydown', alTeclear); anterior?.focus?.(); };
  }, []);

  return ref;
}
