const CACHE_NAME = 'og-ai-v3';
const STATIC_ASSETS = [
  './',
  './og%20ai%20index.html',
  './og%20ai%20manifest.webmanifest',
  './icons/og%20ai%20icon-192.png',
  './icons/og%20ai%20icon-512.png'
];

// Install — cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache for same-origin; always network for Firebase/Groq
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Always go to network for external APIs (Firebase, Groq)
  const networkOnly = [
    'firebasedatabase.app',
    'firebaseapp.com',
    'googleapis.com',
    'gstatic.com',
    'groq.com'
  ];
  if (networkOnly.some(d => url.hostname.includes(d))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for local static assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful same-origin GET responses
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback — serve index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./og%20ai%20index.html');
        }
      });
    })
  );
});
