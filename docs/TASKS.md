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
  - Обоснование по документации: [TON secure programming](https://docs.ton.org/v3/guidelines/smart-contracts/security/secure-programming)
    требует учитывать storage fees и явный balance reserve при оценке газа и
    запрещает проектировать контракт в расчёте на «дозалив» TON извне.
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

- [x] **T-07 Community Veto / escrow.**
  - Файлы: `contracts/quasar.tact`, `tests/v5_governance.test.ts`, `README.md`.
  - `VetoAIAction` принимает QSR только от существующего стейкера и только из
    отдельного custody-депозита: principal stake нельзя посчитать повторно.
    Escrow агрегируется по action, порог берётся из `vetoThresholdBps` от
    `totalStaked` (по умолчанию 10%), а достижение порога восстанавливает полный
    snapshot действия и помечает его `vetoed`.
  - `OwnerOverride` не может обходить уже наложенное veto. `ReleaseVeto` доступен
    после veto/закрытия окна и использует typed `PendingMasterPayout`; bounce
    восстанавливает escrow, action tally и `totalVetoStake`, поэтому повторный
    release не может удвоить возврат.
  - Проверка: build, security-check и on-chain regression test veto/release.

- [x] **T-08 Мультисиг владельца как `pendingOwner` вместо одиночного EOA-деплоера.**
  - Файлы: `scripts/deploy_all.ts` (STEP 2.5), `contracts/quasar_admin.tact`,
    `contracts/quasar.tact` (`ProposeOwner`/`AcceptOwner`).
  - Статус: механизм реализован. Деплой разворачивает `QuasarAdminTimelock`
    (allow-list целевых адресов Master/DeFi, `minDelay` ≥ 86400 с,
    replay-protection по `callId`, путь отмены) и предлагает его владельцем обоих
    контрактов; ключ деплоера перестаёт быть единоличным администратором.
  - Внешнее (не CI): сам multisig-кошелёк, задаваемый `TIMELOCK_ADMIN`, и
    принятие владения (`AcceptOwner` / `AcceptPoolOwner` после таймлока).

- [x] **T-09 Лотерея/`randomInt` для денежного приза — требуется commit-reveal.**
  - Проверено повторно: `grep -rn "randomInt\|random(" contracts/*.tact` не
    находит ни одного совпадения → источник TVM-случайности удалён, риск закрыт
    на уровне кода. Денежных призов, зависящих от предсказуемой случайности, нет.
  - Обоснование по документации: [TON security best practices](https://docs.ton.org/v3/guidelines/smart-contracts/security/secure-programming)
    прямо указывает, что встроенные функции случайности псевдослучайны и зависят
    от logical time, поэтому для критичных приложений рекомендуется схема
    commit-and-disclose вместо опоры на on-chain randomness.
  - План: если лотерея вернётся — только схема commit-reveal.

- [x] **T-10 Fee-путь `exitCode = 5`, зафиксированный в NOTES-WIP.md.**
  - Файл: `docs/NOTES-WIP.md` (наблюдение от 2026-09-20).
  - Проблема: симптом не воспроизводится на текущем `main`; инвариант
    «DeFi fee reserve reconciliation» в `scripts/security_check.ts` проходит,
    suite — 131/131 pass.
  - Проверка: `tests/hardening_2026_09_25.test.ts` (`F-22`) воспроизводит fee
    с buyback и подтверждает, что accounting commit не откатывается.

---

## P1 — Консистентность тулчейна и release-гейтов

- [x] **T-17 `.nvmrc` объявлен единственным источником версии Node, CI его читает.**
  - Файлы: `.nvmrc`, `.github/workflows/ci.yml`, `package.json`, `scripts/security_check.ts`.
  - Проблема: CI ставил Node 24 литералом, а `.nvmrc` содержал 22 при
    `engines: ^22 || ^24`. Локальная проверка и CI шли на разных мажорных
    версиях, поэтому «зелёный» локальный прогон не подтверждал CI-прогон.
  - Исправление: `.nvmrc` = 24 (совпадает с CI и верхней границей `engines`),
    `actions/setup-node` переведён на `node-version-file: .nvmrc`, а
    `security:check` падает, если файлы расходятся.
  - Проверка: инвариант `node toolchain is pinned by .nvmrc`, `npm test` (131/131).

- [x] **T-18 В CI не запускался валидатор артефакта деплоя.**
  - Файлы: `.github/workflows/ci.yml`, `scripts/check_deployment.ts`.
  - Проблема: `npm run deployment:check` существовал, но CI его не вызывал, а сам
    `package.json` не объявлял `npm run lint` (Tact type-check) отдельным шагом
    с зависимостью от сборки.
  - Исправление: добавлен шаг `Validate the published deployment artifact`
    (проверка сети, адресов, decimals и отсутствия deployer/secrets; отсутствие
    артефакта — не ошибка, а корректное «no deployment published»).
  - Проверка: `npm run deployment:check` → exit 0 без артефакта.

- [x] **T-19 `.env.example` не документировал переменные, которые читает код.**
  - Файлы: `.env.example`, `scripts/deploy_all.ts`, `scripts/check_tonconnect.ts`,
    `scripts/check_deployment.ts`.
  - Проблема: `AI_ORACLE_ADDRESS`, `JETTON_CONTENT_LAYOUT`, `TON_CONNECT_ORIGIN`,
    `TON_CONNECT_MANIFEST_URL` и `DEPLOYMENT_FILE` использовались в скриптах, но
    отсутствовали в примере окружения — оператор не мог узнать о них из репозитория.
  - Исправление: все переменные добавлены с описанием и безопасными значениями
    по умолчанию.
  - Проверка: `grep -o 'process.env.[A-Z_]*' scripts/*.ts | sort -u` ⊆ `.env.example`.

- [x] **T-20 TEP-64 дефолт для off-chain content должен отдавать `application/json`.**
  - Файлы: `.env.example`, `scripts/deploy_all.ts`, `docs/F01_REMEDIATION.md`.
  - Проблема: дефолтный `JETTON_METADATA_URL` указывал на `raw.githubusercontent.com`,
    который отдаёт `text/plain; charset=utf-8` вместо `application/json`.
    Content-ячейка необратима без 48-часового таймлока, поэтому дефолт должен
    указывать на origin, отдающий корректный MIME.
  - Факт (проверено HTTP-заголовками): `https://alexkkkkk.github.io/QUASAR/metadata.json`
    → `application/json; charset=utf-8`, а `raw.githubusercontent.com/.../metadata.json`
    → `text/plain; charset=utf-8`. GitHub Pages-артефакт уже публикует корректный MIME.
  - Статус: MIME-факт зафиксирован в документации; смена значения по умолчанию
    намеренно оставлена за владельцем, поскольку она меняет аргумент `init` и,
    следовательно, код-хеш адреса контракта.

---

## P4 — Сеть, деплой, веб

- [x] **T-11 `website/deployment.json` генерируется из verified deployment artifacts.**
  - Файлы: `scripts/deploy_all.ts`, `scripts/deploy_defi.ts`,
    `scripts/check_deployment.ts`, `website/config.js`.
  - Полный и DeFi-only deploy записывают один и тот же artifact в `build/` и
    `website/`; валидатор проверяет сеть, адреса, decimals и отсутствие
    deployer/secrets перед публикацией. Артефакт намеренно git-ignored: адреса
    появляются на Pages только после явного deploy.

- [x] **T-12 Манифест TON Connect имеет offline- и live-smoke проверки.**
  - Файлы: `website/tonconnect-manifest.json`,
    `scripts/check_tonconnect.ts`, `tests/tonconnect_feedback.test.ts`.
  - Offline-проверка остаётся частью security gate; `npm run tonconnect:smoke`
    проверяет JSON MIME, origin, icon и policy URLs после публикации Pages.

## P1 — TON Docs conformance matrix

- [x] **T-13 Матрица TEP/TL-B и границы on-chain/off-chain.**
  - Файл: docs/TON_CONFORMANCE_MATRIX.md.
  - Зафиксированы opcode, сериализация, sender check, bounce/excess behaviour, getter ABI и тест для TEP-74, TEP-64 и TEP-89.
  - TON Connect, API/indexer, Pages, Tolk migration, multisig и независимый аудит остаются отдельными задачами; исходники контрактов не делают неподтверждённых claims о mainnet.
  - Проверка: существующие conformance/security/property tests и CI.

- [x] **T-14 Read-only TON API v2 adapter.**
  - Файл: `scripts/lib/ton_api.ts`.
  - Реализованы ограниченная пагинация, чтение транзакций и проверка Jetton
    wallet только против allowlisted master. Подпись и отправка транзакций
    намеренно не входят в adapter.
  - Документация: `docs/OFFCHAIN_INTEGRATIONS.md`.

- [x] **T-15 Tact → Tolk migration/no-go decision.**
  - Файл: `docs/TOLK_MIGRATION_DECISION.md`.
  - Tact остаётся pinned compiler path до доказательства ABI/TL-B/storage/code
    hash/gas/bounce эквивалентности; адреса и mainnet claims не меняются.
- [x] **T-16 Стабильный getter для резервов DeFi и удаление legacy wire-типа.**
  - Файл: `contracts/quasar_defi.tact`.
  - `get_reserve_snapshot` возвращает LP supply, TON/QSR reserves, fee
    accumulators и farm liabilities одним read-only вызовом. Неиспользуемый
    `DefiPayout` type удалён: реальные выплаты проходят только через
    typed `PoolPayout`/`TonPayout` ledgers с bounce recovery.
  - Проверка: `tests/core_functions.test.ts`, `npm run abi:verify`.

---

## Порядок закрытия

1. P1 — конформанс (блокирует интеграции), закрывается с тестами.
2. P2 — устойчивость (T-04…T-06), требует паузы перед публичным деплоем.
3. P3 — продукт (решения владельца).
4. P4 — сеть/веб (по готовности секретов и Pages).

T-11/T-12 реализуют проверяемую часть P4. Реальный testnet deployment,
публикация адресов и live smoke остаются явными внешними операциями и не
выполняются CI без disposable wallet.
