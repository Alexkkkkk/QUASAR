# Changelog

## 2026-10-06 — audit: TON Connect manifest source link and guard coverage

- docs(ton): три отчёта (`AUDIT_2026-10-02`, `AUDIT_2026-10-06`,
  `CONFORMANCE_FIX_2026-09-28`) ссылались на руководство по манифесту TON Connect
  по пути `.../ton-connect/guidelines/creating-manifest`, который отдаёт HTTP 404;
  заменено на действующую страницу `applications/ton-connect/core-concepts`
  (таблица обязательных/опциональных полей манифеста и требования к хостингу) — F-45.
- test: `tests/ton_doc_links.test.ts` дополнен отозванным путём манифеста и
  положительной проверкой, что отчёты цитируют достижимую страницу.

## 2026-10-06 — audit: TON Docs link conformance and the missing oracle keygen command

- docs(ton): три цитируемые ссылки на TON Docs отдавали HTTP 404
  (`.../jettons/get-jetton-wallet`, `.../blockchain-basics/languages/tact`,
  `.../contracts-specs/jetton-standard`); заменены на достижимые первоисточники
  (`.../jettons/find`, `/tolk/overview`, `.../jettons/overview`) — F-39, F-40, F-41.
- fix(scripts): документация и `.env.example` требовали `npm run oracle:keygen`,
  но скрипт не был определён в `package.json`; добавлен
  `"oracle:keygen": "tsx scripts/ai_oracle.ts keygen"` — F-42.
- test: добавлены `tests/docs_command_conformance.test.ts` (каждая команда из
  документации существует) и `tests/ton_doc_links.test.ts` (отозванные пути
  TON Docs не возвращаются) — F-43, F-44.
- docs: отчёт `docs/AUDIT_2026-10-06.md` с полным списком проверок и открытых пунктов.

## 2026-10-03 — синхронизация гейтов ИИ-агента с CI (PR #103)

- Job проверки ИИ-агента запускает тот же набор гейтов, что и QUASAR CI: добавлен `npm run deployment:check`.
- Версия Node в job-е проверки читается из `.nvmrc` (единый источник истины тулчейна) вместо жёстко заданной `24`.
- Регрессионный тест `tests/audit_2026_10_02.test.ts` проверяет синхронность гейтов и версии Node между `ci.yml` и `ai-fix-agent.yml`.
- Уточнён guard «workflow не должен деплоить»: отрицательный lookahead не даёт ему ложно срабатывать на read-only гейт `npm run deployment:check`.

## 2026-10-03 — ci: изолированный ИИ-агент для issue (#103)

- ci: удалён устаревший shell-capable `.github/workflows/ai-fix.yml`;
  единственный агент по метке `ai-fix` — изолированный
  `.github/workflows/ai-fix-agent.yml` (read-only генерация,
  отдельная валидация на чистом checkout, draft PR без write-доступа).
- ci: `docs/ai/AI_ISSUE_AGENT.md` добавлен в protected-path pattern,
  чтобы сгенерированный патч не мог изменить инструкцию агента.
## 2026-10-02 — audit: off-chain hosting, toolchain, AI agent, multisig runbook

