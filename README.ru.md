# UI/UX Starter

Минимальный стартовый проект на React + Vite + Tailwind с ESLint, Prettier и Docker.

## Быстрый старт

```bash
pnpm install
npm run dev
```

## Docker (dev с HMR)

```bash
make docker-dev
```

## Docker (production build)

```bash
make docker-build
make docker-run
```

Открой http://localhost:5173 для dev или http://localhost:8080 для prod.

## Локализация
- Можно использовать i18n-решение (i18next/react-i18next или аналог).
- Стартовые локали: RU/EN.

## Версии зависимостей
- Можно использовать context7 для проверки актуальных версий библиотек и необходимых зависимостей перед обновлениями.
