const C = 'kakei-v2';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html', './xlsx.full.min.js', './jszip.min.js'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// ネットワーク優先・失敗時キャッシュ: 更新も反映されつつオフラインでも動く
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const cl = r.clone();
      caches.open(C).then(c => c.put(e.request, cl));
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(m => m || caches.match('./index.html')))
  );
});
