# Руководство по фронтенду для обучения UI/UX

## Обзор проекта
Проект для обучения UI/UX через практические визуальные примеры и сборку собственной библиотеки shared компонентов. Фокус на композиции, типографике, отступах, состояниях и адаптивности.

## Tech Stack
- **Language**: TypeScript
- **UI**: React 18
- **Bundler**: Vite (HMR)
- **Routing**: React Router
- **Styling**: Tailwind CSS + PostCSS
- **Tooling**: pnpm, ESLint, Prettier
- **Infra**: Docker + docker compose (dev/prod)

## Локализация
- Можно использовать i18n-решение (i18next/react-i18next или аналог).
- Стартовые локали: RU/EN.

## Команды разработки
- `npm run dev` - локальная разработка с HMR
- `npm run build` - production build
- `npm run preview` - локальный preview
- `make up` / `make down` / `make restart` - docker dev workflow

## Принципы библиотеки компонентов
- Компоненты небольшие и переиспользуемые (Button, Input, Card, Section).
- Предпочитаем композицию, избегаем дублирования.
- Продуманы состояния (default/hover/focus/disabled).
- Минимум inline-стилей, используем Tailwind utilities.

## Фокус практики UI/UX
- Четкая типографическая иерархия (size/weight/spacing).
- Ритм и сетка (grid, gaps, whitespace).
- Контраст и доступность (видимые focus-состояния).
- Mobile-first адаптивность.

## Рекомендуемая структура (по мере роста)
```
src/
  components/      # shared UI components
  examples/        # UI/UX demo screens
  layouts/         # layout primitives
  data/            # demo content
```

## Memory Bank
Контекст хранится в `.memory_bank/`. Перед работой читать `README.md`, затем `context/` и `current_tasks.md`. После изменений обновлять `changelog.md` и связанные документы.

## Версии зависимостей
- Можно использовать context7 для проверки актуальных версий библиотек и необходимых зависимостей перед обновлениями.
