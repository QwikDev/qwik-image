/*
 * WHAT IS THIS FILE?
 *
 * Custom service-worker lifecycle handling.
 */
const serviceWorker = globalThis as unknown as ServiceWorkerGlobalScope;

serviceWorker.addEventListener('install', () => serviceWorker.skipWaiting());

serviceWorker.addEventListener('activate', () => serviceWorker.clients.claim());
