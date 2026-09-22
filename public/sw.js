// Minimal service worker. Its only job is to make the app installable in
// Chromium: an INSTALLED PWA is granted *persistent* File System Access
// permissions, so the chosen folder stops asking to reconnect between sessions.
// No offline caching — every request passes straight through to the network.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => { /* passthrough; presence enables install */ })
