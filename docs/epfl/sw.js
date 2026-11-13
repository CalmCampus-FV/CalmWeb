// Offline shell. Same-origin only: this worker never makes a request to anyone else.
// Cache storage is shared by the whole origin, so every university folder owns a prefix
// and only ever deletes its own old caches.
const PREFIX = "calmcampus-epfl-";
const CACHE = `${PREFIX}54412d9296`;
const SHELL = ["./","app.js","config/universities/default.json","config/universities/epfl.json","fonts/caprasimo-latin-400-normal.woff2","fonts/figtree-latin-wght-normal.woff2","i18n/en.json","i18n/fr.json","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","lib/config.js","lib/demo.js","lib/i18n.js","lib/icons.js","lib/scoring.js","lib/store.js","lib/week.js","manifest.webmanifest","styles.css"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    })).catch(() => caches.match("index.html")),
  );
});
