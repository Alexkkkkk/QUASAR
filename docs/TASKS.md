> Исторические разделы P1 и далее сохраняют журнал прежних работ: Tact-пути и команды в них не являются текущими инструкциями. Актуальные контракты: `tolk/contracts/` + Acton.

# QUASAR — задание (открытые findings и работы)

Источник истины по незакрытым пунктам аудита и запланированному функционалу.
Формат: `[ ]` — открыто, `[x]` — сделано и подтверждено сборкой/тестами.
Каждый пункт содержит `file:line`, проблему и план исправления.

База: `main`. Проверка каждого пункта — только через `npm run build`,
`npx tsc --noEmit`, `npm run security:check`, `node --import tsx --test tests/*.test.ts`.

---

## Активные P0/P1 задачи — TON / полный Acton coverage, issue #300

Ниже — findings, подтверждённые шестью независимыми проверками активных Tolk
контрактов 2026-10-23. Ни один пункт не считается закрытым до исправления,
регрессионного теста, полного CI и обновления ABI/build hash. Отдельный внешний
аудит безопасности по-прежнему обязателен.

- [~] **DOC-01 Полный разбор Acton documentation.** Официальный sitemap содержит
  180 уникальных Acton-страниц; URL-инвентарь собран, но все 180 строк всё ещё
  `Review pending`; файл —
  [`docs/ACTON_DOCS_COVERAGE_2026-10-23.md`](ACTON_DOCS_COVERAGE_2026-10-23.md).
  Требуется сопоставить каждую страницу с QUASAR, закреплённым Acton 1.2.1,
  tests и security policy; все реальные пропуски превратить в task ниже/отдельный
  task с официальным URL и критериями приёмки, а каждую функцию обозначить как
  implemented, task, version-gated или аргументированно not applicable. Не
  исполнять real-wallet, key, broadcast, deploy, verifier-payment, publication,
  validator и remote-network действия из примеров документации. Источник:
  [официальный sitemap Acton](https://ton-blockchain.github.io/acton/sitemap.xml).

- [~] **DOC-02 Полный разбор всего docs.ton.org.** Официальный sitemap содержит
  453 уникальных URL; инвентарь собран, но все 453 строки всё ещё `Review pending`;
  сгруппированный по разделам список —
  [`docs/TON_DOCS_COVERAGE_2026-10-23.md`](TON_DOCS_COVERAGE_2026-10-23.md).
  Для **каждой** строки требуется зафиксировать repo/test evidence, отдельный
  task ID, version gate либо обоснованное not-applicable/deferred. Разделы TON
  включают APIs, applications, contracts, foundations, languages, nodes, Tolk,
  TVM, onboarding и contribution; coverage не означает механический перенос в
  on-chain Jetton/DeFi код. Не выполнять live wallet/key, payment, broadcast,
  deployment, validator, node, mainnet/testnet mutation и publication actions.
  Источники: [официальный sitemap TON Docs](https://docs.ton.org/sitemap.xml),
  [Start here](https://docs.ton.org/start-here) и
  [полный llms index](https://docs.ton.org/llms.txt).

- [ ] **T-23 `ToggleMinting` / `AiToggleMinting` меняют tradingEnabled вместо mintable.**
  - Файлы: `tolk/contracts/QuasarMaster.tolk:2540-2550,2769-2791`;
    `tolk/tests/quasar-master.test.tolk`.
  - Проблема: `Mint` гейтит `core.mintable`, а getter `get_jetton_data` сообщает
    `mintable`; два toggle-handler изменяют только независимый trading flag.
    Значение getter не отражает заявленное действие; AI audit лог тоже снимал
    прежнее значение не того поля.
  - Исправление/приёмка: менять и логировать именно `mintable`; проверить owner
    off/on, неизменность trading state, mint refusal/success и AI branch при
    включённом signed-authority пути. Источники:
    [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md),
    [TON Jetton API](https://docs.ton.org/contracts/standard/tokens/jettons/api).

- [x] **T-24 `InternalTransfer` bounce может повторно зачислить уже принятую fee.**
  - Файл: `tolk/contracts/QuasarWallet.tolk:75-151`; tests:
    `tolk/tests/wallet-jetton.test.tolk`.
  - Проблема: master `FeeTransfer` и recipient `InternalTransfer` независимы.
    Когда fee принят master, а recipient leg затем bounced до `TransferConfirmed`,
    sender wallet возвращает principal **и fee**, хотя fee остаётся учтена master;
    баланс wallet liabilities становится зависимым от порядка сообщений.
  - Исправлено/проверено: bounce восстанавливает только principal; добавлены
    Acton regressions для обоих порядков `FeeTransfer` / recipient bounce /
    `TransferConfirmed`, с assertion sender balance и Master reserve до/после
    принятия fee и confirmation. Bounce отправляется от адреса derived recipient
    wallet. Источники:
    [TON internal messages](https://docs.ton.org/foundations/messages/internal),
    [Acton/Tolk test runner](https://ton-blockchain.github.io/acton/docs/testing/overview).

- [~] **T-25 TEP-74 transfer принимает 70–90 mTON и удерживает refundable residual.**
  - Файл: `tolk/contracts/QuasarWallet.tolk:296-368`; tests:
    `tolk/tests/wallet-jetton.test.tolk`.
  - Проблема: accepted-value floor — 70,000,000 nanotons, но ответ `excesses`
    появляется только для `in.valueCoins - 90,000,000 > 0`; указанный диапазон
    может приниматься без полного возврата остатка при non-null response destination.
  - Исправлено: кошелёк возвращает весь положительный residual после обязательных
    70 mTON outgoing budgets; добавлен integration regression и проверен bounce
    principal-only accounting. Остаётся точная boundary-матрица 70, 80, 90 mTON
    и верхняя граница с `TokenExcesses`. Источник:
    [TEP-74 transfers](https://docs.ton.org/contracts/standard/tokens/jettons/transfer).

- [~] **T-26 Wallet TEP-89 отвечает своим адресом, а не derivation для запроса.**
  - Файл: `tolk/contracts/QuasarWallet.tolk:429-445`;
    `tolk/tests/wallet-regression.test.tolk:103-148`.
  - Исправлено: для внутреннего owner выводится wallet того же master/code;
    unsupported workchain возвращает `addr_none`, optional owner echo проверяется
    по точной сериализации `TakeWalletAddress`. Остаются отдельные external-address
    и полный workchain boundary наборы.
    Источники: [TEP-89](https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md),
    [TON API](https://docs.ton.org/contracts/standard/tokens/jettons/api).

- [x] **T-27 Wallet pool-payout marker пересекает произвольный TEP-74 `uint64 query_id`.**
  - Файлы: `tolk/contracts/QuasarCommon.tolk:14-17`,
    `tolk/contracts/QuasarWallet.tolk:82-138,296-380` и DeFi payout routing.
  - Исправлено: marker namespace проверяется до lookup user ledger; одинаковый
    high-bit query ID обрабатывается в обоих порядках in-flight операций, а bounce
    восстанавливает только pool ledger. Сохранён 64-bit TEP-74 wire ABI; проверено
    в `tolk/tests/wallet-regression.test.tolk`.
  - Источники:
    [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md),
    [Tolk jetton payload](https://docs.ton.org/tolk/features/jetton-payload).

- [~] **T-28 `SwapToQsr` не возвращает TON, если QSR payout bounced.**
  - Файл: `tolk/contracts/QuasarDeFi.tolk:984-1077,1245-1284`;
    tests: `tolk/tests/quasar-defi.test.tolk`.
  - Исправлено: QSR swap имеет single pending state; reserve-mutating swaps
    блокируются до settlement; authenticated failure возвращает QSR и fee,
    swapper выбирает exact-output retry или TON refund; bounced refund становится
    claimable liability, защищённой от `SweepTon`. Bounce исходного `PoolPayout`
    до wallet transfer также обрабатывается общим rollback helper и покрыт Acton
    regression. Остаются repeated-bounce/legacy-callback свойства.
  - Исправление/приёмка: хранить single pending-swap state (original trader,
    `tonIn`, `qsrOut`, точную fee, текущий payout ID/destination/status); до
    settlement блокировать reserve-mutating операции. `PayoutFailed` ровно один
    раз возвращает QSR+fee и открывает выбор: retry прежнего QSR output на новый
    destination либо TON-refund claim — не пересчитывать обмен и не выплачивать
    обе стороны. `ClaimSwapTonRefund` атомарно выводит TON из reserve в отдельный
    liability, а bounce переводит именно фактически возвращённое `in.valueCoins`
    (за вычетом network fees) в retryable claim; `SweepTon` защищает все
    physically-held claims и storage reserve. Успех закрывает lock без повтора;
    retries используют свежие IDs, а stale/mismatched callbacks не меняют state.
    Сохранить storage decoder старого формата и все ABI/hash/artifact parity gates.
    Тестировать обе ветви выбора, repeated QSR/TON bounce, успешный retry,
    unauthorized/replayed callbacks, balance/reserve/fee invariants и sweep.
    Источники: [TON internal messages](https://docs.ton.org/foundations/messages/internal),
    [bounce handling](https://docs.ton.org/tolk/features/message-handling),
    [message modes and fees](https://docs.ton.org/v3/documentation/smart-contracts/message-management/message-modes-cookbook),
    [reserve action](https://docs.ton.org/foundations/actions/reserve).

- [~] **T-29 Liquidity removal теряет LP entitlement при bounce TON leg после QSR успеха.**
  - Файл: `tolk/contracts/QuasarDeFi.tolk:984-1023,1496-1537`;
    tests: `tolk/tests/quasar-defi.test.tolk`.
  - Исправлено: bounced TON leg сохраняется как retryable claim с held-balance
    accounting; QSR-leg failure восстанавливает LP balance/supply и исходный farm
    stake. Один bounced TON payout → claim → новый destination проверен в Acton.
    Остаются repeated-bounce/replay, storage-upgrade и parallel-payout свойства.
  - Исправление/приёмка: после QSR settlement сохранять неизменный `claimId`,
    beneficiary и один TON entitlement; его bounced TON становится retryable
    claim на новый internal destination без повторной QSR выплаты и без возврата
    уже сожжённых LP. Каждый retry имеет свежий attempt ID; duplicate/stale/wrong
    amount/sender/destination bounce не создаёт second claim. Не считать bounce
    успешным delivery callback: tombstone нельзя закрывать по таймауту. Раздельно
    учитывать фактически held bounced TON и защищать его `tonReserve`/`SweepTon`
    от расходов; повторная попытка может вернуть меньше из-за TON bounce/network
    fees, это должно быть явно видно в claim amount, а не маскироваться под full
    payout. При QSR failure ровно один раз восстановить LP balance, LP supply,
    reserves **и прежнюю staked долю** (`farmTotalStaked`/user farm state), не
    выдавая farm rewards за период, когда LP были unstaked. Тесты: QSR success →
    TON bounce → claimable → retry/new destination → success/second bounce/replay;
    параллельный liquidity deposit; sweep/storage floor; QSR-failure rollback;
    zero-QSR removal и swap-to-TON bounce regressions; старый/new storage decode.
    Источники: [TON internal messages](https://docs.ton.org/foundations/messages/internal),
    [transaction phases](https://docs.ton.org/foundations/phases),
    [reserve action](https://docs.ton.org/foundations/actions/reserve),
    [Tolk message sending](https://docs.ton.org/tolk/features/message-sending),
    [bounce handling](https://docs.ton.org/tolk/features/message-handling).

- [x] **T-30 Закрыть post-bounce test coverage gaps по Master, DeFi и timelock.**
  - Master: реальные mint→burn/supply update, spoofed/invalid `BurnNotification`,
    точная граница `maxSupply`, все поля `get_jetton_data`, delayed/cancelled/
    unauthorized owner transfer; suites в `tolk/tests/quasar-master.test.tolk` и
    `tolk/tests/master-mint-bounce.test.tolk`.
  - DeFi: обычные swap в обе стороны, proportional liquidity add/remove и лимиты;
    bounce/replay/retry покрытия для QSR payout, TON refund и removal payout,
    pending-QSR refund, farm reward и BuybackTon; farm config/accrual/stake/claim/
    emergency сценарии в `tolk/tests/quasar-defi.test.tolk`.
  - Farm reward bounce accounting: при восстановлении user pending сумма больше
    не зачисляется повторно в `farmRewardReserve`, уже уменьшенный при accrual;
    regression покрывает повторный failure, retry, полученную сумму и неизменность
    reserve. `QuasarDeFi` bytecode hash/address изменились; ABI и storage layout нет.
  - Master bounce tests сверяют pending ID, amount и derived sender wallet и
    подтверждают exactly-once restoration. AdminTimelock trace подтверждает
    target/body/value и bounce на uninitialized managed target; вызов one-shot и
    удаляется до отправки. Recovery требует новой записи с монотонно возрастающим
    ID и повторного delay; новую запись можно отменить. Same-ID auto-retry не
    реализован без generic success/bounce correlation для произвольного body.
  - Проверка на Acton 1.2.1: `acton fmt --check` и полный `acton test` — 93/93
    теста в 8 файлах. Эмуляторные bounce traces не подтверждают live-network
    поведение и не заменяют независимый аудит или adversarial deployed testing.
    Источники: [Acton testing](https://ton-blockchain.github.io/acton/docs/testing/overview),
    [trace reading](https://ton-blockchain.github.io/acton/docs/testing/reading-transaction-chains).

- [x] **T-31 TEP-74/Tolk serialization boundary tests.**
  - Файлы: `tolk/contracts/QuasarCommon.tolk`,
    `tolk/contracts/QuasarMasterRecords.tolk`,
    `tolk/tests/common-wire.test.tolk`, `tolk/tests/master-records.test.tolk`.
  - Уже проверены `Either` selector + inline/ref forms `forwardPayload`, maximum
    `uint64` high-bit `query_id`, четыре payload refs, а также `EventFeeDistributed`
    wire-layout round-trip. `AiActionLog.actionType` и `reason` теперь проверены
    как 128-byte snake strings через nested refs; malformed `EventFeeDistributed`
    tail matrix проверяет отсутствующий root ref, короткий fee tail, пустой defi
    tail и trailing bits в обоих nested tails. Существующий round-trip проверяет
    каждое из семи полей `EventFeeDistributed`; существующие truncated nested-ref
    и trailing-root cases сохранены. Targeted Acton suite: 12/12.
    Источники: [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md),
    [TON cells](https://docs.ton.org/foundations/serialization/cells),
    [Tolk serialization](https://docs.ton.org/tolk/types/overall-serialization).

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

- [x] **T-15 Tact → Tolk migration/cutover decision.**
  - Файл: `docs/TOLK_MIGRATION_DECISION.md`.
  - Tolk/Acton является единственным активным compiler/source path; исторические
    Tact sources сохраняются только как read-only parity baseline. Storage,
    StateInit, code hash и адреса нового поколения не считаются in-place
    совместимыми со старым deployment.
- [x] **T-15a Acton toolchain для Tolk cutover.**
  - Файл: `tolk/README.md`, `tolk/Acton.toml`.
  - Установка для разработчика выполняется официальным инсталлятором:
    `curl -LsSf https://github.com/ton-blockchain/acton/releases/latest/download/acton-installer.sh | sh`.
    Проект дополнительно фиксирует Acton `1.2.1` для воспроизводимой проверки.
  - Acton используется для build/test/ABI/wrapper; deployment и on-chain
    операции в рамках этой миграции запрещены. Полный pinned build/check/test
    pipeline входит в обязательные CI gates.
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
    как задано паком аудита (`legacy Tact artifactsaudit-pack-v2/contracts/quasar_master_fixes.tact.txt`).
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

- [~] **T-32 Автономная адаптация и синхронизация репозитория без ручного запуска.**
  - Расширить repo-native GitHub Actions: по расписанию и поддерживаемым upstream/CI/security событиям обнаруживать drift в TON/Acton docs, dependency pins и генераторах; запускать только allowlisted deterministic synchronizers; обновлять manifest/checksums, coverage tasks, ABI/wrappers/build artifacts как одну идемпотентную generation; при любом частичном сбое выполнять rollback и не публиковать неполное поколение.
  - Автоматике разрешены только заранее утверждённые пути и reproducible преобразования. Она deduplicates/out-of-order events, serializes конкурентные запуски, повторяет только transient ошибки с лимитом, проверяет current base/head, сохраняет provenance, создаёт draft PR без действий владельца и автоматически сливает лишь после всех обязательных проверок на неизменённом head SHA. Никакой записи прямо в `main`, использования issue/Markdown как инструкций, токенов deploy/on-chain, mainnet-операций или автоизменения contract business logic без отдельного release policy.
  - Приёмка: dry-run не пишет; repeated webhook/schedule события дают тот же результат; tests покрывают upstream timeout/429, corrupt/stale manifest, частичную генерацию, duplicate event, concurrency, untrusted payload, protected-file drift, unavailable fix и stale PR head. Неизвестные изменения fail closed: создаётся issue/task с доказательствами вместо speculative code patch.
  - Использовать существующие `scripts/sync_acton.py`, `scripts/sync_ton_docs.py`, `hub:audit` и fenced auto-merge; не дублировать отдельного LLM-поллера или unmanaged background service. Источники: [GitHub Actions workflow triggers](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows), [Acton](https://ton-blockchain.github.io/acton/), [TON Docs](https://docs.ton.org/).
  - Реализовано 2026-10-23: `.github/workflows/ton-docs-sync.yml` ежедневно валидирует deterministic allowlist, запускает snapshot tests и official source-check, сериализует запуски и создаёт draft PR только с `docs/ton/**`; redirect-follow запрещён. PR использует repository-scoped GitHub App token либо PAT, иначе fail-closed без `GITHUB_TOKEN` fallback; workflow включён в `hub:audit` и `tests/automation_hub.test.ts`.
  - Осталось: управляемая синхронизация Acton wrappers/build artifacts и sitemap-derived coverage, межфайловая generation/rollback, проверка дубликатов/stale PR и их acceptance tests. Автоматическое изменение контрактного поведения не реализуется этой задачей без отдельной release policy.

- [ ] **T-33 Trustless adaptive controls и автоматическая синхронизация DeFi параметров.**
  - Спроектировать bounded on-chain fee/slippage/farm controls на данных пула: TWAP/наблюдения цены, глубина резервов, timestamp и лимиты изменения; автоматические шаги должны быть permissionless/keeperless, воспроизводимыми, gas-bounded, replay-safe и не зависеть от внешнего AI, приватного ключа или доверенного cron.
  - До реализации зафиксировать экономические пределы владельца: min/max fee, cooldown, maximum parameter delta, observation window, manipulation cost и режим emergency pause; синхронизировать параметры Master/DeFi только атомарно либо через versioned pending state/timelock, отклоняя устаревшие версии. Нельзя менять параметры или выводить средства через «адаптацию» в обход владельца/паузы.
  - Приёмка: adversarial TWAP/flash manipulation и timestamp/replay/property tests, invariants для solvency, reserves, mint limits и pause, differential Acton/native tests, ABI/storage compatibility plan, новый security review и полный CI. Автоматически сгенерированные значения не считаются одобрением экономических параметров; до согласования лимитов эта задача остаётся design-only.
  - Источники: [TON message handling](https://docs.ton.org/tolk/features/message-handling), [TON security techniques](https://docs.ton.org/contracts/techniques/security), [TON internal messages](https://docs.ton.org/foundations/messages/internal).

- [ ] **T-34 Закрыть cross-protocol buyback race и legacy pending-payout cutover.**
  - Независимый Acton review 2026-10-23 обнаружил, что Master может прислать
    buyback `TokenNotification` во время `pendingQsrSwap`; DeFi сейчас отклоняет
    notification после зачисления Jetton в pool wallet, оставляя QSR вне учёта.
    Нужны replay-safe очередь/отложенная обработка и согласованная отмена timeout
    между Master и DeFi; нельзя размораживать резервы или терять callback.
  - Старый `PendingTonPayout` decoder заполняет добавленные `activeAttemptId` и
    `claimId` нулями, а новые callback checks требуют совпадающего attempt ID.
    Либо нормализовать legacy in-flight записи с тестами старого cell layout, либо
    зафиксировать отдельный fresh-StateInit cutover и доказать, что upgrade поверх
    live адреса запрещён.
  - Приёмка: Acton traces для buyback при status 1/2, timeout/cancel, повторов и
    QSR/TON bounce; legacy cell fixtures и old callback cases; reserve, token
    wallet balance, Master accounting и replay invariants; независимый security
    review и все release gates. До закрытия deployment/cutover запрещён.
  - Источники: [TON internal messages](https://docs.ton.org/foundations/messages/internal),
    [Tolk bounce handling](https://docs.ton.org/tolk/features/message-handling),
    [Acton testing](https://ton-blockchain.github.io/acton/docs/testing/overview).

- [ ] **T-35 Acton generation/scripting integrity regressions.**
  - В `tests/test_sync_acton.py` проверить, что изменение `tolk/Acton.toml`
    обнаруживается `sync.check()` без запуска tools/публикации артефактов; также
    закрепить broadcast guard обоих local scripts и отсутствие `--net`,
    `--fork-net`, `--tonconnect` в автоматическом pipeline.
  - Исправить onboarding contradiction: `npm run acton:init` — stdlib-only,
    pin остаётся `acton up 1.2.1`; проверить документацию тестом. Проверить ссылки
    на scripting report и явно различать emulator tests от live-network actions.
  - Приёмка: offline regressions проходят на pinned Acton 1.2.1 и падают при
    повреждении manifest/guard; wallet, endpoint, broadcast и deploy не используются.
    Источники: [Acton.toml](https://ton-blockchain.github.io/acton/docs/acton-toml),
    [build reference](https://ton-blockchain.github.io/acton/docs/building/reference),
    [scripting](https://ton-blockchain.github.io/acton/docs/scripting/blockchain-interaction).

- [~] **T-40 Свести ветки и release-gates в единый Tolk task map.**
  - `ai/300-acton-ton-completion` содержит contract/security/docs работу,
    которая уже представлена в `main` через merged PR #309 и последующие Tolk
    cutover PR #318/#319/#322; повторно вливать эту stale-ветку нельзя.
  - `ai/swarm-sync` и draft PR #321 содержат старый набор тех же изменений и
    конфликтуют с актуальным `main`; их уникальные темы сведены сюда в T-32,
    T-35 и T-36, а не копируются вторым merge.
  - `ai/deployment-preflight` и PR #323 — единственная актуальная отдельная
    ветка: reproducible Tolk/Acton build, ABI/BOC hash gate, security/dApp
    checks, AdminTimelock mutation regressions и testnet release checklist.
  - `ai/300-tep74-forward-ton-funding` не имеет открытого PR; его TEP-74
    funding/forward-payload work должен проходить через T-31/T-37 и не считается
    частью deployment, пока ABI и offline traces не подтверждены.
  - Приёмка консолидации: каждое изменение либо присутствует в `main`, либо
    имеет ровно один source branch/PR; stale branches не вливаются повторно;
    остаток записан в T-30/T-31/T-35/T-36 и проверяется pinned Acton 1.2.1.

- [ ] **T-36 Углубить локальные Acton contract tests и зафиксировать quality baselines.**
  - Дополнить T-30/T-31: bounded fixed-seed fuzz/property tests для master
    maxSupply и DeFi `estimateLpOut` с явными boundary cases; persistent typed-map
    storage round-trip (empty/multi-entry, address/int257 keys); timelock trace
    target/body/value assertions. На pinned CLI исследовать targeted mutation,
    LCOV и gas snapshot без глобального порога; Test UI recipe/named trace — только
    после проверки поддержки 1.2.1.
  - Приёмка: все новые сценарии deterministic, bounded и offline; seed, CLI,
    результаты и survivors записаны; mutation демонстрирует killed regression;
    coverage используется для приоритизации, не как proof безопасности. Источники:
    [fuzz](https://ton-blockchain.github.io/acton/docs/testing/fuzz-testing),
    [coverage](https://ton-blockchain.github.io/acton/docs/testing/code-coverage),
    [mutation](https://ton-blockchain.github.io/acton/docs/testing/mutation-testing/overview),
    [gas](https://ton-blockchain.github.io/acton/docs/testing/gas-profiling-with-snapshots),
    [Test UI](https://ton-blockchain.github.io/acton/docs/testing/test-ui/overview),
    [transaction traces](https://ton-blockchain.github.io/acton/docs/testing/reading-transaction-chains).
  - Реализовано 2026-10-24 в PR #323: pinned fuzz defaults и DeFi
    `estimateLpOut` property test (64 runs, seed `20261024`), LCOV coverage,
    gas snapshot/baseline commands, saved trace command и generated TypeScript
    wrapper gate. Остались fork-state rehearsal, broader contract properties и
    mutation triage; они требуют отдельного operator-approved baseline.

- [ ] **T-37 DApp использует compiler-generated typed QUASAR wrappers.**
  - Заменить вручную поддерживаемые QUASAR opcode/BOC construction и raw getter
    parsing в `website/tonconnect.js` проверенными generated serializers/typed
    getters из Acton sync; стандартный TEP-74 transfer оставить явным. Проверять
    payload fields и decode через offline ABI parity tests.
  - Приёмка: ABI drift ломает gate, сериализация совпадает с compiler fixtures,
    testnet/address/send safety сохраняются; live wallet/network send не применяется.
    Источники: [dApps](https://ton-blockchain.github.io/acton/docs/dapps),
    [frontend](https://ton-blockchain.github.io/acton/docs/tutorial/frontend).

- [ ] **T-38 Безопасная developer onboarding, editor и workspace state.**
  - Добавить pinned Acton IDE/LSP guide и project-scoped agent-skill policy;
    исправить `acton:init` документацию; игнорировать `tolk/wallets.toml`,
    `tolk/global.wallets.toml`, `.studio/`, `tolk/.acton-localnet/` с tests;
    уточнить legacy-only env variables в `.env.example`. `acton doctor` описывать
    только как opt-in remote probe с редактированием отчёта; paid source verification
    — только отдельный approved release gate.
  - Приёмка: guidance соответствует pinned 1.2.1; state игнорируется, source
    остаётся trackable; никакие credentials, mnemonics или remote commands не
    читаются/исполняются. Источники:
    [IDE](https://ton-blockchain.github.io/acton/docs/ide-support/vscode),
    [skills](https://ton-blockchain.github.io/acton/docs/agent-skills/overview),
    [wallets](https://ton-blockchain.github.io/acton/docs/wallets),
    [Studio](https://ton-blockchain.github.io/acton/docs/studio),
    [verification](https://ton-blockchain.github.io/acton/docs/verify).

- [ ] **T-39 Опциональная local environment smoke и CI observability.**
  - После pinned-CLI feature check подготовить отдельно opt-in, loopback-only
    simulator API tests и localnet lifecycle runbook/smoke; default CI остаётся
    offline и без persistent containers/validator participation. Оценить LCOV
    artifact upload и opt-in pre-push hook; `.github/workflows/**` менять только
    в отдельно разрешённом owner-scoped change.
  - Приёмка: cleanup гарантирован success/failure; нет public network/fork/wallet;
    unsupported 1.2.1 flags fail closed; required checks/secrets не меняются.
    Источники: [simulator](https://ton-blockchain.github.io/acton/docs/environments/simulator/overview),
    [localnet](https://ton-blockchain.github.io/acton/docs/environments/localnet/overview),
    [CI](https://ton-blockchain.github.io/acton/docs/ci-setup),
    [hooks](https://ton-blockchain.github.io/acton/docs/commands/hooks).

- [ ] **T-40 Закрыть page-by-page evidence classification Acton inventory.**
  - 18-area review завершён; `docs/ACTON_DOCS_COVERAGE_2026-10-23.md` содержит
    180 routes — все пока `Review pending`. Для каждого URL указать
    implemented/evidence, linked task, version-gated, external/unsafe gate либо
    аргументированное not-applicable. Не внедрять механически on-chain libraries
    или precompiled BoC там, где нет QUASAR use case; не менять Acton pin и не
    выполнять wallet/network/deploy/validator examples.
  - Приёмка: ни одна строка не остаётся pending; каждое решение ссылается на
    source/test/path и точный URL; actionable gaps связаны с T-30—T-39 или отдельным
    scoped issue; DOC-01 отражает evidence, а не число просмотренных страниц.
    Источники: [Acton llms index](https://ton-blockchain.github.io/acton/llms.txt),
    [official sitemap](https://ton-blockchain.github.io/acton/sitemap.xml).

## T-24 — Acton scripting и атомарная синхронизация, PR #280

Реализован отдельный pipeline `python3 scripts/sync_acton.py`: фиксированная версия Acton, сборка Tolk-проекта во временном каталоге, сравнение message/getter ABI с архивным baseline и wire-сериализации, генерация Tolk/TypeScript wrappers, Acton-тесты и локальные `main()`-сценарии. Полное поколение артефактов публикуется атомарно; offline `--check` обнаруживает изменения исходников и артефактов по SHA-256. Документация TON/Acton синхронизируется отдельно с manifest, блокировкой, retry и rollback. Избыточное расширение file permissions из CodeQL устранено.

Регрессии миграции охватывают storage cell overflow и основные локальные contract flows. Compiler/source cutover завершён: активные контракты и dApp ABI используют Tolk-generated artifacts; исторические Tact sources не входят в build или release artifacts. Секреты, deployment и on-chain операции не использовались. Точные выполненные проверки и оставшиеся release ограничения записываются в `docs/TOLK_ADAPTATION_2026-10-23.md`; независимый аудит и deployment gates остаются отдельными.
