/* Service worker: lưu đệm tệp tĩnh để mở lại khi mất mạng. Đổi VERSION khi cập nhật để làm mới bộ nhớ đệm. */
var VERSION = 'dd-v6', CORE = ['./', 'index.html', 'assets/css/styles.css', 'assets/art/drum.svg', 'manifest.webmanifest',
 'assets/fonts/Inter-Regular.woff', 'assets/fonts/Inter-SemiBold.woff', 'assets/fonts/Inter-ExtraBold.woff',
 'assets/js/core.js', 'assets/js/config.js', 'assets/js/sync.js', 'assets/js/geo.js', 'assets/js/exam.js', 'assets/js/views.js', 'assets/js/app.js',
 'assets/js/data/geo-world.js', 'assets/js/data/geo-vn.js', 'assets/js/data/catalog.js', 'assets/js/data/cards-6-7.js', 'assets/js/data/cards-8-9.js',
 'assets/js/data/exams-6-7.js', 'assets/js/data/exams-8-9.js', 'assets/js/data/timeline.js', 'assets/js/data/mindmaps.js'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) { var cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, cp); }); return r; }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('index.html'); }); }));
});
