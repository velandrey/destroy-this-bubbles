import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { renderPage } from './ssr/renderPage';

const app = express();
app.use(cors());

const port = Number(process.env.SERVER_PORT) || 4000;

// Путь до собранного клиента (Vite build)
const clientDistPath = path.resolve(process.cwd(), '../client/dist/client');

// Раздача статики: JS, CSS, манифест и т.п.
app.use(express.static(clientDistPath, { index: false }));

// Опционально: простая проверка живости сервера
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});

// Все остальные маршруты — SSR React-страницы
app.get('*', (req, res) => {
    try {
        const html = renderPage(req.url);
        res.status(200).contentType('text/html').send(html);
    } catch (e) {
        console.error('SSR render error:', e);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`  ➜ 🎸 SSR Server is listening on port: ${port}`);
});
