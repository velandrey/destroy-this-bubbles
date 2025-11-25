const CACHE_NAME = 'destroy-this-bubbles-cache-v1';

// Ресурсы, которые будут закешированы при установке Service Worker
const urlsToCache = [
    '/',
    '/index.html',
    '/game',
];

/** Установка Service Worker и кеширование ресурсов */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.error('Failed to open cache', err);
            })
    );
});

/** Активация Service Worker и удаление старых кешей */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

/** Обработка запросов (стратегия "сначала кеш, потом сеть") */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Если ресурс найден в кеше, возвращаем его
            if (response) {
                return response;
            }

            // Клонируем запрос, так как он является потоком и может быть использован только один раз
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then((response) => {
                // Проверяем, что получен корректный ответ
                if (
                    !response ||
                    response.status !== 200 ||
                    response.type !== 'basic'
                ) {
                    return response;
                }

                // Клонируем ответ, чтобы положить его в кеш и вернуть браузеру
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});
