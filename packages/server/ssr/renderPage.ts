import fs from 'fs';
import path from 'path';

import serializeJavascript from 'serialize-javascript';

export async function renderPage(_url: string): Promise<string> {
    /* Путь до собранной клиентской директории */
    const clientDistPath = path.resolve(
        process.cwd(),
        '../../client/dist/client'
    );
    /* Путь до собранной клиентской директории под SSR */
    const SSRDistPath = path.resolve(process.cwd(), '../../client/dist/server');

    const indexHtmlPath = path.resolve(clientDistPath, 'index.html');
    const entryServerPath = path.resolve(SSRDistPath, 'entry-server.js');

    // Читаем HTML-шаблон, который собрал Vite
    const template = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Импортируем модуль SSR-билда и тянем оттуда render;
    const render = (await import(entryServerPath)).render;

    // Рендерим React-компонент в строку, тянем кешированные стили и стейт хранилища
    const { html, styles, state } = await render(_url);

    /* Тестовая отправка сервером начального стейта с измененными настройками игры */
    const mockCircleSettings = {
        minRadius: 5,
        maxRadius: 30,
        growthSpeed: 15,
        color: 'red',
        totalLevels: 10,
        totalTimeLevels: 10,
    };

    const mockState = {
        ...state,
        game: {
            ...state.game,
            settings: {
                ...state.game.settings,
                circle: mockCircleSettings,
            },
        },
    };

    // Подставляем строку вместо плейсхолдера <!--ssr-outlet-->
    return template
        .replace('<!--ssr-styles-->', styles)
        .replace('<!--ssr-outlet-->', html)
        .replace(
            '<!--ssr-initial-state-->',
            `<script>window.__INITIAL_STATE__=${serializeJavascript(mockState, {
                isJSON: true,
            })}</script>`
        );
}
