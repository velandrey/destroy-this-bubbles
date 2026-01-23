import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { renderPage } from './ssr/renderPage';
import { authMiddleware } from './middlewares/auth';
import { ApiURL } from './constants';

const app = express();
app.use(cors());

const port = Number(process.env.SERVER_PORT) || 4000;

// Путь до собранного клиента (Vite build)
const clientDistPath = path.resolve(process.cwd(), '../client/dist/client');

// Здесь проксируем нужные защищенные кастомные ручки. /forum - предварительно, для примера.
app.use(
    '/forum',
    authMiddleware,
    createProxyMiddleware({
        target: ApiURL,
        changeOrigin: true,
        cookieDomainRewrite: '',
    })
);

// Раздача статики: JS, CSS, манифест и т.п.
app.use(express.static(clientDistPath, { index: false }));

// Опционально: простая проверка живости сервера
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});

// Все остальные маршруты — SSR React-страницы
app.get('*', async (req, res) => {
    const url = req.originalUrl;
    try {
        const html = await renderPage(url);
        res.status(200).contentType('text/html').end(html);
    } catch (e) {
        console.error('SSR render error:', e);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`  ➜ 🎸 SSR Server is listening on port: ${port}`);
});
