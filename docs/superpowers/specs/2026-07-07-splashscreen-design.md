# Splashscreen design

## Purpose

The game opens directly into the menu today. On mobile, this means audio
never gets unlocked (WebAudio requires a user gesture, especially on iOS
Safari) and the player never gets an opportunity to enter fullscreen. A
splashscreen shown once per page load, gated behind a "Continuar" tap, fixes
both: the tap is the user gesture that unlocks audio everywhere and requests
fullscreen where the platform supports it.

## Behavior

- Shown once per page load, before the Menu. A full reload shows it again
  (correct, since the AudioContext is recreated on reload too).
- While waiting for `document.fonts.ready` (real wait, not simulated), shows
  the game logo/title and a subtle loading indicator. No fake progress bar.
- Once fonts are ready, shows a "Continuar" button.
- Tapping "Continuar":
  1. Resumes the shared `AudioContext` (`AC.resume()`) — this is what
     actually unlocks sound on iOS Safari.
  2. Attempts `requestFullscreen()` on `document.documentElement`, with
     vendor-prefixed fallbacks for older WebKit. Wrapped in try/catch.
     iPhone Safari does not implement the Fullscreen API at all — the call
     fails silently there and the game proceeds in normal Safari chrome.
     Android and desktop browsers get real fullscreen.
  3. Splash unmounts, Menu renders normally.

## Components

- `src/engine/fullscreen.ts` — `requestFullscreen(el: HTMLElement): void`,
  tries standard + `webkit`-prefixed APIs, swallows all failures.
- `src/components/SplashScreen.tsx` — owns the "waiting for fonts" state and
  renders either the loading view or the Continuar button; calls
  `AC.resume()` and `requestFullscreen()` on click, then calls an `onDone`
  prop.
- `src/App.tsx` — adds local `showSplash` state (`true` initially); renders
  `<SplashScreen onDone={() => setShowSplash(false)} />` instead of the rest
  of the app tree while `showSplash` is true.

## Testing

- `fullscreen.ts`: unit tests that it calls whichever fullscreen method
  exists on a mock element and does not throw when none exist.
- `SplashScreen.tsx`: component test that it renders the loading state
  first, then the Continuar button once `document.fonts.ready` resolves
  (mocked), and that clicking it calls `onDone`.
- Manual browser check: splash appears, Continuar advances to Menu screen
  with no console errors.
