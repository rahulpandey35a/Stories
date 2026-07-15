/* Voice Studio service worker — network-first for the app shell (so updates always show up
   when online), cache-first for images/icons (which rarely change and benefit from speed +
   true offline support). */
const CACHE = 'voice-studio-v23';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  var isAppShell = event.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname.endsWith('/');

  if (isAppShell) {
    // Always try the network first for the HTML itself — this is the piece that changes
    // on every update. Cache-first here is exactly what caused "I fixed it but the app
    // still shows the old version" — falls back to cache only when actually offline.
    event.respondWith(
      fetch(event.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(event.request).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
