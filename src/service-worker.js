import { CacheableResponsePlugin } from "workbox-cacheable-response/CacheableResponsePlugin";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheFirst } from "workbox-strategies/CacheFirst";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts",
    plugins: [new ExpirationPlugin({ maxEntries: 20 })],
  })
);

registerRoute(
  /^https:\/\/moments-redefined.s3.ap-south-1.amazonaws.com/,
  new CacheFirst({
    cacheName: "moments-s3",
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
