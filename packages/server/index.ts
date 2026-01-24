import path from 'path';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { ApiURL } from './constants';
import { createClientAndConnect } from './db';
import { authMiddleware } from './middlewares/authMiddleware';
import { renderPage } from './ssr/renderPage';

const app = express();
app.use(cors());
app.use(cookieParser());

const port = Number(process.env.SERVER_PORT) || 4000;

// Путь до собранного клиента (Vite build)
const clientDistPath = path.resolve(process.cwd(), '../client/dist/client');

// Прокси для перенаправления запросов связанных с аутентификацей на API яндекса
app.use(
    '/api/auth',
    createProxyMiddleware({
        target: `${ApiURL}/auth`,
        changeOrigin: true,
        cookieDomainRewrite: '',
    })
);

app.use(
    '/api/oauth',
    createProxyMiddleware({
        target: `${ApiURL}/oauth`,
        changeOrigin: true,
        cookieDomainRewrite: '',
    })
);

// Приватные ручки с проксированием на внешний API
app.use(
    '/api/user',
    authMiddleware,
    createProxyMiddleware({
        target: `${ApiURL}/user`,
        changeOrigin: true,
        cookieDomainRewrite: '',
    })
);

app.use(
    '/api/leaderboard',
    authMiddleware,
    createProxyMiddleware({
        target: `${ApiURL}/leaderboard`,
        changeOrigin: true,
        cookieDomainRewrite: '',
    })
);

// Свои ручки, без прокси, приватные - с authMiddleware, публичные - без
app.use('/api/leaderboard', authMiddleware);
app.use('/api/forum', authMiddleware);

/* Для примера - проверка userId из запроса для доступа к конкретной ручке
    app.delete('/api/topics/:id, authMiddleware, (req, res) => {
        const { id } = req.params;

        const topic = await TopicModel.findByPk(id);

        if (req.userId !== topic.userId) {
            res.status(403).json({
                error: 'Вы можете удялть только свои темы ',
            });
            return;
        }
    })
*/

// Раздача статики: JS, CSS, манифест и т.п.
app.use(express.static(clientDistPath, { index: false }));

// Опционально: простая проверка живости сервера
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});

// Приватные страницы
const privatePages = ['/forum', '/profile', '/leaderboard'];

app.get(privatePages, authMiddleware, async (req, res) => {
    const url = req.originalUrl;
    try {
        const html = await renderPage(url);
        res.status(200).contentType('text/html').end(html);
    } catch (e) {
        console.error('SSR render error:', e);
        res.status(500).send('Internal Server Error');
    }
});

// Все остальные маршруты — публичные
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

async function start() {
    const client = await createClientAndConnect();
    if (!client) {
        console.error('  ➜ Could not connect to Postgres, exiting');
        process.exit(1);
    }

    app.listen(port, () => {
        console.log(`  ➜ 🎸 SSR Server is listening on port: ${port}`);
    });
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});
