# UI/UX Learning Frontend Guide

## Project Overview
This project is for learning UI/UX through hands-on visual examples while building a shared component library. The focus is on layout, typography, spacing, interaction states, and responsiveness.

## Tech Stack
- **Language**: TypeScript
- **UI**: React 18
- **Bundler**: Vite (HMR)
- **Routing**: React Router
- **Styling**: Tailwind CSS + PostCSS
- **Tooling**: pnpm, ESLint, Prettier
- **Infra**: Docker + docker compose (dev/prod)

## Localization
- Use an i18n solution (i18next/react-i18next or equivalent).
- Start with RU/EN locales.

## Development Commands
- `npm run dev` - local dev with HMR
- `npm run build` - production build
- `npm run preview` - local preview
- `make up` / `make down` / `make restart` - docker dev workflow

## Component Library Principles
- Keep components small and reusable (Button, Input, Card, Section).
- Prefer composition over duplication.
- Design visible states (default/hover/focus/disabled).
- Minimize inline styles; use Tailwind utilities.

## UI/UX Practice Focus
- Clear typography hierarchy (size/weight/spacing).
- Consistent layout rhythm (grid, gaps, whitespace).
- Accessible contrast and focus states.
- Mobile-first responsiveness.

## Suggested Structure (evolves)
```
src/
  components/      # shared UI components
  examples/        # UI/UX demo screens
  layouts/         # layout primitives
  data/            # demo content
```

## Memory Bank
Context lives in `.memory_bank/`. Before work, read `README.md`, then `context/` and `current_tasks.md`. After changes, update `changelog.md` and relevant docs.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
