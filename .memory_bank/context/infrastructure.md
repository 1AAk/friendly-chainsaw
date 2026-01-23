# Infrastructure Snapshot

- **Local development**
  - Command: `npm run dev`
  - Vite dev server: `http://localhost:5173`
  - HMR enabled.

- **Docker (dev)**
  - `make up` - build and run with HMR (`5173:5173`).
  - `make down` - stop.
  - `make restart` - restart.

- **Docker (prod)**
  - `make docker-build` - build production image.
  - `make docker-run` - run Nginx on `http://localhost:8080`.

- **Environment**
  - Node.js + pnpm.
  - Docker + docker compose.

Update this file when infra changes.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
