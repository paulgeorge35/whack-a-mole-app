const CACHE_NAME = 'my-cache';
self.addEventListener('install', function (event) {
    console.log('install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/static/js/bundle.js',
            ])
                .then(() => self.skipWaiting());
        })
    );
});