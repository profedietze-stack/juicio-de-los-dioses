const CACHE_NAME = 'juicio-de-los-dioses-v2';
// Derived from the SW's own scope rather than hardcoded as root-relative
// paths, so this still resolves correctly when the app is served from a
// subpath (e.g. GitHub Pages project sites at /repo-name/).
const BASE = new URL(self.registration.scope).pathname;
const APP_SHELL = [
  BASE,
  `${BASE}manifest.json`,
  `${BASE}favicon.svg`,
  `${BASE}backgrounds/splash-christ-redeemer.jpg`,
  `${BASE}backgrounds/menu-last-judgment.jpg`,
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))),
  );
  self.clients.claim();
});

// Cache-first for the app shell/assets; network passthrough for everything
// else (Vite dev server modules, API-less game has none, but avoid caching
// hashed build assets forever by falling back to network first for JS/CSS).
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => cached)),
  );
});
