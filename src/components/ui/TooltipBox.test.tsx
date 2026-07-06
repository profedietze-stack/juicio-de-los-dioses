import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { TooltipBox } from './TooltipBox';

function makeTermSpan(): HTMLElement {
  const span = document.createElement('span');
  span.className = 'tip';
  document.body.appendChild(span);
  vi.spyOn(span, 'getBoundingClientRect').mockReturnValue({
    top: 100, bottom: 120, left: 50, right: 100, width: 50, height: 20, x: 50, y: 100, toJSON() {},
  });
  return span;
}

describe('TooltipBox', () => {
  afterEach(() => {
    document.querySelectorAll('.tip').forEach(el => el.remove());
    delete window._showTip;
    delete window._hideTip;
  });

  it('registers window._showTip/_hideTip on mount and cleans them up on unmount', () => {
    const { unmount } = render(<TooltipBox />);
    expect(typeof window._showTip).toBe('function');
    expect(typeof window._hideTip).toBe('function');
    unmount();
    expect(window._showTip).toBeUndefined();
    expect(window._hideTip).toBeUndefined();
  });

  it('_showTip fills in the term/definition and makes the box visible', () => {
    render(<TooltipBox />);
    const span = makeTermSpan();
    window._showTip!(span, 'eudaimonía', 'Florecimiento humano.');

    const box = document.getElementById('tip-box')!;
    expect(box.classList.contains('tip-visible')).toBe(true);
    expect(document.getElementById('tip-term')!.textContent).toBe('eudaimonía');
    expect(document.getElementById('tip-def')!.textContent).toBe('Florecimiento humano.');
  });

  it('_hideTip removes the visible class after its delay', () => {
    vi.useFakeTimers();
    render(<TooltipBox />);
    const span = makeTermSpan();
    window._showTip!(span, 'eudaimonía', 'Florecimiento humano.');
    window._hideTip!();

    const box = document.getElementById('tip-box')!;
    expect(box.classList.contains('tip-visible')).toBe(true);
    vi.advanceTimersByTime(200);
    expect(box.classList.contains('tip-visible')).toBe(false);
    vi.useRealTimers();
  });

  it('closes the tooltip when clicking outside of it', () => {
    render(<TooltipBox />);
    const span = makeTermSpan();
    window._showTip!(span, 'eudaimonía', 'Florecimiento humano.');
    expect(document.getElementById('tip-box')!.classList.contains('tip-visible')).toBe(true);

    fireEvent.click(document.body);
    expect(document.getElementById('tip-box')!.classList.contains('tip-visible')).toBe(false);
  });
});
