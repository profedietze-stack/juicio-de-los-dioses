type LegacyEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type LegacyDoc = Document & { webkitExitFullscreen?: () => Promise<void> | void; webkitFullscreenElement?: Element | null };

// iPhone Safari implements neither requestFullscreen nor the webkit-prefixed
// variant — every call here is best-effort and must fail silently so the
// game keeps working in normal Safari chrome.
export function requestFullscreen(el: HTMLElement) {
  const target = el as LegacyEl;
  try {
    const result = target.requestFullscreen
      ? target.requestFullscreen()
      : target.webkitRequestFullscreen?.();
    if (result && typeof (result as Promise<void>).catch === 'function') {
      (result as Promise<void>).catch(() => { /* denied or unsupported */ });
    }
  } catch { /* Fullscreen API unavailable */ }
}

export function exitFullscreen() {
  const doc = document as LegacyDoc;
  try {
    const result = doc.exitFullscreen
      ? doc.exitFullscreen()
      : doc.webkitExitFullscreen?.();
    if (result && typeof (result as Promise<void>).catch === 'function') {
      (result as Promise<void>).catch(() => { /* denied or unsupported */ });
    }
  } catch { /* Fullscreen API unavailable */ }
}

export function isFullscreen(): boolean {
  const doc = document as LegacyDoc;
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement);
}

export function toggleFullscreen(el: HTMLElement) {
  if (isFullscreen()) exitFullscreen();
  else requestFullscreen(el);
}
