# Workflow: Bug Fix (UI)

1. **Context**
   - Check `.memory_bank/current_tasks.md` to confirm the bug is tracked.
   - If missing, create: `make task NAME="Bug: ..."`.

2. **Prep**
   - Collect repro steps (screen, viewport size, browser).
   - Identify affected components/screens.

3. **Diagnose**
   - Isolate the issue (Tailwind classes, layout, component state).
   - Use temporary outlines/spacing helpers if needed.

4. **Fix**
   - Update styles or logic.
   - Verify hover/focus/active states and responsive behavior.
   - Run `npm run lint` and `npm run typecheck` if needed.

5. **Docs**
   - Update the task card in `.memory_bank/tasks/`.
   - If the fix changes component rules, update `CODING_STYLE.MD` or `TECH_STACK.MD`.

6. **Close**
   - Mark the task done (`make task-done ID=...`).
   - Add a note to `.memory_bank/changelog.md`.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
