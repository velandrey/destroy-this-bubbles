import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';

import { App } from './app';

// url пока не используем, но оставляем для реализации в следующей таске
export function renderPage(_url: string): string {
    /** Путь до собранной клиентской директории */
    const clientDistPath = path.resolve(process.cwd(), '../client/dist/client');
    const indexHtmlPath = path.resolve(clientDistPath, 'index.html');

    // Читаем HTML-шаблон, который собрал Vite
    const template = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Рендерим React-компонент в строку
    const appHtml = ReactDOMServer.renderToString(<App />);

    // Подставляем строку вместо плейсхолдера <!--ssr-outlet-->
    const html = template.replace('<!--ssr-outlet-->', appHtml);

    return html;
}
