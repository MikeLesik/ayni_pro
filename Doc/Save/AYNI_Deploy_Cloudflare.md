# AYNI Gold — Деплой на Cloudflare Pages через GitHub

## Предварительные требования

- Аккаунт на [GitHub](https://github.com)
- Аккаунт на [Cloudflare](https://dash.cloudflare.com/sign-up) (бесплатный план достаточно)
- Репозиторий с кодом AYNI APP

---

## Шаг 1. Залить код на GitHub

### 1.1 Создать репозиторий

1. Зайди на https://github.com/new
2. Название: `ayni-app` (или любое другое)
3. Видимость: **Private** (рекомендуется)
4. Нажми **Create repository**

### 1.2 Запушить код

Открой терминал в папке проекта и выполни:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЮЗЕРНЕЙМ/ayni-app.git
git push -u origin main
```

> Если репозиторий уже существует — просто `git push`.

---

## Шаг 2. Подключить Cloudflare Pages

### 2.1 Создать проект

1. Зайди в [Cloudflare Dashboard](https://dash.cloudflare.com)
2. В левом меню: **Workers & Pages**
3. Нажми **Create** → **Pages** → **Connect to Git**
4. Авторизуй GitHub (если ещё не подключён)
5. Выбери репозиторий `ayni-app`
6. Нажми **Begin setup**

### 2.2 Настройки сборки

Заполни поля:

| Параметр | Значение |
|----------|----------|
| **Project name** | `ayni-app` (будет доступен как `ayni-app.pages.dev`) |
| **Production branch** | `main` |
| **Framework preset** | None (или Vite) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

### 2.3 Переменные окружения (Environment variables)

Добавь одну переменную:

| Variable name | Value |
|---------------|-------|
| `NODE_VERSION` | `20` |

> Это гарантирует, что Cloudflare использует Node.js 20+ для сборки.

### 2.4 Запуск

Нажми **Save and Deploy**. Первая сборка займёт 1–2 минуты.

---

## Шаг 3. Проверить

После успешного деплоя сайт будет доступен по адресу:

```
https://ayni-app.pages.dev
```

Каждый push в `main` автоматически запускает новый деплой.

Пуши в другие ветки создают **Preview Deployments** с отдельными URL (полезно для тестирования).

---

## Шаг 4. Привязать свой домен (опционально)

1. В Cloudflare Dashboard → **Workers & Pages** → твой проект
2. Вкладка **Custom domains**
3. Нажми **Set up a custom domain**
4. Введи домен (например, `app.ayni.gold`)
5. Cloudflare автоматически настроит DNS (если домен на Cloudflare)
6. SSL-сертификат выпустится автоматически

---

## Важные файлы для деплоя

### `public/_redirects`

Уже создан в проекте. Нужен для корректной работы React Router (SPA):

```
/* /index.html 200
```

Без этого файла обновление страницы на любом роуте кроме `/` вернёт ошибку 404.

### `vite.config.ts`

Текущая конфигурация готова к деплою. Если сайт будет на поддомене (не в корне), добавь `base`:

```ts
export default defineConfig({
  base: '/',  // менять только если деплоишь в подпапку
  plugins: [react()],
  // ...
})
```

---

## Обновление сайта

Просто пуш в `main`:

```bash
git add .
git commit -m "update: описание изменений"
git push
```

Cloudflare автоматически пересоберёт и задеплоит за ~1 минуту.

---

## Откат к предыдущей версии

1. Cloudflare Dashboard → Workers & Pages → твой проект
2. Вкладка **Deployments**
3. Найди нужный деплой → нажми **⋮** → **Rollback to this deployment**

---

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| Ошибка сборки `tsc` | Проверь что `NODE_VERSION=20` в env variables |
| 404 при обновлении страницы | Убедись что `public/_redirects` существует с содержимым `/* /index.html 200` |
| Пустая страница | Проверь `base` в `vite.config.ts` — должно быть `'/'` |
| Долгая сборка | Нормально для первого раза (~2 мин), последующие быстрее |

---

## Лимиты бесплатного плана Cloudflare Pages

- 500 деплоев в месяц
- 1 сборка одновременно
- Неограниченный трафик
- Неограниченные сайты
- Автоматический SSL
- Preview deployments для всех веток
