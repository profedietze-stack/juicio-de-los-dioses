const CACHE_NAME = 'juicio-de-los-dioses-v4';
// Derived from the SW's own scope rather than hardcoded as root-relative
// paths, so this still resolves correctly when the app is served from a
// subpath (e.g. GitHub Pages project sites at /repo-name/).
const BASE = new URL(self.registration.scope).pathname;
// Solo nombres fijos: los archivos con hash del build se guardan al usarse.
const APP_SHELL = [
  BASE,
  `${BASE}manifest.json`,
  `${BASE}favicon.svg`,
  `${BASE}backgrounds/splash-christ-redeemer.jpg`,
  `${BASE}backgrounds/menu-last-judgment.jpg`,
];

const SIN_CONEXION = () => new Response('Sin conexión', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

// Solo se guarda lo que salio bien, es del propio sitio y es una respuesta
// completa: guardar un error lo deja congelado, y cache.put rechaza los 206.
function guardable(res) {
  return res && res.status === 200 && res.type === 'basic';
}

self.addEventListener('install', event => {
  // Uno por uno: un 404 no puede tirar abajo la instalacion entera (addAll es todo o nada).
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(APP_SHELL.map(url => cache.add(url).catch(err => console.warn('[sw] no se pudo precachear', url, err)))),
    ),
  );
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
// Everything else (hashed assets, fonts, images, audio) is cache-first and is
// saved the first time it is used, so the game also starts without internet.
// A changed file gets a new hashed filename rather than overwriting the old
// cache entry. respondWith never rejects: the browser shows a mute error page.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (guardable(res)) {
            const copy = res.clone();
            event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {}));
          }
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match(BASE)).then(r => r || SIN_CONEXION())),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req)
        .then(res => {
          if (guardable(res) && !req.headers.has('range')) {
            const copy = res.clone();
            event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {}));
          }
          return res;
        })
        .catch(() => SIN_CONEXION());
    }),
  );
});
