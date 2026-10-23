> Исторические разделы P1 и далее сохраняют журнал прежних работ: Tact-пути и команды в них не являются текущими инструкциями. Актуальные контракты: `tolk/contracts/` + Acton.

# QUASAR — задание (открытые findings и работы)

Источник истины по незакрытым пунктам аудита и запланированному функционалу.
Формат: `[ ]` — открыто, `[x]` — сделано и подтверждено сборкой/тестами.
Каждый пункт содержит `file:line`, проблему и план исправления.

База: `main`. Проверка каждого пункта — только через `npm run build`,
`npx tsc --noEmit`, `npm run security:check`, `node --import tsx --test tests/*.test.ts`.

---

## Актуальная адаптация Tolk — 2026-10-23, #293

Исправления после cutover #290/#291: `scripts/acton_abi.py` и `docs/abi/` теперь
фиксируют полный shape публичных getter-структур, typed cells/maps и различают
`any_address`. Добавлены `tests/test_acton_abi.py` и `tests/test_sync_acton.py`:
codec, offline integrity, lock, validation failures и rollback первого symlink
commit. В `scripts/sync_acton.py` исправлено восстановление прежнего каталога
при отказе публикации.

Tolk-only policy блокирует активные legacy compiler inputs и импорты архивных
wrappers; Quick Start и `.agents/memory/` описывают Acton 1.2.1, Node 22/24 и
Python 3.11+. Регрессии контрактов расширены в `tolk/tests/`, без изменения
`tolk/contracts/`, storage schema, opcodes и bytecode. Независимый аудит и
testnet rehearsal остаются открытыми; deployment и реальные транзакции не входят
в эту задачу.

