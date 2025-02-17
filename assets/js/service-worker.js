// service-worker.js

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('portfolio-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/assets/images/vcard-portfolio.png',
          '/assets/css/style.css',
          '/assets/js/script.js'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  