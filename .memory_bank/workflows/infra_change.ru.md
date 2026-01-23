# Workflow: Infrastructure Change

1. **Старт**
   - Создай задачу: `make task NAME="Infra: ..."`.
   - Проверь `context/infrastructure.md` и `context/security.md`.

2. **Влияние**
   - Определи, какие команды, порты и шаги сборки меняются.
   - Реши, нужны ли изменения Docker или Makefile.

3. **Изменение**
   - Обнови конфиги (`Dockerfile`, `docker-compose.yml`, `Makefile`).
   - Проверь `npm run dev` и `make up`.

4. **Документация**
   - Обнови `context/infrastructure.md`.
   - Зафиксируй изменения в `.memory_bank/changelog.md`.

5. **Закрытие**
   - Отметь задачу выполненной и обнови `current_tasks.md`.

## Версии зависимостей
- Можно использовать context7 для проверки актуальных версий библиотек и необходимых зависимостей перед обновлениями.
