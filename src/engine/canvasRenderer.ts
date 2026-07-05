import { EV_THEMES } from '../data/eventThemes';
import { _bg } from '../data/eventThemes/canvasHelpers';

// Banners are rendered to data URLs only when first needed, then cached.
// After the game starts we prefetch remaining banners during idle time.
const _renderedBanners: (string | null)[] = new Array(EV_THEMES.length).fill(null);

export function renderTheme(idx: number): string {
  if (_renderedBanners[idx]) return _renderedBanners[idx]!;
  const W = 1000, H = 250;
  const oc = document.createElement('canvas');
  oc.width = W; oc.height = H;
  const ctx = oc.getContext('2d')!;
  try { EV_THEMES[idx].fn(ctx, W, H); }
  catch { _bg(ctx, W, H, '#07070f', '#12101e'); }
  _renderedBanners[idx] = oc.toDataURL('image/jpeg', 0.92);
  return _renderedBanners[idx]!;
}

export function prefetchBannersIdle() {
  let i = 0;
  function step(deadline: IdleDeadline) {
    while (i < EV_THEMES.length) {
      if (!_renderedBanners[i]) {
        renderTheme(i);
        i++;
        if (deadline.timeRemaining && deadline.timeRemaining() < 8) {
          (window.requestIdleCallback || ((cb: IdleRequestCallback) => setTimeout(cb as any, 50)))(step, { timeout: 2000 });
          return;
        }
      } else { i++; }
    }
  }
  (window.requestIdleCallback || ((cb: IdleRequestCallback) => setTimeout(cb as any, 200)))(step, { timeout: 5000 });
}

export function getEventImg(evId: number): string {
  const idx = (evId - 1) % EV_THEMES.length;
  return renderTheme(idx);
}

export function getEventThemeLabel(evId: number): string {
  return EV_THEMES[(evId - 1) % EV_THEMES.length].label;
}
