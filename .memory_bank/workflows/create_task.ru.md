# Workflow: Create Memory Bank Task

1. Определи короткое название задачи (`NAME`) и описание (`DESC`).
2. Запусти `make task NAME="..." [DESC="..."]`.
   - Создастся `.memory_bank/tasks/task_<slug>_<hash>.md`.
   - В `current_tasks.md` появится чекбокс.
3. Заполни Summary и Notes в карточке задачи.
4. Заверши через `make task-done ID=task_slug_hash`.
5. Обнови `changelog.md`, если изменение существенное.

## Версии зависимостей
- Можно использовать context7 для проверки актуальных версий библиотек и необходимых зависимостей перед обновлениями.
