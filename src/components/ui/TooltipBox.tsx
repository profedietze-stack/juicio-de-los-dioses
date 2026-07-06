import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    _showTip?: (el: HTMLElement, term: string, def: string) => void;
    _hideTip?: () => void;
  }
}

// Registers window._showTip/_hideTip, called by the onmouseenter/onclick
// handlers baked into wrapTerms()-generated spans. Ported verbatim from the
// original vanilla implementation (positioning, hide delay, outside-click
// dismissal) since those handlers are plain inline HTML attribute strings,
// not React event props.
export function TooltipBox() {
  const boxRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const defRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    window._showTip = (el, term, def) => {
      const box = boxRef.current;
      if (!box || !termRef.current || !defRef.current) return;
      if (hideTimeout) clearTimeout(hideTimeout);
      termRef.current.textContent = term;
      defRef.current.textContent = def;
      const r = el.getBoundingClientRect();
      box.style.top = `${r.bottom + 8}px`;
      box.style.left = `${r.left}px`;
      box.classList.add('tip-visible');
      const tipW = box.offsetWidth;
      if (r.left + tipW > window.innerWidth - 10) {
        box.style.left = `${Math.max(6, window.innerWidth - tipW - 10)}px`;
      }
    };

    window._hideTip = () => {
      hideTimeout = setTimeout(() => {
        boxRef.current?.classList.remove('tip-visible');
        document.querySelectorAll('.tip.tip-open').forEach(t => t.classList.remove('tip-open'));
      }, 200);
    };

    function closeIfOutside(e: Event) {
      const box = boxRef.current;
      if (!box || !box.classList.contains('tip-visible')) return;
      const target = e.target as HTMLElement | null;
      if (box.contains(target) || target?.closest('.tip')) return;
      if (hideTimeout) clearTimeout(hideTimeout);
      box.classList.remove('tip-visible');
      document.querySelectorAll('.tip.tip-open').forEach(t => t.classList.remove('tip-open'));
    }

    document.addEventListener('click', closeIfOutside);
    document.addEventListener('touchstart', closeIfOutside, { passive: true });

    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
      document.removeEventListener('click', closeIfOutside);
      document.removeEventListener('touchstart', closeIfOutside);
      delete window._showTip;
      delete window._hideTip;
    };
  }, []);

  return (
    <div id="tip-box" role="tooltip" aria-live="polite" ref={boxRef}>
      <div id="tip-term" ref={termRef} />
      <div id="tip-def" ref={defRef} />
    </div>
  );
}
