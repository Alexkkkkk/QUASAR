# QUASAR — задание (открытые findings и работы)

Источник истины по незакрытым пунктам аудита и запланированному функционалу.
Формат: `[ ]` — открыто, `[x]` — сделано и подтверждено сборкой/тестами.
Каждый пункт содержит `file:line`, проблему и план исправления.

База: `main`. Проверка каждого пункта — только через `npm run build`,
`npx tsc --noEmit`, `npm run security:check`, `node --import tsx --test tests/*.test.ts`.

---

## P1 — Конформанс стандартам TON

- [x] **T-01 TEP-89 (wallet leg): Jetton-кошелёк не отвечал на `provide_wallet_address`.**
  - Файл: `contracts/quasar_common.tact` (контракт `QuasarWallet`).
  - Проблема: мастер реализовывал TEP-89 (`contracts/quasar.tact:1712`), но сам
    jetton-кошелёк — нет. По TEP-89 сторона кошелька обязана отвечать
    `take_wallet_address#d1735400` (mode 64), чтобы произвольный контракт мог
    узнать собственный jetton-кошелёк для этого мастера.
  - Исправление: добавлены объявления `ProvideWalletAddress` (0x2c76b973) и
    `TakeWalletAddress` (0xd1735400) в общий файл (единая точка истины) и
    `receive(msg: ProvideWalletAddress)` в `QuasarWallet`, возвращающий
    `myAddress()`; `ownerAddress:(Maybe ^MsgAddress)` — ссылкой, как требует
    TL-B; порог `context().value >= ton("0.0061")` (5000 gas-units + lump +
    cell price), ответ отправляется с mode 64.
  - Проверка: `tests/tep89_wallet_discovery.test.ts` (on-chain, `@ton/sandbox`).

- [x] **T-02 TEP-74: дерево сообщений `transfer`/`internal_transfer`/`burn`/`excesses`/`burn_notification`.**
  - Файл: `contracts/quasar_common.tact:6-26`.
  - Статус: соответствует TL-B TEP-74 (проверено `tests/conformance_2026_09_26.test.ts`).

- [x] **T-03 TEP-64: `jetton_content` в metadata + доступный MIME.**
  - Файл: `website/metadata.json`, `.env.example:JETTON_METADATA_URL`.
  - Статус: content-ячейка формируется в скрипте деплоя, URL валидируется
    preflight-проверкой.

---

## P2 — Устойчивость контрактов (по документации TON)

- [x] **T-04 Явный `storageReserve` во всех долгоживущих контрактах.**
  - Файлы: `contracts/quasar.tact` (`QuasarMaster`), `contracts/quasar_defi.tact`
    (`QuasarDeFi`), `contracts/quasar_admin.tact` (`QuasarAdminTimelock`).
  - Проблема: `BaseTrait` объявляет `virtual const storageReserve: Int = 0`
    (`@stdlib/deploy` → `base.tact`), и только при значении > 0 `self.forward()` /
    `self.reply()` ставят `nativeReserve(storageReserve, ReserveExact)`
    (RAWRESERVE, `@stdlib/.../reserve.tact`). Сейчас резерв равен нулю, поэтому
    долгоживущий мастер с большим словарём (`stakers`, `aiActionLog`, `priceHistory`)
    может быть заморожен, когда баланс уйдёт в ноль.
  - Исправление: добавлен общий `QUASAR_STORAGE_RESERVE = 0.05 TON` и
    `override const storageReserve` в `QuasarMaster`, `QuasarDeFi` и
    `QuasarAdminTimelock`; sweep-пути используют ту же константу.
  - Риск: `override const` не меняет layout storage, но меняет код-хеш → адреса
    контрактов сдвинутся. Изменение допустимо только до публичного деплоя.
  - Проверка: сборка, `scripts/security_check.ts` и security regression suite.

- [x] **T-05 Магическая константа `ton("0.05")` в `SweepTON` обоих контрактов.**
  - Файлы: `contracts/quasar.tact:1702-1707`, `contracts/quasar_defi.tact:697-701`.
  - Проблема: минимальный запас газа зашит литералом в четырёх местах; при
    изменении модели газа расчёт разъедется молча.
  - Исправление: sweep-проверки Master и DeFi используют общий
    `QUASAR_STORAGE_RESERVE`; исходная газовая граница сохранена.
  - Проверка: `security_check.ts` и `tests/security_regression.test.ts`.

