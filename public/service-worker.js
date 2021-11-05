
const FILES_TO_CACHE = [
    "/",
    "/public/index.html",
    "/public/style.css",
    "/public/index.js",
    "/manifest.webmanifest",
    "/public/icons/icon-192x192.png",
    "/public/icons/icon-512x512.png",
];

const CACHE_NAME = "static-cache";
const DATA_CACHE_NAME = "data-cache";

self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        return cache.match(evt.request);
                    });
            }).catch(err => console.log(err))
        );

        return;
    } else {
        evt.respondWith(
            caches.match(evt.request).then(function (response) {
                return response || fetch(evt.request);
            })
        );
    }
});



