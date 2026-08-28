const CACHE_NAME = 'pm-bwc-shell-v2';
const APP_SHELL = ['./', './index.html', './styles.css', './app.js', './data/master-data.js', './manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const isAppAsset = event.request.mode === 'navigate' || /\.(html|js|css)$/.test(new URL(event.request.url).pathname);
  event.respondWith(isAppAsset
    ? fetch(event.request).then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response; }).catch(() => caches.match(event.request))
    : caches.match(event.request).then(cached => cached || fetch(event.request)));
});
