# Workflow: Infrastructure Change

1. **Start**
   - Create a task: `make task NAME="Infra: ..."`.
   - Review `context/infrastructure.md` and `context/security.md`.

2. **Impact**
   - Identify affected commands, ports, or build steps.
   - Decide if Docker or Makefile changes are needed.

3. **Change**
   - Update configs (`Dockerfile`, `docker-compose.yml`, `Makefile`).
   - Verify `npm run dev` and `make up`.

4. **Docs**
   - Update `context/infrastructure.md`.
   - Log the change in `.memory_bank/changelog.md`.

5. **Close**
   - Mark the task done and update `current_tasks.md`.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
