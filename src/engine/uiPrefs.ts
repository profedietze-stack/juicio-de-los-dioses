export interface UiPrefs {
  bg: string;
  text: string;
  fontScale: number;
}

const KEY = 'uiPrefs';

export const UI_PREFS_DEFAULTS: UiPrefs = { bg: '#07070f', text: '#e8dcc4', fontScale: 1 };

export function getUiPrefs(): UiPrefs {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      bg: typeof raw.bg === 'string' ? raw.bg : UI_PREFS_DEFAULTS.bg,
      text: typeof raw.text === 'string' ? raw.text : UI_PREFS_DEFAULTS.text,
      fontScale: typeof raw.fontScale === 'number' && raw.fontScale >= 0.8 && raw.fontScale <= 1.4
        ? raw.fontScale
        : UI_PREFS_DEFAULTS.fontScale,
    };
  } catch { return { ...UI_PREFS_DEFAULTS }; }
}

export function saveUiPrefs(p: UiPrefs) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage unavailable */ }
}

export function applyUiPrefs(p: UiPrefs) {
  const root = document.documentElement;
  root.style.setProperty('--bg', p.bg);
  root.style.setProperty('--text', p.text);
  root.style.fontSize = `${Math.round(p.fontScale * 100)}%`;
}
