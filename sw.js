/* ============================================================
   sw.js — Il quaderno funziona anche senza connessione.
   Cambia VERSION quando modifichi i file: la cache vecchia
   viene buttata e la nuova scaricata alla visita successiva.
   ============================================================ */
const VERSION = '2026-11-11.3';
const CACHE = `lucrezia-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/favicon.svg',
  './assets/fonts/fraunces-normal.woff2',
  './assets/fonts/fraunces-italic.woff2',
  './assets/fonts/nunito-normal.woff2',
  './assets/fonts/caveat-normal.woff2',
  './css/base.css',
  './css/views.css',
  './js/art.js',
  './js/data.js',
  './js/core.js',
  './js/router.js',
  './js/app.js',
  './js/views/home.js',
  './js/views/catalogs.js',
  './js/views/about.js',
  './js/views/timer.js',
  './js/views/picker.js',
  './js/views/groups.js',
  './js/views/board.js',
  './js/views/dice.js',
  './js/views/memory.js',
  './js/views/tris.js',
  './js/views/quiz.js',
  './js/views/simon.js',
  './js/views/moths.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // "reload" salta la cache HTTP: la nuova versione parte sempre pulita.
      .then((cache) => Promise.all(ASSETS.map(async (url) => {
        const response = await fetch(url, { cache: 'reload' });
        if (!response.ok) throw new Error(`Impossibile mettere in cache ${url}`);
        await cache.put(url, response);
      })))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('lucrezia-') && key !== CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Le pagine (anche con #hash) provano la rete e poi la copia locale.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // File statici: prima la cache, poi la rete. La copia fresca resta per dopo.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return response;
      });
    })
  );
});
