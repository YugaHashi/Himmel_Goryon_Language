const CACHE_NAME = 'static-v1';
const STATIC_URLS = ['/', '/styles.css', '/date.js'];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  const req = evt.request;
  // HTML ナビゲーションは Network First
  if (req.mode === 'navigate') {
    evt.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }
  // それ以外は Cache First
  evt.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
