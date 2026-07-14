const CACHE_NAME = 'juicio-de-los-dioses-v3';
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

// Navigations (the HTML document) are network-first: it references
// content-hashed JS/CSS filenames that change on every deploy, so a stale
// cached copy of the page can point at assets that no longer exist on the
// server, producing a blank page until the cache is manually cleared. Only
// fall back to the cached shell when actually offline.
//
// Everything else (hashed assets, images) is cache-first — safe, since a
// changed file gets a new hashed filename rather than overwriting the old
// cache entry.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match(BASE))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => cached)),
  );
});
