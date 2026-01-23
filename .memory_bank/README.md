# Memory Bank Overview

Memory Bank is a lightweight context store for the UI/UX learning project. It keeps goals, infrastructure, and active tasks easy to find without scanning the entire repo.

## Structure
- `context/` - stable project facts (goals, infra, safety, UI routes/examples).
- `current_tasks.md` - current priorities.
- `tasks/` - task cards (`task_<slug>_<hash>.md`) + archive.
- `workflows/` - session workflows (bug fix, feature delivery, infra change, dependency update).
- `changelog.md` - short session notes.

## How to use
1. Before work: read this file, then `context/*.md` and `current_tasks.md`.
2. During work: follow the relevant workflow in `workflows/`.
3. After work: update context and add a note to `changelog.md`.

## Maintenance rules
- Keep docs short and factual; link to `PROJECT_ROADMAP.MD`, `TECH_STACK.MD`, `CODING_STYLE.MD`.
- Any stack or infra change must be reflected here and in the main docs.
- Add a workflow for repeated procedures.

Memory Bank helps keep context consistent between sessions.

## Dependency versions
- You can use context7 to check the latest versions of libraries and required dependencies before updates.
