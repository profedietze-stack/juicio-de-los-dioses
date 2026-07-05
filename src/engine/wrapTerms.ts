import { GLOSSARY } from '../data/glossary';

const TAG_RE = /<(?:[^"'<>]|"[^"]*"|'[^']*')*>/g;

// Wraps every glossary term found in `text` (once each) with a
// <span class="tip" ...> that the TooltipBox controller (see
// tooltipController.ts) shows on hover/click. Ported verbatim from the
// original two-pass placeholder algorithm: tags are passed through
// untouched, term matching only happens in text nodes.
export function wrapTerms(text: string): string {
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

  const parts: { type: 'text' | 'tag'; val: string }[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(text)) !== null) {
    parts.push({ type: 'text', val: text.slice(last, m.index) });
    parts.push({ type: 'tag', val: m[0] });
    last = m.index + m[0].length;
  }
  parts.push({ type: 'text', val: text.slice(last) });

  const placeholders: Record<string, string> = {};
  let pIdx = 0;
  const used = new Set<string>();

  const processed = parts.map(part => {
    if (part.type === 'tag') return part.val;
    let chunk = part.val;
    terms.forEach(term => {
      if (used.has(term)) return;
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b(${escaped})\\b`, 'gi');
      let firstMatch = false;
      chunk = chunk.replace(re, (match) => {
        if (firstMatch) return match;
        firstMatch = true;
        used.add(term);
        const def = GLOSSARY[term].replace(/"/g, '&quot;');
        const key = `\x00${pIdx++}\x00`;
        placeholders[key] =
          `<span class="tip" tabindex="0" data-term="${term}" data-def="${def}"` +
          ` onmouseenter="this.classList.add('tip-open');window._showTip&&window._showTip(this,this.dataset.term,this.dataset.def)"` +
          ` onmouseleave="window._hideTip&&window._hideTip()"` +
          ` onclick="event.stopPropagation();window._showTip&&window._showTip(this,this.dataset.term,this.dataset.def)">${match}</span>`;
        return key;
      });
    });
    return chunk;
  }).join('');

  return processed.replace(/\x00\d+\x00/g, k => placeholders[k] || k);
}