После обновления `main` (#292) сохранён migration parity gate: schema 3
разрешает `any_address` только для двух существующих TEP-89 owner query fields;
другие address widenings, переименования и изменение optionality отклоняются.

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

- [~] **T-25 TEP-74 funding и Acton mutation testing.**
  - Tolk wallet резервирует `forward_ton_amount` сверх execution allowance и
    отклоняет burn без минимального TON-бюджета; добавлена regression-проверка
    доставки notification при `forward_ton_amount > 0.02 TON`.
  - Добавлены `npm run mutation:changed` и `npm run mutation:contracts` по
    официальной Acton mutation-testing модели с critical/major уровнями и
    минимумом 80%. Полный mutation-прогон остаётся CI/release gate.
  - Treasury payout Master теперь дебетируется до отправки и связывается с
    pending payout для bounce recovery; изменение контрактов меняет code hash
    и адреса нового поколения.
  - Добавлены `npm run coverage:tolk`/`coverage:text` для LCOV и line/branch
    отчётов Acton, а `npm run coverage:wallet` требует 75% blended score для
    TEP-74 wallet suite. Полный baseline 45.5% оставлен открытым backlog для
    расширения Master/DeFi branch tests.

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
- [~] **T-15a Acton toolchain для миграции Tolk.**
  - Файл: `tolk/README.md`, `tolk/Acton.toml`.
  - Установка для разработчика выполняется официальным инсталлятором:
    `curl -LsSf https://github.com/ton-blockchain/acton/releases/latest/download/acton-installer.sh | sh`.
    Проект дополнительно фиксирует Acton `1.2.1` для воспроизводимой проверки.
  - Acton используется для build/test/ABI/wrapper; deployment и on-chain
    операции в рамках этой миграции запрещены. Пункт остаётся открытым до
    прохождения полной Tolk-сборки и regression suite.
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
  - Файлы: `.github/workflows/ai-fix.yml`, `GROQ.md`,
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

- [x] **T-21 Переименование `ToggleTrading` -> `ToggleMinting` (M-4c, issue #179).**
  - Файлы: `contracts/quasar.tact`, `docs/abi/quasar-master.json`,
    `docs/build-hashes.json`, `tests/core_functions.test.ts`,
    `tests/hardening_f34_f38.test.ts`, `tests/security_regression.test.ts`,
    `tests/v5_governance.test.ts`, `tests/audit_pack_v2_application.test.ts`.
  - Проблема: имя `ToggleTrading` вводило в заблуждение — `_requireTrading()`
    вызывается ровно из одного места, `receive(msg: Mint)`, то есть флаг гейтит
    только минт, а P2P-переводы между автономными кошельками его не видят.
  - Исправление: сообщения переименованы в `ToggleMinting` / `AIToggleMinting`
    с **явным закреплением прежних опкодов** (`0xf1822da1`, `0x0490d605`),
    как задано паком аудита (`docs/historical/tact-reference/audit-pack-v2/contracts/quasar_master_fixes.tact.txt`).
    Wire-формат не изменился, поэтому `website/tonconnect.js` и внешние
    интеграции продолжают работать без миграции. Метка в AI-журнале действий
    и строка `OwnerOverride` переведены на новое имя.
  - Проверка: `npm run lint`, `npm run build`, `npm run abi:update`,
    `npm run abi:verify`, `npm run abi:dapp`, `npx tsc --noEmit`,
    `npm run security:check`, `npm test`.
  - Изменение `contracts/**` сдвигает code hash (но не опкоды) — требует
    человеческого review и выполняется до публичного деплоя; адреса должны
    быть пересчитаны перед любой публикацией.

- [x] **T-22 Закрытие последних открытых алертов CodeQL (#212, #214, #222).**
  - Файлы: `tests/audit_2026_10_02.test.ts`, `scripts/ai/swarm/knowledge.mjs`,
    `scripts/deploy_defi.ts`, `tests/code_scanning_regression.test.ts` (новый).
  - Проблема: после PR #229 на `main` оставались три открытых алерта CodeQL,
    каждый из которых заведён autopilot-ом как отдельный issue:
    `js/incomplete-url-substring-sanitization` (#212, 3 вхождения),
    `js/http-to-file-access` (#214, 1 вхождение) и
    `js/file-system-race` (#222, 1 вхождение).
  - Исправление:
    - **#212** — проверка хоста `raw.githubusercontent.com` в
      `tests/audit_2026_10_02.test.ts` переведена с подстроки
      `matrix.includes(...)` на якорную проверку по границам токена: строка
      `http://evil-host/raw.githubusercontent.com` больше не проходит проверку.
    - **#214** — `writeDraft()` в `scripts/ai/swarm/knowledge.mjs` пишет не по
      имени, а через файловый дескриптор, открытый с `O_NOFOLLOW` (0600), поэтому
      символическая ссылка внутри `docs/ai/knowledge/drafts/` не может увести
      запись за пределы каталога; дескриптор закрывается в `finally`.
    - **#222** — в `scripts/deploy_defi.ts` убран TOCTOU-паттерн
      `fs.existsSync()` + `fs.writeFileSync()`: чтение обёрнуто в try/catch, а
      запись `deployment.json` идёт через хелпер `writeJsonAtomic()`
      (temp-файл 0600 -> `fsync` -> `rename`), поэтому частично записанный файл
      не наблюдаем для параллельного читателя.
    - **Пин-тест** `tests/code_scanning_regression.test.ts` фиксирует форму всех
      трёх фиксов, чтобы алерты не вернулись при рефакторинге.
  - Проверка: полный набор из §4 `AGENTS.md` (lint, build, security:check,
    `npm test`, `tsc --noEmit`, abi:verify, abi:dapp, deployment:check,
    pins:check, hub:audit, `npm audit --audit-level=high`).
  - Второй раунд (follow-up ревью): в `writeDraft()` устранён остаточный тейнт
    `js/http-to-file-access` (на head PR алерт всплыл как #19): имя черновика
    сначала сверяется со строгим allow-list `[a-z0-9][a-z0-9._-]*\.md`
    (только нижний регистр, без `path.basename` и разделителей пути), затем
    сегмент пересоздаётся через `unlinkSync` + `openSync(O_CREAT|O_EXCL|
    O_NOFOLLOW, 0600)` — производные от сети данные больше не участвуют в
    выборе цели записи; запись идёт `writeFileSync(fd, ..., { encoding: 'utf8' })`;
    `writeMarkdown()` переведён на ту же дескрипторную запись. Добавлен
    поведенческий тест: подложенный в drafts symlink отклоняется
    (`invalid draft path`), цель симлинка остаётся нетронутой
    (`tests/swarm/swarm.test.mjs`).
    Сам контент черновика производен от сети по дизайну (LLM-polish ради human review):
    у sink добавлен документированный suppression-комментарий CodeQL с обоснованием
    (guard-рейлы scanMarkdown + лимит размера + allow-list + O_NOFOLLOW выше).
  - ⚠ `scripts/deploy_defi.ts` входит в список защищённых путей `AGENTS.md` §3,
    поэтому изменение опубликовано **только draft PR**. После зелёных обязательных
    checks merge может пройти автоматически; любой contract deployment остаётся
    запрещённым. Опкоды, ABI, code hash и адреса не затрагиваются:
    правка касается исключительно способа записи `deployment.json`.

---

## Живой прогон контура: issue #166 (2026-10-12)

Пробный полный цикл из #153 на тестовом issue #166 (метка `ai-fix` от владельца).

- [x] Роутинг: `quasar.yml` -> route выбрал модуль `ai-fix`, остальные задачи — skipped.
- [x] `ai-fix / generate` стартовал с job-правами `contents: read, issues: read`;
      guardrails (protected paths, patch-only, изолированная валидация) не тронуты.
- [x] Первая попытка (2026-10-10) упала на генерации: `Groq API returned HTTP 403` —
      недействительный секрет `GROQ_API_KEY`. Проблема секрета, а не контура.
- [x] Завершение прогона выполнено документным патчем без защищённых путей:
      ветка `ai/166-agent` -> draft PR -> ai-review (состояние на 2026-10-12).
- [ ] Merge и закрытие #166 по closing-keyword — после `SUCCESS` всех текущих
      обязательных checks; человеческий approving review не требуется по
      принятой 2026-10-22 CI-only политике. `ai-merge-ok` — лишь необязательный
      fast-path trigger.

Refs #153, #145, #107.

---

## Порядок закрытия

1. P1 — конформанс (блокирует интеграции), закрывается с тестами.
2. P2 — устойчивость (T-04…T-06), требует паузы перед публичным деплоем.
3. P3 — продукт (решения владельца).
4. P4 — сеть/веб (по готовности секретов и Pages).

T-11/T-12 реализуют проверяемую часть P4. Реальный testnet deployment,
публикация адресов и live smoke остаются явными внешними операциями и не
выполняются CI без disposable wallet.


## P1 — Полный аудит и синхронизация 2026-10-22

- [~] **T-23 Устранение подтверждённых contract, dApp и automation regressions.**
  - Ветка: `ai/full-audit-sync-2026-10`; исходный commit: `51011ad7e96827a77a167c7812e34e223d5f9d8a`.
  - Контракты: outbound Master query IDs получили отдельное tagged namespace и allocator materialization before each send; payout bounce recovery больше не путает caller IDs с ledger IDs; governance vote key использует полный uint64 proposal ID; первый mint и mint-доставки подчиняются лимитам; wallet не потребляет forward payload при проверке mint marker; farm accrual settle-ится перед переключением; неподдерживаемая wallet-code migration закрыта fail-closed.
  - dApp/minter: устранена гонка балансов при смене кошелька; TON Connect UI и `@ton/core` локально vendor/bundle; proxy явно маршрутизирует mainnet/testnet и v2/v3; `image_data` кодируется из base64 в on-chain binary snake form. UI подтверждает только `submitted`, не выдавая принятие wallet за on-chain success.
  - Automation: auto-merge проверяет список файлов PR на protected paths; keygen не печатает приватный материал; scout падает закрыто при ошибках API; оптимизаторы соблюдают заявленный budget.
  - Проверено: Tact compiler прямым запуском с увеличенным Node stack, 298 Node regression tests, 32 Python tests, `tsc --noEmit`, ABI verify, DApp ABI, deployment artifact check, pins check, hub audit и root `npm audit` (0 advisories). Minter install/build прошли, CI-mode test suite: 15 suites / 88 tests; dependency audit находит 57 advisories (7 moderate, 50 high), полный fix требует breaking upgrade и lockfile не менялся.
  - Остаются blockers к закрытию/PR: `npm run build` с обычным launcher падает из-за Tact compiler stack overflow; `security_check.ts` содержит устаревший invariant старого qid guard; build hashes требуют regeneration после contract changes. Эти три protected areas не менялись. Отдельные findings об event-driven/manual workflow dispatch, multi-file atomic sync, pending-state reconciliation minter, unbounded AI action history и semantics emergency pause/trading остаются открытыми либо требуют уточнения требований.
  - Изменения Tact меняют code hashes и адреса; никакого deployment, публикации адресов или on-chain действия не выполнялось.

## T-24 — Acton scripting и атомарная синхронизация, PR #280

Реализован отдельный pipeline `python3 scripts/sync_acton.py`: фиксированная версия Acton, свежий Tact baseline, сборка во временном проекте, сравнение message/getter ABI и wire-сериализации, генерация Tolk/TypeScript wrappers, Acton-тесты и локальные `main()`-сценарии. Полное поколение артефактов публикуется атомарно; offline `--check` обнаруживает изменения исходников и артефактов по SHA-256. Документация TON/Acton синхронизируется отдельно с manifest, блокировкой, retry и rollback. Избыточное расширение file permissions из CodeQL устранено.

Регрессии миграции охватывают storage cell overflow и основные локальные contract flows. Это tooling-инкремент, а не полная production-миграция. Корневые Tact-контракты и действующий dApp не переключены на новый bytecode; секреты, deployment и on-chain операции не использовались. Точные выполненные проверки и оставшиеся ограничения записываются в `docs/ACTON_SCRIPTING_2026-10-22.md`; независимый аудит и release gates остаются открытыми.

## T-26 — Acton automation contour

- [x] Pin Acton 1.2.1, validate the resolved project with `acton doctor`, and
  expose formatter, plain-output auto-fix, GitHub/SARIF diagnostics, wrapper
  generation, gas snapshot, coverage, and mutation commands.
- [x] Extend reusable CI with Acton doctor, GitHub annotations, SARIF artifact
  upload, and add scheduled/manual native quality reports for coverage, gas, and
  mutation sessions.
- [x] Add a manual-only auto-fix workflow that emits a patch artifact without
  write permissions, push, merge, deployment, or wallet access.
- [x] Add scheduled/manual unattended repair that can commit only an isolated
  `automation/acton-autofix` branch and open/update a PR; main, merge, wallet,
  deployment, and broadcast remain unavailable to the bot.
- [x] Document fuzzing, pinned-block forks, simulator/localnet/Studio, scripts,
  deployment, verification, and library operations with explicit manual-only
  boundaries in `docs/ACTON_AUTOMATION.md`.
- [ ] Add domain-specific scalar fuzz properties and commit a reviewed gas
  baseline after selecting deterministic tests; resolve the Acton 1.2.1
  mutation runner `Argument list too long (os error 7)` blocker before making
  mutation score a required gate.
