# Workflow: Dependency Update

1. **Старт**
   - Создай задачу: `make task NAME="Deps: ..."`.
   - Проверь `TECH_STACK.MD` и `context/security.md`.

2. **Проверка**
   - Используй context7 для поиска актуальных версий и совместимости.
   - Отметь breaking changes и требования peer-зависимостей.

3. **План**
   - Определи масштаб обновления (patch/minor/major).
   - Проверь совместимость Node/Vite/Tailwind с целевыми версиями.

4. **Обновление**
   - Обнови версии в `package.json`.
   - Установи зависимости и запусти `npm run typecheck`, `npm run lint`, `npm run build`.

5. **Проверка и документация**
   - Смоук-тест `npm run dev` (и `make up`, если используешь Docker).
   - Обнови `TECH_STACK.MD`, зафиксируй изменения в `.memory_bank/changelog.md` и закрой задачу.

## Версии зависимостей
- Можно использовать context7 для проверки актуальных версий библиотек и необходимых зависимостей перед обновлениями.
