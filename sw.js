// Service Worker: hält Pixelwerk offline verfügbar. Die Version ändert sich mit jedem neuen Build.
const VERSION = 'pixelwerk-f987478a52';
const FILES = ["./", "index.html", "manifest.webmanifest", "fonts/pixelify-sans.woff", "fonts/figtree.woff", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  // Alte Versionen löschen
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Eigene Dateien: zuerst aus dem Zwischenspeicher, damit die App ohne Internet startet
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
