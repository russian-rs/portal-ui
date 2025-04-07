### Запуск

1. Необходимо выпустить токен для доступа к npm пакетам API. Для этого нужно перейти
   в [настройки GitHub](https://github.com/settings/tokens) и создать classic токен со скоупом read:packages. В системе
   необходимо создать переменную среды **GITHUB_RUSSIAN_RS_NPM_TOKEN**.

2. Запустить приложение:

```
npm install
npm run build
npm run dev
```

По умолчанию в качестве backend используется тестовый стенд: [portal-test](https://portal-test.russian.rs), для входа у
вас должна быть заведена учетная запись на [тестовом авторизационном сервере](https://id-test.russian.rs), если такой
нет, то обратитесь к коллегам за помощью.

Поменять адрес бэкенда можно в файле vite.config.mts (переменная apiTarget). 


