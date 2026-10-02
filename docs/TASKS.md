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

## P0 — Авторизация AI-оракула

- [x] **A-67 Экономика управлялась по адресу отправителя, без криптографического подтверждения.**
  - Файлы: `contracts/quasar.tact` (`QuasarMaster`), `scripts/ai_oracle.ts`,
    `tests/ai_oracle_signed.test.ts`.
  - Проблема: `_requireAiAccess()` проверял только `sender() == self.aiOracle`, а
    `AISetTreasuryDirect`, `AISetBuybackDirect`, `AIToggleTrading`,
    `AIEmergencyPause`, `AISetFee`, `AISetAntiWhale` меняли казну, buyback,
    торговлю и комиссии. Компрометация одного адреса = полный контроль над
    экономикой; подпись решения нигде не проверялась.
  - Исправление: в контракт добавлены `aiOraclePubKey: Int as uint256`,
    `aiNonce: Int as uint64`, `aiSignedDecisionCount` и receive
    `AISignedDecision` (opcode `0x7a1e5c01`). Проверяется Ed25519-подпись
    (`checkSignature(signed.hash(), msg.signature, self.aiOraclePubKey)`) над
    ячейкой `domain(32) | queryId(64) | nonce(64) | validUntil(32) | action(8) |
    value(16) | payloadHash(256)`. Домен `0x51a5c3d2` отделяет подпись от любого
    другого layout-а. Replay закрыт дважды: строго возрастающий `nonce` **и**
    expiry `validUntil`. `sender()` намеренно не проверяется — авторитет даёт
    подпись, поэтому релеем может быть любой горячий кошелёк. Ключ ставит и
    снимает только владелец (`SetAiOracleKey` / `ClearAiOracleKey`); без ключа
    подписанные решения инертны (`No oracle key`). Приостановка
    (`action = 2`) не снимается без `aiFullAutonomy`, а сами подписанные
    действия пишутся в тот же обратимый лог, поэтому `OwnerOverride` их
    откатывает.
  - Проверка: `tests/ai_oracle_signed.test.ts` (14 тестов на `@ton/sandbox`:
    приём от недоверенного релеера, отказ при чужой подписи, подмена значения,
    replay, меньший nonce, истёкший срок, отсутствие ключа, откат через
    `OwnerOverride`).

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

