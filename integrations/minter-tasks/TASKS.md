# Tasks — модуль задач для TON Minter

Дополнение к `ton-blockchain/minter`: локальный планировщик задач для работы с Jetton'ами.

## Что добавлено

- отдельная страница `/tasks` (маршрут + ссылка «Tasks» в шапке);
- создание задачи (заголовок + описание);
- отметка «выполнено» (toggle), удаление задачи;
- фильтры All / Active / Completed и счётчики Total / Active / Completed;
- привязка задачи к **Jetton master address** и/или к **подключённому кошельку**;
- переключатель «показывать только задачи текущего Jetton / кошелька»;
- «Clear completed» — массовая очистка выполненных;
- персистентность в `localStorage` через `recoil-persist` (ключ `quasar:tasks`);
- сохранение query-параметров (`?testnet=true`, `?jetton=...`) при навигации.

## Файлы

| Файл                                              | Тип     | Назначение                                                          |
| ------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `src/store/tasks-store/index.ts`                  | новый   | Recoil-атом задач + persist в localStorage                          |
| `src/store/tasks-store/useTasksStore.ts`          | новый   | Хук-контроллер: add / toggle / update / remove / clear + статистика |
| `src/pages/tasks/index.tsx`                       | новый   | Страница Tasks (UI)                                                 |
| `src/pages/tasks/styled.tsx`                      | новый   | Стили страницы (MUI `styled`)                                       |
| `src/pages/index.ts`                              | изменён | Экспорт `TasksPage`                                                 |
| `src/consts.ts`                                   | изменён | Добавлен `ROUTES.tasks = "/tasks"`                                  |
| `src/App.tsx`                                     | изменён | Подключён маршрут `/tasks`                                          |
| `src/components/header/headerMenu/HeaderMenu.tsx` | изменён | Ссылка «Tasks» в навигации                                          |

## Проверка

- `npx tsc --noEmit` — без ошибок;
- `npm run build` (`react-app-rewired build`) — успешно, `build/` готов.

## Запуск

```bash
npm install
npm start          # http://localhost:3000/tasks
npm run build
```

Стек без изменений: React 18, TypeScript 4.7, Create React App (`react-app-rewired`),
MUI v5, Recoil + `recoil-persist`, TON Connect UI React, `ton`.
