/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { createHandlerBoundToURL } from 'workbox-precaching';

/**
 * предварительное кеширование
 *      На этапе install автоматом кэширует файлы
 *      На этапе fetch автоматом отдает файл из кеша
 */
precacheAndRoute(
    // переменная станет списком файлов для кеширования
    self.__WB_MANIFEST
);

// для навигации
registerRoute(
    ({ request }) => request.mode === 'navigate',
    createHandlerBoundToURL('/index.html')
);

/**
 * кеширование во время выполнения
 *      Workbox ищет ресурс в кеше. 
 *      Если находит — отдает. 
 *      Если нет — идет в сеть, 
 *           получает ответ, 
 *           кладет его в кеш assets-cache 
 *           и отдает браузеру
 */
registerRoute(
    ({ request }) =>
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'worker',
    new CacheFirst({
        cacheName: 'assets-cache',
    })
);

// для скачивания браузером новой версии sw сразу
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
