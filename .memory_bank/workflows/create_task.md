# Workflow: Create Memory Bank Task

1. Define a short task name (`NAME`) and optional description (`DESC`).
2. Run `make task NAME="..." [DESC="..."]`.
   - Creates `.memory_bank/tasks/task_<slug>_<hash>.md`.
   - Adds a checkbox line in `current_tasks.md`.
3. Fill Summary and Notes in the task card.
4. Finish with `make task-done ID=task_slug_hash`.
5. Update `changelog.md` if the change is notable.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