- fix(tep64): host off-chain jetton metadata on a JSON-capable origin
  (`website/metadata.json` -> GitHub Pages `application/json`; image ->
  `image/png`) and make the deploy preflight reject a non-JSON metadata
  content type (#77).
- ci: read the Node version from `.nvmrc` via `node-version-file` so CI and
  local runs share one toolchain, and add the `deployment:check` gate.
- ci: remove `.github/workflows/autopilot-automerge.yml`, which enabled
  auto-merge for every pull request without human review (#94).
- feat(ci): add `.github/workflows/ai-fix.yml` — a manual-`ai-fix`-label
  Grok CLI agent that works in an `ai/<issue>-*` branch and opens a draft PR
  only after `lint`, `security:check`, `test` and `tsc` pass; no merge, no
  deploy, no deploy secrets. Add `GROK.md` rules and
  `docs/ai/AI_ISSUE_AGENT.md` (#94).
- docs: add `docs/MULTISIG_HANDOFF_RUNBOOK.md` for wiring external 2-of-N
  multisig ownership through the existing timelocked two-step (#86).
- docs: add `docs/AUDIT_2026-10-02.md` and close T-09 in `docs/TASKS.md`.
- test: add `tests/audit_2026_10_02.test.ts` regression guards.


All notable changes to this repository are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
`MAJOR.MINOR.PATCH` versions from `package.json`.

Nothing in this file is a claim of audit, yield or production safety. See
`docs/SECURITY_AUDIT.md` and `docs/AUDIT_2026-09-29.md` for the current
verification status.

## [Unreleased]

### Added

- `tests/ton_doc_conformance_fix_2026_09_30.test.ts`: regression coverage for the 2026-09-30 documentation pass — TEP-64 off-chain content without a URI is rejected on-chain, TEP-89 answers `addr_none` for an unaddressable owner, and no zero-value send relies on base mode 0.

### Fixed

- `contracts/quasar.tact`: `ProposeContent` accepted a TEP-64 `0x01` content cell with no URI and now rejects a cell without a prefix byte as well ([TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)).
- `contracts/quasar.tact`: `_workchainOf` mis-decoded every address that is not `addr_std$10`, so a `provide_wallet_address` query about an unaddressable owner returned a derived wallet address instead of `addr_none` ([TEP-89](https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md)).
- `contracts/quasar.tact`: the `BurnConfirmed` leg used a zero value with base mode 0, which fails with exit code 37 and was swallowed by `SendIgnoreErrors`; it now pays its forward fee separately ([message modes](https://docs.ton.org/v3/documentation/smart-contracts/message-management/message-modes-cookbook)).

- `tests/property_invariants.test.ts`: deterministic invariant coverage for issue #63 (CPMM `k` monotonicity across a seeded swap path, LP quote/burn quote round-trips, and staking-accounting conservation).
- `scripts/build_hashes.ts`, `docs/build-hashes.json`, and the `hashes:build` script: reproducible SHA-256 publication for compiled `.code.boc` and `.abi` artifacts. CI now uploads the hash manifest as an artifact for issue #62.
- `docs/AUDIT_STATUS.md`: single-table status board for the still-open findings and their repository issue links (issue #66).

### Changed

- `README.md` and `WHITEPAPER.md` now point readers to the repository issue tracker and mark the legacy veto fields as inactive compatibility state, not an active governance feature.

### Added

- TEP-64 managed jetton metadata (issue #58): `ProposeContent`,
  `"Cancel Content"` and `"Apply Content"` receivers plus `get_pending_content`
  and `get_content_at` getters. A metadata change is two-step and only applies
  after `ownerTransferDelay` (48h), mirroring the wallet-code migration, so a
  mistake in the metadata URI is no longer permanent.
- `scripts/lib/tep64.ts`: builds and preflights TEP-64 content cells
  (`0x01 ++ uri` off-chain and `0x00 ++ dictionary` on-chain layouts) before a
  proposal is broadcast, and decodes them for review.
- `tests/tep64_content.test.ts`: on-chain round trip, timelock, owner-only and
  prefix-validation coverage.
- `docs/AUDIT_2026-09-29.md`: consolidated audit report for the #57 scope.
- `scripts/check_dapp_abi.ts` and the `abi:dapp` npm script: the dApp opcode map
  in `website/tonconnect.js` is now verified against the compiled ABI in CI
  (issue #61).

### Fixed

- TEP-89 (issue #60): the master now answers `provide_wallet_address` with
  `wallet_address = addr_none` when it cannot derive a wallet address for the
  requested owner (workchain mismatch), as the standard requires, instead of
  returning a computed address that belongs to another workchain.
- TEP-64 (issue #58): a staged content cell whose first byte is neither `0x00`
  nor `0x01` is rejected before it reaches the pending slot.
- TEP-89 (issue #60): `wallet-discovery` is accepted as a decodable TEP-64
  attribute in the off-chain helper.

### Changed

- `scripts/deploy_all.ts` builds the pool metadata cell through
  `scripts/lib/tep64.ts` instead of inline cell construction.
- `scripts/security_check.ts` asserts the metadata proposal path, the TEP-89
  workchain branch and the wallet-side discovery handler.
- `docs/abi/*.json` regenerated for the new message and getters.

### Security

- No secret, wallet material or deployment state is committed. The dApp reads
  addresses from `website/config.js`, which ships empty.

