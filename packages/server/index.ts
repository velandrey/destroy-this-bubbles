import path from 'path';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import { ensureSiteThemes, logSiteThemes } from './db';
import { requireAuth } from './middleware/auth';
import { connectDB } from './config/db';
import { router } from './routes';
import { renderPage } from './ssr/renderPage';
import themeRouter from './routes/theme';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ApiURL } from './constants';

const app = express();
const cspValue =
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://ya-praktikum.tech https://oauth.yandex.ru; media-src 'self'; worker-src 'self' blob:; manifest-src 'self';";

app.use((req, res, next) => {
    const accept = String(req.headers.accept ?? '');

    const isHtmlRequest =
        (req.method === 'GET' || req.method === 'HEAD') &&
        accept.includes('text/html');

    if (isHtmlRequest) {
        res.setHeader('Content-Security-Policy', cspValue);
    }

    next();
});
app.use(cookieParser());
app.use(cors());

// Проксирование запросов к Yandex API
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

app.use(
    '/api/user',
    requireAuth,
    createProxyMiddleware({
        target: `${ApiURL}/user`,
        changeOrigin: true,
        cookieDomainRewrite: '',
    })
);

app.use(
    '/api/leaderboard',
    createProxyMiddleware({
        target: `${ApiURL}/leaderboard`,
        changeOrigin: true,
        cookieDomainRewrite: '',
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/v1/theme', themeRouter);
app.use('/api', router);

const port = Number(process.env.SERVER_PORT) || 4000;

// Путь до собранного клиента (Vite build)
const clientDistPath = path.resolve(process.cwd(), '../client/dist/client');

// Раздача статики: JS, CSS, манифест и т.п.
app.use(express.static(clientDistPath, { index: false }));

// Опционально: простая проверка живости сервера
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});

// Приватные страницы
const privatePages = ['/forum', '/profile', '/leaderboard'];

app.get(privatePages, requireAuth, async (req, res) => {
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
    connectDB().catch((error) => {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    });

    await ensureSiteThemes();
    await logSiteThemes();

    app.listen(port, () => {
        console.log(`  ➜ 🎸 SSR Server is listening on port: ${port}`);
    });
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});
