# Workflow: Dependency Update

1. **Start**
   - Create a task: `make task NAME="Deps: ..."`.
   - Review `TECH_STACK.MD` and `context/security.md`.

2. **Discovery**
   - Use context7 to check latest versions and compatibility.
   - Note breaking changes and peer dependency alignment needs.

3. **Plan**
   - Decide the update scope (patch/minor/major).
   - Confirm Node/Vite/Tailwind compatibility for the target versions.

4. **Update**
   - Update `package.json` version ranges.
   - Install dependencies and run `npm run typecheck`, `npm run lint`, `npm run build`.

5. **Verify & Docs**
   - Smoke test `npm run dev` (and `make up` if using Docker).
   - Update `TECH_STACK.MD`, log the change in `.memory_bank/changelog.md`, and close the task.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
