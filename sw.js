const CACHE = 'chess-coach-v17';
const SHELL = [
  './',
  './index.html',
  './chess.js',
  './stockfish.js',
  './sf18.js',
  './sf18.wasm',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// App files: cached copy first, refreshed in the background.
// Fonts: cached after the first online visit so the app looks right offline.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !isFont) return;

  // The page itself: try the network first so updates show up on the next open.
  if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html')) {
    event.respondWith(
      caches.open(CACHE).then(async cache => {
        try {
          const res = await Promise.race([fetch(req, { cache: 'no-cache' }), new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 4000))]);
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        } catch (e) {
          return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('./index.html')) || fetch(req);
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(async cache => {
      const hit = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req)
        .then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
