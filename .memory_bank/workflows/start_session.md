# Workflow: Start Session With Agent

1. Read `.memory_bank/README.md`, then `context/*.md` and `current_tasks.md`.
2. Check repo status (`git status`).
3. Define the task clearly (goal, acceptance criteria, constraints).
4. Provide the agent with:
   - the task summary;
   - relevant context files;
   - the matching workflow (bug_fix / feature_delivery / infra_change / dependency_update).
5. After the session:
   - review diffs;
   - update `current_tasks.md` and related context;
   - add a note to `changelog.md`.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
