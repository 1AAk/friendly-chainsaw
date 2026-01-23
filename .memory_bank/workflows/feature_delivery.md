# Workflow: Feature Delivery (UI/UX)

1. **Define**
   - Capture goals and acceptance criteria in `make task NAME="Feature: ..."`.
   - Gather references or sketches if available.

2. **Design**
   - Decide which components and screens are affected.
   - Update design tokens in `tailwind.config.cjs` if needed.

3. **Build**
   - Create or refine shared components.
   - Assemble an example screen or interaction demo.
   - Follow `CODING_STYLE.MD`.

4. **Check**
   - Run `npm run lint` and `npm run typecheck`.
   - Validate mobile/desktop responsiveness.

5. **Document**
   - Update `PROJECT_ROADMAP.MD` and `TECH_STACK.MD` if relevant.
   - Add a note to `.memory_bank/changelog.md`.

6. **Close**
   - Mark the task done (`make task-done ID=...`).
   - Ensure `current_tasks.md` is up to date.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
