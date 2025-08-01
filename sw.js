const CACHE_NAME_STATIC = 'static-cache-v1';
const URLS_STATIC = ['/date.js'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC)
      .then(cache => cache.addAll(URLS_STATIC))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // ① ナビゲーション（ページ遷移）はネットワーク優先
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          // 成功したらキャッシュも更新しておく
          const copy = res.clone();
          caches.open(CACHE_NAME_STATIC).then(cache => {
            cache.put('/', copy);
          });
          return res;
        })
        .catch(() => caches.match('/')) // オフライン時はキャッシュ返却
    );
    return;
  }

  // ② それ以外（CSS/JS/画像など）はキャッシュ優先
  event.respondWith(
    caches.match(req)
      .then(cached => cached || fetch(req))
  );
});
