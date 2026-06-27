const CACHE_NAME = 'fikr-pro-v1';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/config.js',
    './js/app.js',
    './js/timer.js',
    './js/breathing.js',
    './js/analytics.js',
    './js/storage.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];
self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});
self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
