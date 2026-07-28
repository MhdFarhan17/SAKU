self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A simple pass-through fetch handler is enough to trigger the PWA install prompt in Chrome.
  // We avoid caching here to prevent interfering with Next.js App Router's dynamic routing and data fetching.
});