- [x] **T-06 `maxWalletBps` хранится и валидируется, но не применяется.**
  - Файл: `contracts/quasar.tact` (конфиг), `contracts/quasar_common.tact:54-62`.
  - Проблема: кошелёк жёстко проверяет 3% собственного баланса литералом
    `30_000_000_000_000_000`, а `maxWalletBps` из мастера читать не может
    (контракт не читает состояние другого контракта). Изменение `maxWalletBps`
    владельцем/AI не влияет ни на что.
  - Решение: выбрана безопасная модель compiled wallet policy. `maxTxBps`,
    `maxWalletBps` и `cooldown` теперь имеют общие константы в
    `contracts/quasar_common.tact`; лимиты кошелька вычисляются из hard cap и
    этих констант, а Master и AI принимают только те же значения. Это убирает
    ложную возможность записать в Master значение, которое кошелёк не сможет
    применить.
  - Миграция: изменение политики требует `ProposeWalletCode` → 48h →
    `Apply Wallet Code`; существующие кошельки не меняют адрес и код задним
    числом. После миграции новые кошельки получают новую политику, поэтому
    обновление должно сопровождаться планом для уже созданных кошельков.
  - Проверка: `scripts/security_check.ts` и source regression guard проверяют
    единый источник констант, производные caps и запрет рассинхронизированной
    конфигурации.

---

## P3 — Функционал и токеномика

- [ ] **T-07 Community Veto / escrow не включён.**
  - Файл: `README.md` (Feature Matrix), `contracts/quasar.tact` (`vetoThresholdBps`,
    `totalVetoStake` присутствуют).
  - План: включить escrow-путь на основе уже хранимых полей либо убрать поля из
    матрицы фич.

- [ ] **T-08 Нет мультисига владельца (только таймлок 48 ч).**
  - Файл: `contracts/quasar.tact:1563-1588` (`ProposeOwner`/`AcceptOwner`).
  - План: подключить внешний multisig (2-of-N) как `pendingOwner` без изменения
    логики таймлока; `QuasarAdminTimelock` уже рассчитан на это.

- [ ] **T-09 Лотерея/`randomInt` для денежного приза — требуется commit-reveal.**
  - Проверено: `grep -n "randomInt" contracts/*.tact` в текущем коде ничего не
    находит → источник TVM-случайности удалён, риск закрыт на уровне кода.
  - План: если лотерея вернётся — только схема commit-reveal.

- [x] **T-10 Fee-путь `exitCode = 5`, зафиксированный в NOTES-WIP.md.**
  - Файл: `docs/NOTES-WIP.md` (наблюдение от 2026-09-20).
  - Проблема: симптом не воспроизводится на текущем `main`; инвариант
    «DeFi fee reserve reconciliation» в `scripts/security_check.ts` проходит,
    suite — 109/109 pass.
  - Проверка: `tests/hardening_2026_09_25.test.ts` (`F-22`) воспроизводит fee
    с buyback и подтверждает, что accounting commit не откатывается.

---

## P4 — Сеть, деплой, веб

- [ ] **T-11 `website/deployment.json` отсутствует → веб-UI транзакции отключены.**
  - Файл: `website/config.js:addresses` (`master: null`, `defi: null`).
  - План: генерировать `deployment.json` из `scripts/deploy_all.ts` и публиковать
    вместе с сайтом (GitHub Pages), иначе dApp не находит контракты.

- [ ] **T-12 Манифест TON Connect и `iconUrl` — только оффлайн-проверка.**
  - Файл: `website/tonconnect-manifest.json`.
  - Статус: поля соответствуют спецификации (`url`, `name`, `iconUrl`,
    `termsOfUseUrl`, `privacyPolicyUrl`); требуется проверка через GET после деплоя
    Pages (см. `docs/TESTNET_SMOKE_RUNBOOK.md`).

## P1 — TON Docs conformance matrix

- [x] **T-13 Матрица TEP/TL-B и границы on-chain/off-chain.**
  - Файл: docs/TON_CONFORMANCE_MATRIX.md.
  - Зафиксированы opcode, сериализация, sender check, bounce/excess behaviour, getter ABI и тест для TEP-74, TEP-64 и TEP-89.
  - TON Connect, API/indexer, Pages, Tolk migration, multisig и независимый аудит остаются отдельными задачами; исходники контрактов не делают неподтверждённых claims о mainnet.
  - Проверка: существующие conformance/security/property tests и CI.

- [x] **T-14 Read-only TON API v3 adapter.**
  - Файл: `scripts/lib/ton_api.ts`.
  - Реализованы ограниченная пагинация, чтение транзакций и проверка Jetton
    wallet только против allowlisted master. Подпись и отправка транзакций
    намеренно не входят в adapter.
  - Документация: `docs/TON_API_ADAPTER.md`.

- [x] **T-15 Tact → Tolk migration/no-go decision.**
  - Файл: `docs/TOLK_MIGRATION_DECISION.md`.
  - Tact остаётся pinned compiler path до доказательства ABI/TL-B/storage/code
    hash/gas/bounce эквивалентности; адреса и mainnet claims не меняются.

---

## Порядок закрытия

1. P1 — конформанс (блокирует интеграции), закрывается с тестами.
2. P2 — устойчивость (T-04…T-06), требует паузы перед публичным деплоем.
3. P3 — продукт (решения владельца).
4. P4 — сеть/веб (по готовности секретов и Pages).
