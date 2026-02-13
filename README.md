# Destroy This Bubbles

Монорепозиторий с браузерной игрой на `canvas`, SSR-клиентом на React и Node.js-сервером с PostgreSQL.

## Что реализовано
- Игра с пузырями: таймер, попадания/промахи, плавающие очки, полноэкранный режим, настраиваемые параметры.
- Таблица лидеров через API Яндекс.Практикума (`/leaderboard`).
- Авторизация через логин/пароль и OAuth Яндекса.
- Профиль пользователя: редактирование данных, смена пароля, загрузка аватара, геолокация.
- SSR-рендеринг React на сервере и гидратация на клиенте.
- PWA (service worker + precache/runtime cache).
- Backend API для форума и тем оформления (`/api/*`, `/v1/theme/*`).

## Архитектура
- `packages/client`: React + Vite + Redux Toolkit + MUI + Emotion, SSR entry (`src/entry-server.tsx`), PWA (`src/sw.js`).
- `packages/server`: Express + SSR отдача HTML + прокси к внешнему API + REST API форума/реакций + API тем.
- `postgres` в Docker для хранения серверных сущностей (`topics/comments/replies/reactions`, `site_theme/user_theme`).

Поток запросов:
- Клиент отправляет запросы на `/api/*`.
- Сервер проксирует `auth/oauth/user/leaderboard` на `https://ya-praktikum.tech/api/v2`.
- Сервер обрабатывает собственные endpoints форума и тем локально.

## Текущие ограничения
- UI форума в клиенте пока работает на `mockData` и не подключён к backend-ручкам форума.
- Страница регистрации пока не отправляет данные на сервер (только `console.log`).
- SQL-миграции в `db/001_init.sql` не используются, схема создаётся через `sequelize.sync()`.

## Стек и зависимости
- Node.js `>=18` (в Docker используется Node 20).
- Yarn + Lerna Workspaces.
- Клиент: React 18, TypeScript, Vite 4, Redux Toolkit, React Router, MUI, Emotion, `vite-plugin-pwa`.
- Сервер: Express, Sequelize, PostgreSQL (`pg`), `http-proxy-middleware`, `cookie-parser`, `cors`.
- Качество кода: ESLint, Prettier, Jest, Lefthook.

## Структура
```text
.
├── packages/
│   ├── client/      # SPA + SSR hydration + game UI
│   └── server/      # Express SSR + API + proxy
├── docs/            # Техническая документация
├── db/              # SQL-заготовки (сейчас не используются в рантайме)
├── docker-compose.yml
└── README.md
```

## Быстрый старт (локально)
1. Установите `Node.js >=18`, `yarn`, `docker`.
2. Проверьте и при необходимости отредактируйте `.env`.
3. Выполните:
   ```bash
   yarn bootstrap
   yarn dev
   ```
4. Для запуска отдельных пакетов:
   ```bash
   yarn dev:client
   yarn dev:server
   ```

## Сборка и проверка
```bash
yarn test
yarn lint
yarn format
yarn build
```

Запуск preview:
```bash
yarn preview --scope=client
yarn preview --scope=server
```

## Docker
`docker-compose` поднимает 3 сервиса: `client` (nginx), `server` (node), `postgres`.

Подготовка и запуск:
```bash
node init.js
docker compose up --build
```

Полезные команды:
```bash
docker compose up -d
docker compose down
docker compose logs
docker compose logs -f server
```

### SSL (HTTPS на 443 и Let's Encrypt)

Клиент слушает **80** (ACME для Let's Encrypt) и **443** (HTTPS). При старте без сертификата Let's Encrypt подставляется самоподписанный — 443 будет работать сразу (браузер покажет предупреждение). Для боевого домена — сертификат Let's Encrypt.

1. В `.env` задайте `LETSENCRYPT_DOMAIN` и `CERTBOT_EMAIL`.
2. Запустите стек, затем получите сертификат:
   ```bash
   docker compose up -d
   docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
     -d bug-busters.ya-praktikum.tech \
     --email your-email@example.com \
     --agree-tos --non-interactive
   ```
3. Перезапустите клиент:
   ```bash
   docker compose restart client
   ```

Продление:
```bash
docker compose run --rm certbot renew --webroot -w /var/www/certbot
docker compose restart client
```

**На ВМ (Yandex Cloud):** используйте `docker-compose.vm.yml`. Образ клиента должен быть собран из этого репозитория (с entrypoint и nginx на 80+443). После деплоя откройте в файрволе/security group порты **80** и **443**.

## Переменные окружения
Основные параметры (`.env`):
- `CLIENT_PORT` — внешний порт клиента.
- `SERVER_PORT` — порт backend.
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — подключение к БД.
- `EXTERNAL_SERVER_URL` — серверный URL для локальной разработки клиента.
- `INTERNAL_SERVER_URL` — серверный URL внутри docker-сети.
- `LETSENCRYPT_DOMAIN` — домен для SSL (напр. `bug-busters.ya-praktikum.tech`).
- `CERTBOT_EMAIL` — email для Let's Encrypt.

Примечание: текущий `init.js` создаёт только директорию `tmp/pgdata` и не генерирует `.env`.

## NPM-скрипты (корень)
- `yarn bootstrap` — установка зависимостей и bootstrap workspace.
- `yarn dev` — dev-режим всех пакетов.
- `yarn dev:client` — dev только клиента.
- `yarn dev:server` — dev только сервера.
- `yarn build` — сборка клиента, SSR и сервера.
- `yarn test` — тесты по пакетам.
- `yarn lint` — линтинг по пакетам.
- `yarn format` — форматирование по пакетам.

## Git hooks
Используется `lefthook` (`pre-commit`):
- ESLint для `*.ts, *.tsx`
- Prettier для `*.ts, *.tsx, *.css`

## Дополнительная документация
- `docs/README.md`
- `docs/scenario.md`
- `docs/gameEngine.md`
