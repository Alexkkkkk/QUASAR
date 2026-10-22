# Доработка QUASAR — 2026-10-22

В отдельной ветке `ai/107-completion-hardening` реализованы четыре подтверждённых исправления интерфейсов и согласована документация аудита с исходным `main` `e87b56178f2c226c222b86958cc2defcbc96a68e`. Это частичная инженерная доработка, а не закрытие всех задач, независимый аудит или разрешение на mainnet. `main` не изменён; merge, deployment, подпись транзакций и другие on-chain действия не выполнялись. Секреты и env-файлы не читались.

## Реализованные изменения

В `website/amounts.js` добавлен точный парсер decimal string → BigInt. Суммы для swap, ликвидности, stake и unstake в `website/index.html` больше не проходят через `Number`, `parseFloat` и округление. Парсер отвергает нулевые и отрицательные значения, экспоненциальную запись, лишние десятичные знаки и превышение TON Coins `2^120−1`. Slippage также переводится в basis points точной целочисленной арифметикой.

В `website/tonconnect.js` проверяются явная конфигурация testnet, корректность обоих адресов, сеть кошелька `-3` и совпадение текущего account с зафиксированным отправителем непосредственно перед запросом подписи. В TON Connect request передаются `network` и `from`. При QSR deposit смена account во время getter-запроса отменяет отправку. Штатные deployment artifacts с обычными friendly-адресами и валидные raw-адреса поддерживаются; адрес назначения нормализуется в testnet-friendly представление перед подписью. Недеплоенный интерфейс остаётся отключённым.

Общий mutex предотвращает второй запрос подписи, пока первый не завершён. Controls выключаются на время запроса, а `finally` восстанавливает их прежнее состояние после успеха или ошибки. Восстановление не включает controls, которые изначально были отключены из-за отсутствия deployment.

В `integrations/minter-tasks/src/pages/tasks/index.tsx` default Jetton master обновляется при смене query-параметра без remount. Ручной ввод пользователя при навигации сохраняется. Добавлены два поведенческих React-теста с `MemoryRouter`.

`docs/AUDIT_STATUS.md` согласован с текущими merged исправлениями H-1/M-1, audit-pack M-3/M-4 и переименованием `ToggleMinting`. Исторические записи отделены от актуального состояния. Сохранены legacy AI trust boundary, независимый аудит и deployment release gates.

## Фактические проверки

На исходной базе выполнен `npm ci`, затем полный `npm test`: сборка Tact, security check, 254 Node-теста и 27 Python-тестов прошли. После website-исправлений полный `npm test` повторно прошёл с 258 Node-тестами и 27 Python-тестами. После точечной коррекции совместимости адресов финальный прогон `node --import tsx --test tests/*.test.ts` сообщил **259 passed, 0 failed**; Python suite — **27 passed**. Контракты не менялись, поэтому ранее построенные contract artifacts остаются теми же.

На итоговой версии успешно выполнены `npm run lint`, `npm run security:check`, `npx tsc --noEmit`, `npm run abi:verify`, `npm run abi:dapp`, `npm run deployment:check`, `npm run pins:check`, `npm run hub:audit`, `npm run hub:test`, отдельные autopilot/swarm tests, `node --check` для браузерных JS-файлов и `git diff --check`. Это локальные проверки, не результат GitHub Actions для новой ветки. `deployment:check` не означает, что контракт развёрнут или live smoke выполнен.

Вложенный dApp проверен в отдельной копии без `.env*`: `npm ci`, `npx tsc --noEmit`, `CI=true npm run build` прошли; финальные Jest-тесты — **15 suites, 87 passed**. Сборка оставляет предупреждения об отсутствующих source maps в стороннем TON Connect SDK, но завершается успешно.

## Что блокирует полное завершение

**Корневая dependency security gate не проходит.** `npm audit --audit-level=high` возвращает 1 high-severity vulnerability: `follow-redirects@1.16.0`, advisories `GHSA-q3jh-wrc6-jgq8` и `GHSA-8r9p-f939-6h3c`. Исправление на `1.16.1` уже представлено в открытом [PR #242](https://github.com/Alexkkkkk/QUASAR/pull/242), но не merged. Корневой lock-файл защищён `AGENTS.md`; разрешение на узкое изменение было запрошено, ответа на момент этого отчёта нет. Ни существующий PR, ни main не менялись.

**Dependency audit dApp также не проходит:** 57 записей — 50 high и 7 moderate. Это включает транзитивные цепочки инструментария; число не означает 57 независимых уязвимостей опубликованного браузерного приложения. Прямые advisory roots — `braces`, `sprintf-js` и `react-router`. На дату проверки npm registry сообщает последние версии `braces@3.0.3` и `sprintf-js@1.1.3`, которые всё ещё входят в уязвимые диапазоны; предполагаемых `3.0.4`/`1.1.4` нет. Автоматический `npm audit fix --force` предлагает ломающий downgrade `react-scripts` и не применялся. Исправление router advisories требует отдельно проверяемой major-миграции на React Router 7; она не выполнена. Нужны рассмотрение достижимости рисков, обновление/замена build/test tooling либо исправленные upstream releases. Audit suppression и ослабление проверок не применялись.

**Автоматизация имеет воспроизводимый workflow-сбой.** [Run 39757069564](https://github.com/Alexkkkkk/QUASAR/actions/runs/39757069564) падает в scout с `Matching delimiter not found 'GEMINI_PROMPT_EOF'`. Локальное выполнение фактического shell step с `problems.json` без trailing newline воспроизводит `[]GEMINI_PROMPT_EOF` вместо delimiter на отдельной строке. Аналогичный шаблон есть в `_idle-agent.yml`. Эти workflow-файлы защищены; подготовлен отдельный неприменённый патч и запрошено разрешение на их узкое исправление. Workflow permissions, guards, triggers и агентские ограничения не изменены.

Из-за красных обязательных dependency gates **draft PR для этой ветки не создан**: `AGENTS.md` прямо запрещает создавать PR, если хотя бы одна обязательная проверка падает. Ветка сохранена для продолжения, но процесс «ветка → draft PR → GitHub CI → человеческий review» ещё не завершён. Проверки GitHub Actions новой ветки не выдаются за пройденные.

## Незакрытые продуктовые и внешние задачи

Независимый аудит (#62), канонические deployment addresses, live testnet smoke и multisig handoff требуют внешнего исполнителя или явных операций владельца. Они не могут быть закрыты локальной сборкой. Roadmap также сохраняет production buyback recovery, standard LP Jetton и отдельный governance/veto vault; эти изменения затрагивают защищённые контракты и требуют отдельного проектирования и человеческого review. Мосты и production AI deployment остаются будущими задачами, а не реализованными возможностями.

Для продолжения сначала требуется решение владельца по защищённым исправлениям и dependency blockers. Затем — зелёные обязательные проверки, draft PR и проверка в GitHub Actions. До этого проект не объявляется полностью завершённым, независимо аудированным или готовым к реальным средствам.
