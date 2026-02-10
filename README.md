Видео с демонстрацией проекта  
[https://disk.yandex.ru/i/a6ZPOhAZ-JmxNg](https://disk.yandex.ru/i/a6ZPOhAZ-JmxNg)

### Как запускать?

#### Локальная разработка:

1.  Убедитесь, что у вас установлен `node` и `docker`

2.  Выполните команду `yarn bootstrap` - это обязательный шаг, без него ничего работать не будет :)

3.  Выполните команду `yarn dev` - запустит и клиент, и сервер


#### Запуск отдельных частей:

*   `yarn dev --scope=client` - запустить только клиент

*   `yarn dev --scope=server` - запустить только сервер


#### Production в Docker:

1.  Выполните `node init.js` для создания .env файла

2.  Настройте переменные окружения в `.env` при необходимости

3.  Запустите `docker compose up` - запустит три сервиса:

    *   nginx, раздающий клиентскую статику (клиент)

    *   node.js сервер (сервер)

    *   postgres, вашу базу данных (база данных)


#### Запуск отдельных сервисов в Docker:

*   `docker compose up client` - только клиент

*   `docker compose up server` - только сервер

*   `docker compose up postgres` - только база данных


### Как добавить зависимости?

В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Чтобы добавить зависимость для клиента:

`yarn lerna add {your\_dep} \--scope client`

Для сервера:

`yarn lerna add {your\_dep} \--scope server`

И для клиента и для сервера:

`yarn lerna add {your\_dep}`

Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`:

`yarn lerna add {your\_dep} \--dev \--scope server`

### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

`yarn test`

### Линтинг

`yarn lint`

### Форматирование prettier

`yarn format`

### Production build

`yarn build`

И чтобы посмотреть что получилось:

`yarn preview \--scope client`
`yarn preview \--scope server`

### Docker команды

*   `docker compose build` - пересобрать образы

*   `docker compose up -d` - запуск в фоновом режиме

*   `docker compose down` - остановка контейнеров

*   `docker compose logs` - просмотр логов

*   `docker compose logs -f` - просмотр логов в реальном времени


## Хуки

В проекте используется [lefthook](https://github.com/evilmartians/lefthook) для pre-commit проверок. Если очень-очень нужно пропустить проверки, используйте `--no-verify` (но не злоупотребляйте :)

## Автодеплой статики на vercel

Зарегистрируйте аккаунт на [vercel](https://vercel.com/). Следуйте [инструкции](https://vitejs.dev/guide/static-deploy.html#vercel-for-git). В качестве `root directory` укажите `packages/client`.

Все ваши PR будут автоматически деплоиться на vercel. URL вам предоставит деплоящий бот.

## Переменные окружения

Проект использует переменные окружения из `.env` файла. Для первого запуска выполните `node init.js`, который создаст `.env` на основе `.env.sample`.

Основные переменные:

*   `POSTGRES_*` - настройки базы данных

*   `SERVER_PORT` - порт сервера (по умолчанию 3001)

*   `CLIENT_PORT` - порт клиента (по умолчанию 80)

*   `INTERNAL_SERVER_URL` - URL сервера внутри Docker сети

*   `EXTERNAL_SERVER_URL` - URL сервера для локальной разработки


## Ой, ничего не работает :(

1.  Проверьте что выполнили `yarn bootstrap`

2.  Убедитесь что все переменные окружения установлены в `.env`

3.  Проверьте логи: `docker compose logs` или `yarn dev` ошибки

4.  Откройте issue, я приду :)