- [~] **T-08 Нет мультисига владельца (только таймлок 48 ч).**
  - Файл: `contracts/quasar.tact:1563-1588` (`ProposeOwner`/`AcceptOwner`).
  - План: подключить внешний multisig (2-of-N) как `pendingOwner` без изменения
    логики таймлока; `QuasarAdminTimelock` уже рассчитан на это.
  - Runbook готов: `docs/MULTISIG_HANDOFF_RUNBOOK.md` (issue #86). Кодовых
    изменений не требует; остаётся внешняя testnet-операция с evidence.

- [x] **T-09 Лотерея/`randomInt` для денежного приза — требуется commit-reveal.**
  - Проверено: `grep -n "randomInt" contracts/*.tact` в текущем коде ничего не
    находит → источник TVM-случайности удалён, риск закрыт на уровне кода.
  - План: если лотерея вернётся — только схема commit-reveal.
  - Проверка (2026-10-02): `grep -rn "randomInt" contracts/` — совпадений нет;
    пункт закрыт на уровне кода.

- [x] **T-10 Fee-путь `exitCode = 5`, зафиксированный в NOTES-WIP.md.**
  - Файл: `docs/NOTES-WIP.md` (наблюдение от 2026-09-20).
  - Проблема: симптом не воспроизводится на текущем `main`; инвариант
    «DeFi fee reserve reconciliation» в `scripts/security_check.ts` проходит,
    suite — 112/112 pass.
  - Проверка: `tests/hardening_2026_09_25.test.ts` (`F-22`) воспроизводит fee
    с buyback и подтверждает, что accounting commit не откатывается.

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

## P4 — Аудит 2026-10-02

- [x] **T-17 TEP-64 off-chain хостинг метаданных (issue #77).**
  - Файлы: `website/metadata.json`, `scripts/deploy_all.ts`, `.env.example`.
  - Проблема: `raw.githubusercontent.com` отдаёт `metadata.json` как
    `text/plain`; TEP-64 off-chain URI должен указывать на JSON-документ, иначе
    кошельки/индексеры отклоняют метаданные. `metadata.json.image` также вёл на
    raw-хост.
  - Исправление: `JETTON_METADATA_URL` по умолчанию указывает на GitHub Pages
    (`application/json`), `image` — на Pages-asset (`image/png`), а deploy
    preflight теперь отвергает не-JSON content type.
  - Проверка: `tests/audit_2026_10_02.test.ts`.

- [x] **T-18 Единый источник версии Node для CI.**
  - Файлы: `.github/workflows/ci.yml`, `.nvmrc`.
  - Проблема: CI собирал на Node 24 при `.nvmrc`=22 — локальный зелёный прогон
    не подтверждал CI, а code hash мог разъехаться.
  - Исправление: CI читает версию из `.nvmrc` (`node-version-file`).
  - Проверка: `tests/audit_2026_10_02.test.ts`.

- [x] **T-19 Защищённый ИИ-агент и удаление auto-merge (issue #94).**
  - Файлы: `.github/workflows/ai-fix.yml`, `GEMINI.md`,
    `docs/ai/AI_ISSUE_AGENT.md`; удалён `autopilot-automerge.yml`.
  - Проблема: прежний autopilot включал auto-merge для любого PR без review.
  - Исправление: агент запускается только по метке `ai-fix` от доверенного
    участника, работает в ветке `ai/<issue>-*`, открывает draft PR и не имеет
    доступа к deploy-секретам; авто-merge workflow удалён.
  - Проверка: `tests/audit_2026_10_02.test.ts`.

- [x] **T-20 Исправления TON/Tact из спецификации аудита v3.0.**
  - Файлы: `contracts/quasar.tact`, `contracts/quasar_defi.tact`,
    `tests/audit_h02_m01_l01.test.ts`, `tests/core_functions.test.ts`,
    `tests/security_regression.test.ts`, `tests/v5_governance.test.ts`.
  - Buyback: master принимает callback с запасом на inbound fee (`0.02 TON`);
    DeFi делает его bounceable и при отказе возвращает TON-резерв и fee
    accumulator. Bounce handler читает только query ID и TON amount — поле
    `qsrSwapped` не помещается в 224-битный bounced prefix.
  - RemoveLiquidity: оба leg используют один payout ID; QSR отправляется
    первым, а подтверждённый `TokenExcesses` от вычисленного Jetton wallet
    запускает TON leg. При отказе QSR позиция полностью откатывается; при
    bounce TON после подтверждённого QSR откатывается только TON, а LP burn и
    QSR settlement остаются финальными. Bounce `SwapToTON` возвращает TON и
    право на QSR-депозит.
  - `PoolPayout.responseDestination` задаётся явно: master wallet для master
    payout и DeFi-контракт для settlement-подтверждений. Initial LP quote
    вычитает заблокированную minimum liquidity (или возвращает 0), а
    governance kind 3 синхронно выставляет `tradingEnabled = !flag` и сохраняет
    snapshot fee.
  - Проверки: `npm ci`, `npm run build`, `npm run lint`,
    `npm run security:check`, `npm test` (182 passed), `npx tsc --noEmit`,
    `npm run abi:verify`, `npm run abi:dapp`, `npm run abi:update`,
    `npm run hashes:build`.
  - Изменение storage/layout контрактов меняет code hashes и адреса; только до
    публичного деплоя и с обязательным человеческим review.

---

## Порядок закрытия

1. P1 — конформанс (блокирует интеграции), закрывается с тестами.
2. P2 — устойчивость (T-04…T-06), требует паузы перед публичным деплоем.
3. P3 — продукт (решения владельца).
4. P4 — сеть/веб (по готовности секретов и Pages).

T-11/T-12 реализуют проверяемую часть P4. Реальный testnet deployment,
публикация адресов и live smoke остаются явными внешними операциями и не
выполняются CI без disposable wallet.
