import { describe, it, expect, vi } from 'vitest';
import { requestFullscreen } from './fullscreen';

type LegacyEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

describe('requestFullscreen', () => {
  it('calls requestFullscreen when available', () => {
    const el = document.createElement('div') as LegacyEl;
    const spy = vi.fn();
    el.requestFullscreen = spy;
    requestFullscreen(el);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('falls back to webkitRequestFullscreen when the standard API is missing', () => {
    const el = document.createElement('div') as LegacyEl;
    const spy = vi.fn();
    el.webkitRequestFullscreen = spy;
    requestFullscreen(el);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does nothing and does not throw when no fullscreen API exists (e.g. iPhone Safari)', () => {
    const el = document.createElement('div');
    expect(() => requestFullscreen(el)).not.toThrow();
  });

  it('does not throw when requestFullscreen exists but rejects', () => {
    const el = document.createElement('div') as LegacyEl;
    el.requestFullscreen = vi.fn(() => Promise.reject(new Error('denied')));
    expect(() => requestFullscreen(el)).not.toThrow();
  });

  it('does not throw when requestFullscreen exists but throws synchronously', () => {
    const el = document.createElement('div') as LegacyEl;
    el.requestFullscreen = vi.fn(() => { throw new Error('denied'); });
    expect(() => requestFullscreen(el)).not.toThrow();
  });
});
