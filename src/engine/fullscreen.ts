// iPhone Safari implements neither requestFullscreen nor the webkit-prefixed
// variant — every call here is best-effort and must fail silently so the
// game keeps working in normal Safari chrome.
export function requestFullscreen(el: HTMLElement) {
  type LegacyEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
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
