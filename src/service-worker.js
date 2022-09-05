import { CacheableResponsePlugin } from 'workbox-cacheable-response/CacheableResponsePlugin';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { precacheAndRoute, precache } from 'workbox-precaching';

precache(['favicon.png']);
precacheAndRoute(window.self.__WB_MANIFEST);

window.self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    window.self.skipWaiting();
  }
});

registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts',
    plugins: [new ExpirationPlugin({ maxEntries: 20 })],
  })
);

registerRoute(
  ({ url }) =>
    url.origin === 'https://moments-redefined.s3.ap-south-1.amazonaws.com',
  new CacheFirst({
    cacheName: 'moments-s3',
    matchOptions: {
      ignoreVary: true,
    },
    plugins: [
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 63072e3,
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin === 'https://api.momentcapturer.com',
  new StaleWhileRevalidate({
    cacheName: 'moments-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
