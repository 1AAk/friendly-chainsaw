# Coding Style Guidelines (Frontend)

## General
- Use TypeScript in strict mode.
- Prefer functional components with hooks.
- Keep components small and focused.

## Naming and Structure
- Components use `PascalCase` (e.g., `PrimaryButton.tsx`).
- Hooks use `useSomething`.
- Tailwind classes live in `className` only; no extra CSS files beyond `index.css`.

## Component Design
- One component = one responsibility.
- Variants via props (`variant`, `size`).
- Avoid tight coupling between components.

## Tailwind Usage
- Prefer utilities over inline styles.
- Order classes by intent (layout -> typography -> color).
- Ensure hover/focus/disabled states are defined.

## Accessibility
- Add `aria-*` when needed.
- Visible focus styles are required.
- Text and controls must meet contrast needs.

## Localization
- If i18n is used (i18next/react-i18next or equivalent), keep UI strings in locale files.
- Baseline locales: RU/EN.

## Tooling
- Lint: `npm run lint`.
- Format: `npm run format`.
- Types: `npm run typecheck`.

## Documentation
- Update `PROJECT_ROADMAP.MD` and `.memory_bank/` when changes are made.
- Log notable decisions in `.memory_bank/changelog.md`.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
