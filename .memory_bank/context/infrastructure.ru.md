# Снимок инфраструктуры

- **Локальная разработка**
  - Команда: `npm run dev`
  - Vite dev server: `http://localhost:5173`
  - HMR включен.

- **Docker (dev)**
  - `make up` - сборка и запуск с HMR (`5173:5173`).
  - `make down` - остановка.
  - `make restart` - перезапуск.

- **Docker (prod)**
  - `make docker-build` - сборка production образа.
  - `make docker-run` - запуск Nginx на `http://localhost:8080`.

- **Окружение**
  - Node.js + pnpm.
  - Docker + docker compose.

Обновляй этот файл при изменениях инфраструктуры.

## Версии зависимостей
- Можно использовать context7 для проверки актуальных версий библиотек и необходимых зависимостей перед обновлениями.
