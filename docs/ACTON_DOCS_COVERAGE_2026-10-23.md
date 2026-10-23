# QUASAR — полный каталог покрытия официальной документации Acton

> Рабочий документ issue #300. Инвентарь сверён с официальным Acton sitemap на 2026-10-23. Ссылка в каждой строке ведёт к исходной официальной странице. Указание страницы **не** означает, что всякая описанная операция применима к QUASAR или безопасна для исполнения.

## Статус и правила классификации

- В инвентаре **180 из 180 уникальных страниц** sitemap Acton; группы: Core guides: 16, agent-skills: 2, building: 4, commands: 28, environments: 19, ide-support: 3, rules: 41, scripting: 3, standard_library: 25, testing: 20, tolk_standard_library: 9, tutorial: 10.
- До пофайлового сопоставления с исходниками статус: **review pending**. После проверки каждая страница будет отнесена к одному из исходов: `implemented` с repo/test evidence; `task: ID`; `version-gated` относительно закреплённого Acton 1.2.1; `not applicable/deferred` с обоснованием.
- Полный feature inventory не означает механическое включение каждого CLI/tool feature в контракты. Нельзя выполнять real-wallet/key, broadcast, deploy, verification/payment, publishing, validator/network operations. Такие функции анализируются как gated/non-applicable, а не запускаются.
- TON standards coverage дополнительно ведётся в [`TON_CONFORMANCE_MATRIX.md`](TON_CONFORMANCE_MATRIX.md); этот документ охватывает именно домен `ton-blockchain.github.io/acton`.
- Tracking issue/задачи: [`TASKS.md`](TASKS.md). Независимый аудит остаётся отдельным release gate.

## Полный постраничный инвентарь

### Core guides (16)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-001 | [acton toml](https://ton-blockchain.github.io/acton/docs/acton-toml) (`/docs/acton-toml`) | 2026-09-30T17:04:20.000Z | Review pending |
| ACTON-002 | [ci setup](https://ton-blockchain.github.io/acton/docs/ci-setup) (`/docs/ci-setup`) | 2026-09-23T23:24:10.000Z | Review pending |
| ACTON-003 | [dapps](https://ton-blockchain.github.io/acton/docs/dapps) (`/docs/dapps`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-004 | [debug](https://ton-blockchain.github.io/acton/docs/debug) (`/docs/debug`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-005 | [deploy](https://ton-blockchain.github.io/acton/docs/deploy) (`/docs/deploy`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-006 | [format](https://ton-blockchain.github.io/acton/docs/format) (`/docs/format`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-007 | [installation](https://ton-blockchain.github.io/acton/docs/installation) (`/docs/installation`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-008 | [libraries](https://ton-blockchain.github.io/acton/docs/libraries) (`/docs/libraries`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-009 | [lint](https://ton-blockchain.github.io/acton/docs/lint) (`/docs/lint`) | 2026-05-12T23:27:01.000Z | Review pending |
| ACTON-010 | [projects](https://ton-blockchain.github.io/acton/docs/projects) (`/docs/projects`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-011 | [quickstart](https://ton-blockchain.github.io/acton/docs/quickstart) (`/docs/quickstart`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-012 | [studio](https://ton-blockchain.github.io/acton/docs/studio) (`/docs/studio`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-013 | [verify](https://ton-blockchain.github.io/acton/docs/verify) (`/docs/verify`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-014 | [walkthrough](https://ton-blockchain.github.io/acton/docs/walkthrough) (`/docs/walkthrough`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-015 | [wallets](https://ton-blockchain.github.io/acton/docs/wallets) (`/docs/wallets`) | 2026-09-30T17:36:27.000Z | Review pending |
| ACTON-016 | [welcome](https://ton-blockchain.github.io/acton/docs/welcome) (`/docs/welcome`) | 2026-09-16T10:35:45.000Z | Review pending |

### agent-skills (2)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-017 | [func2tolk](https://ton-blockchain.github.io/acton/docs/agent-skills/func2tolk) (`/docs/agent-skills/func2tolk`) | 2026-05-12T23:27:01.000Z | Review pending |
| ACTON-018 | [overview](https://ton-blockchain.github.io/acton/docs/agent-skills/overview) (`/docs/agent-skills/overview`) | 2026-05-25T21:54:51.000Z | Review pending |

### building (4)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-019 | [overview](https://ton-blockchain.github.io/acton/docs/building/overview) (`/docs/building/overview`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-020 | [precompiled boc](https://ton-blockchain.github.io/acton/docs/building/precompiled-boc) (`/docs/building/precompiled-boc`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-021 | [reference](https://ton-blockchain.github.io/acton/docs/building/reference) (`/docs/building/reference`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-022 | [wrappers](https://ton-blockchain.github.io/acton/docs/building/wrappers) (`/docs/building/wrappers`) | 2026-09-18T15:13:21.000Z | Review pending |

### commands (28)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-023 | [build](https://ton-blockchain.github.io/acton/docs/commands/build) (`/docs/commands/build`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-024 | [check](https://ton-blockchain.github.io/acton/docs/commands/check) (`/docs/commands/check`) | 2026-05-18T22:55:56.000Z | Review pending |
| ACTON-025 | [compile](https://ton-blockchain.github.io/acton/docs/commands/compile) (`/docs/commands/compile`) | 2026-09-30T11:43:02.000Z | Review pending |
| ACTON-026 | [disasm](https://ton-blockchain.github.io/acton/docs/commands/disasm) (`/docs/commands/disasm`) | 2026-09-08T03:22:43.000Z | Review pending |
| ACTON-027 | [doc](https://ton-blockchain.github.io/acton/docs/commands/doc) (`/docs/commands/doc`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-028 | [doctor](https://ton-blockchain.github.io/acton/docs/commands/doctor) (`/docs/commands/doctor`) | 2026-09-08T03:22:43.000Z | Review pending |
| ACTON-029 | [fmt](https://ton-blockchain.github.io/acton/docs/commands/fmt) (`/docs/commands/fmt`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-030 | [func2tolk](https://ton-blockchain.github.io/acton/docs/commands/func2tolk) (`/docs/commands/func2tolk`) | 2026-05-18T22:55:56.000Z | Review pending |
| ACTON-031 | [help](https://ton-blockchain.github.io/acton/docs/commands/help) (`/docs/commands/help`) | 2026-05-18T22:55:56.000Z | Review pending |
| ACTON-032 | [hooks](https://ton-blockchain.github.io/acton/docs/commands/hooks) (`/docs/commands/hooks`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-033 | [init](https://ton-blockchain.github.io/acton/docs/commands/init) (`/docs/commands/init`) | 2026-10-02T15:41:35.000Z | Review pending |
| ACTON-034 | [library](https://ton-blockchain.github.io/acton/docs/commands/library) (`/docs/commands/library`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-035 | [localnet](https://ton-blockchain.github.io/acton/docs/commands/localnet) (`/docs/commands/localnet`) | 2026-10-13T19:13:01.000Z | Review pending |
| ACTON-036 | [ls](https://ton-blockchain.github.io/acton/docs/commands/ls) (`/docs/commands/ls`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-037 | [new](https://ton-blockchain.github.io/acton/docs/commands/new) (`/docs/commands/new`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-038 | [overview](https://ton-blockchain.github.io/acton/docs/commands/overview) (`/docs/commands/overview`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-039 | [retrace](https://ton-blockchain.github.io/acton/docs/commands/retrace) (`/docs/commands/retrace`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-040 | [rpc](https://ton-blockchain.github.io/acton/docs/commands/rpc) (`/docs/commands/rpc`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-041 | [run](https://ton-blockchain.github.io/acton/docs/commands/run) (`/docs/commands/run`) | 2026-05-18T22:55:56.000Z | Review pending |
| ACTON-042 | [script](https://ton-blockchain.github.io/acton/docs/commands/script) (`/docs/commands/script`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-043 | [shell completions](https://ton-blockchain.github.io/acton/docs/commands/shell-completions) (`/docs/commands/shell-completions`) | 2026-05-18T22:55:56.000Z | Review pending |
| ACTON-044 | [simulator](https://ton-blockchain.github.io/acton/docs/commands/simulator) (`/docs/commands/simulator`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-045 | [studio](https://ton-blockchain.github.io/acton/docs/commands/studio) (`/docs/commands/studio`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-046 | [test](https://ton-blockchain.github.io/acton/docs/commands/test) (`/docs/commands/test`) | 2026-09-19T06:53:01.000Z | Review pending |
| ACTON-047 | [up](https://ton-blockchain.github.io/acton/docs/commands/up) (`/docs/commands/up`) | 2026-10-10T22:16:50.000Z | Review pending |
| ACTON-048 | [verify](https://ton-blockchain.github.io/acton/docs/commands/verify) (`/docs/commands/verify`) | 2026-09-30T11:43:02.000Z | Review pending |
| ACTON-049 | [wallet](https://ton-blockchain.github.io/acton/docs/commands/wallet) (`/docs/commands/wallet`) | 2026-09-30T17:36:27.000Z | Review pending |
| ACTON-050 | [wrapper](https://ton-blockchain.github.io/acton/docs/commands/wrapper) (`/docs/commands/wrapper`) | 2026-09-16T09:51:45.000Z | Review pending |

### environments (19)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-051 | [overview](https://ton-blockchain.github.io/acton/docs/environments/overview) (`/docs/environments/overview`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-052 | [api compatibility](https://ton-blockchain.github.io/acton/docs/environments/simulator/api-compatibility) (`/docs/environments/simulator/api-compatibility`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-053 | [control api](https://ton-blockchain.github.io/acton/docs/environments/simulator/control-api) (`/docs/environments/simulator/control-api`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-054 | [liteapi](https://ton-blockchain.github.io/acton/docs/environments/simulator/liteapi) (`/docs/environments/simulator/liteapi`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-055 | [network conditions](https://ton-blockchain.github.io/acton/docs/environments/simulator/network-conditions) (`/docs/environments/simulator/network-conditions`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-056 | [overview](https://ton-blockchain.github.io/acton/docs/environments/simulator/overview) (`/docs/environments/simulator/overview`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-057 | [time](https://ton-blockchain.github.io/acton/docs/environments/simulator/time) (`/docs/environments/simulator/time`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-058 | [activity](https://ton-blockchain.github.io/acton/docs/environments/localnet/activity) (`/docs/environments/localnet/activity`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-059 | [admin actions](https://ton-blockchain.github.io/acton/docs/environments/localnet/admin-actions) (`/docs/environments/localnet/admin-actions`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-060 | [nodes](https://ton-blockchain.github.io/acton/docs/environments/localnet/nodes) (`/docs/environments/localnet/nodes`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-061 | [overview](https://ton-blockchain.github.io/acton/docs/environments/localnet/overview) (`/docs/environments/localnet/overview`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-062 | [change config](https://ton-blockchain.github.io/acton/docs/environments/how-to/change-config) (`/docs/environments/how-to/change-config`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-063 | [connect](https://ton-blockchain.github.io/acton/docs/environments/how-to/connect) (`/docs/environments/how-to/connect`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-064 | [create network](https://ton-blockchain.github.io/acton/docs/environments/how-to/create-network) (`/docs/environments/how-to/create-network`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-065 | [fork and import](https://ton-blockchain.github.io/acton/docs/environments/how-to/fork-and-import) (`/docs/environments/how-to/fork-and-import`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-066 | [fund accounts](https://ton-blockchain.github.io/acton/docs/environments/how-to/fund-accounts) (`/docs/environments/how-to/fund-accounts`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-067 | [inspect network](https://ton-blockchain.github.io/acton/docs/environments/how-to/inspect-network) (`/docs/environments/how-to/inspect-network`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-068 | [manage lifecycle](https://ton-blockchain.github.io/acton/docs/environments/how-to/manage-lifecycle) (`/docs/environments/how-to/manage-lifecycle`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-069 | [snapshots](https://ton-blockchain.github.io/acton/docs/environments/how-to/snapshots) (`/docs/environments/how-to/snapshots`) | 2026-09-16T10:35:45.000Z | Review pending |

### ide-support (3)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-070 | [jetbrains](https://ton-blockchain.github.io/acton/docs/ide-support/jetbrains) (`/docs/ide-support/jetbrains`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-071 | [language server protocol](https://ton-blockchain.github.io/acton/docs/ide-support/language-server-protocol) (`/docs/ide-support/language-server-protocol`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-072 | [vscode](https://ton-blockchain.github.io/acton/docs/ide-support/vscode) (`/docs/ide-support/vscode`) | 2026-09-18T15:13:21.000Z | Review pending |

### rules (41)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-073 | [c001 compiler error](https://ton-blockchain.github.io/acton/docs/rules/c001-compiler-error) (`/docs/rules/c001-compiler-error`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-074 | [e001 unused variable](https://ton-blockchain.github.io/acton/docs/rules/e001-unused-variable) (`/docs/rules/e001-unused-variable`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-075 | [e002 mutable variable can be immutable](https://ton-blockchain.github.io/acton/docs/rules/e002-mutable-variable-can-be-immutable) (`/docs/rules/e002-mutable-variable-can-be-immutable`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-076 | [e003 deprecated symbol use](https://ton-blockchain.github.io/acton/docs/rules/e003-deprecated-symbol-use) (`/docs/rules/e003-deprecated-symbol-use`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-077 | [e004 write only variable](https://ton-blockchain.github.io/acton/docs/rules/e004-write-only-variable) (`/docs/rules/e004-write-only-variable`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-078 | [e005 unused import](https://ton-blockchain.github.io/acton/docs/rules/e005-unused-import) (`/docs/rules/e005-unused-import`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-079 | [e006 pure function call unused](https://ton-blockchain.github.io/acton/docs/rules/e006-pure-function-call-unused) (`/docs/rules/e006-pure-function-call-unused`) | 2026-09-30T17:02:45.000Z | Review pending |
| ACTON-080 | [e007 no bounce handler](https://ton-blockchain.github.io/acton/docs/rules/e007-no-bounce-handler) (`/docs/rules/e007-no-bounce-handler`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-081 | [e008 used ignored identifier](https://ton-blockchain.github.io/acton/docs/rules/e008-used-ignored-identifier) (`/docs/rules/e008-used-ignored-identifier`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-082 | [e009 mutable parameter can be immutable](https://ton-blockchain.github.io/acton/docs/rules/e009-mutable-parameter-can-be-immutable) (`/docs/rules/e009-mutable-parameter-can-be-immutable`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-083 | [e010 acton import in contract](https://ton-blockchain.github.io/acton/docs/rules/e010-acton-import-in-contract) (`/docs/rules/e010-acton-import-in-contract`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-084 | [e011 asm function missing safety comment](https://ton-blockchain.github.io/acton/docs/rules/e011-asm-function-missing-safety-comment) (`/docs/rules/e011-asm-function-missing-safety-comment`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-085 | [e012 send mode literal](https://ton-blockchain.github.io/acton/docs/rules/e012-send-mode-literal) (`/docs/rules/e012-send-mode-literal`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-086 | [e013 unauthorized access](https://ton-blockchain.github.io/acton/docs/rules/e013-unauthorized-access) (`/docs/rules/e013-unauthorized-access`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-087 | [e014 several not null assertions](https://ton-blockchain.github.io/acton/docs/rules/e014-several-not-null-assertions) (`/docs/rules/e014-several-not-null-assertions`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-088 | [e015 reserve mode literal](https://ton-blockchain.github.io/acton/docs/rules/e015-reserve-mode-literal) (`/docs/rules/e015-reserve-mode-literal`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-089 | [e016 dangerous send mode missing safety comment](https://ton-blockchain.github.io/acton/docs/rules/e016-dangerous-send-mode-missing-safety-comment) (`/docs/rules/e016-dangerous-send-mode-missing-safety-comment`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-090 | [e017 bless call missing safety comment](https://ton-blockchain.github.io/acton/docs/rules/e017-bless-call-missing-safety-comment) (`/docs/rules/e017-bless-call-missing-safety-comment`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-091 | [e018 random requires initialization](https://ton-blockchain.github.io/acton/docs/rules/e018-random-requires-initialization) (`/docs/rules/e018-random-requires-initialization`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-092 | [e019 divide before multiply](https://ton-blockchain.github.io/acton/docs/rules/e019-divide-before-multiply) (`/docs/rules/e019-divide-before-multiply`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-093 | [e020 duplicated condition](https://ton-blockchain.github.io/acton/docs/rules/e020-duplicated-condition) (`/docs/rules/e020-duplicated-condition`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-094 | [e021 identical conditional branches](https://ton-blockchain.github.io/acton/docs/rules/e021-identical-conditional-branches) (`/docs/rules/e021-identical-conditional-branches`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-095 | [e022 no global variables](https://ton-blockchain.github.io/acton/docs/rules/e022-no-global-variables) (`/docs/rules/e022-no-global-variables`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-096 | [e024 enum cast missing safety comment](https://ton-blockchain.github.io/acton/docs/rules/e024-enum-cast-missing-safety-comment) (`/docs/rules/e024-enum-cast-missing-safety-comment`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-097 | [e025 missing contract header](https://ton-blockchain.github.io/acton/docs/rules/e025-missing-contract-header) (`/docs/rules/e025-missing-contract-header`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-098 | [e026 unused expression](https://ton-blockchain.github.io/acton/docs/rules/e026-unused-expression) (`/docs/rules/e026-unused-expression`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-099 | [e027 dict type use](https://ton-blockchain.github.io/acton/docs/rules/e027-dict-type-use) (`/docs/rules/e027-dict-type-use`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-100 | [e028 throw requires errors enum](https://ton-blockchain.github.io/acton/docs/rules/e028-throw-requires-errors-enum) (`/docs/rules/e028-throw-requires-errors-enum`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-101 | [e029 create message body to cell](https://ton-blockchain.github.io/acton/docs/rules/e029-create-message-body-to-cell) (`/docs/rules/e029-create-message-body-to-cell`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-102 | [e030 throw requires documented error value](https://ton-blockchain.github.io/acton/docs/rules/e030-throw-requires-documented-error-value) (`/docs/rules/e030-throw-requires-documented-error-value`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-103 | [e031 unnecessary not null assertion](https://ton-blockchain.github.io/acton/docs/rules/e031-unnecessary-not-null-assertion) (`/docs/rules/e031-unnecessary-not-null-assertion`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-104 | [overview](https://ton-blockchain.github.io/acton/docs/rules/overview) (`/docs/rules/overview`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-105 | [s001 name case checker](https://ton-blockchain.github.io/acton/docs/rules/s001-name-case-checker) (`/docs/rules/s001-name-case-checker`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-106 | [s002 explicit return type](https://ton-blockchain.github.io/acton/docs/rules/s002-explicit-return-type) (`/docs/rules/s002-explicit-return-type`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-107 | [s003 field init can be folded](https://ton-blockchain.github.io/acton/docs/rules/s003-field-init-can-be-folded) (`/docs/rules/s003-field-init-can-be-folded`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-108 | [s004 method can be static](https://ton-blockchain.github.io/acton/docs/rules/s004-method-can-be-static) (`/docs/rules/s004-method-can-be-static`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-109 | [s005 message should be named](https://ton-blockchain.github.io/acton/docs/rules/s005-message-should-be-named) (`/docs/rules/s005-message-should-be-named`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-110 | [s006 create message inline send](https://ton-blockchain.github.io/acton/docs/rules/s006-create-message-inline-send) (`/docs/rules/s006-create-message-inline-send`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-111 | [s007 import path can use mappings](https://ton-blockchain.github.io/acton/docs/rules/s007-import-path-can-use-mappings) (`/docs/rules/s007-import-path-can-use-mappings`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-112 | [s008 negated is type can use not is](https://ton-blockchain.github.io/acton/docs/rules/s008-negated-is-type-can-use-not-is) (`/docs/rules/s008-negated-is-type-can-use-not-is`) | 2026-09-16T09:01:43.000Z | Review pending |
| ACTON-113 | [s009 prefer grams](https://ton-blockchain.github.io/acton/docs/rules/s009-prefer-grams) (`/docs/rules/s009-prefer-grams`) | 2026-09-16T08:48:39.000Z | Review pending |

### scripting (3)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-114 | [blockchain interaction](https://ton-blockchain.github.io/acton/docs/scripting/blockchain-interaction) (`/docs/scripting/blockchain-interaction`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-115 | [overview](https://ton-blockchain.github.io/acton/docs/scripting/overview) (`/docs/scripting/overview`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-116 | [passing arguments](https://ton-blockchain.github.io/acton/docs/scripting/passing-arguments) (`/docs/scripting/passing-arguments`) | 2026-09-16T09:51:45.000Z | Review pending |

### standard_library (25)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-117 | [boc](https://ton-blockchain.github.io/acton/docs/standard_library/boc) (`/docs/standard_library/boc`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-118 | [build](https://ton-blockchain.github.io/acton/docs/standard_library/build) (`/docs/standard_library/build`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-119 | [crypto](https://ton-blockchain.github.io/acton/docs/standard_library/crypto) (`/docs/standard_library/crypto`) | 2026-09-30T16:44:00.000Z | Review pending |
| ACTON-120 | [env](https://ton-blockchain.github.io/acton/docs/standard_library/env) (`/docs/standard_library/env`) | 2026-06-19T18:05:02.000Z | Review pending |
| ACTON-121 | [ffi](https://ton-blockchain.github.io/acton/docs/standard_library/ffi) (`/docs/standard_library/ffi`) | 2026-04-29T16:07:01.000Z | Review pending |
| ACTON-122 | [fmt](https://ton-blockchain.github.io/acton/docs/standard_library/fmt) (`/docs/standard_library/fmt`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-123 | [fs](https://ton-blockchain.github.io/acton/docs/standard_library/fs) (`/docs/standard_library/fs`) | 2026-04-29T16:07:01.000Z | Review pending |
| ACTON-124 | [io](https://ton-blockchain.github.io/acton/docs/standard_library/io) (`/docs/standard_library/io`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-125 | [overview](https://ton-blockchain.github.io/acton/docs/standard_library/overview) (`/docs/standard_library/overview`) | 2026-07-20T20:37:20.000Z | Review pending |
| ACTON-126 | [prompts](https://ton-blockchain.github.io/acton/docs/standard_library/prompts) (`/docs/standard_library/prompts`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-127 | [config](https://ton-blockchain.github.io/acton/docs/standard_library/emulation/config) (`/docs/standard_library/emulation/config`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-128 | [network](https://ton-blockchain.github.io/acton/docs/standard_library/emulation/network) (`/docs/standard_library/emulation/network`) | 2026-09-30T16:29:32.000Z | Review pending |
| ACTON-129 | [scripts](https://ton-blockchain.github.io/acton/docs/standard_library/emulation/scripts) (`/docs/standard_library/emulation/scripts`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-130 | [testing](https://ton-blockchain.github.io/acton/docs/standard_library/emulation/testing) (`/docs/standard_library/emulation/testing`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-131 | [either](https://ton-blockchain.github.io/acton/docs/standard_library/tlb/either) (`/docs/standard_library/tlb/either`) | 2026-04-29T16:07:01.000Z | Review pending |
| ACTON-132 | [maybe](https://ton-blockchain.github.io/acton/docs/standard_library/tlb/maybe) (`/docs/standard_library/tlb/maybe`) | 2026-04-29T16:07:01.000Z | Review pending |
| ACTON-133 | [array](https://ton-blockchain.github.io/acton/docs/standard_library/types/array) (`/docs/standard_library/types/array`) | 2026-04-29T16:07:01.000Z | Review pending |
| ACTON-134 | [big array](https://ton-blockchain.github.io/acton/docs/standard_library/types/big_array) (`/docs/standard_library/types/big_array`) | 2026-04-29T16:07:01.000Z | Review pending |
| ACTON-135 | [message](https://ton-blockchain.github.io/acton/docs/standard_library/types/message) (`/docs/standard_library/types/message`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-136 | [out actions](https://ton-blockchain.github.io/acton/docs/standard_library/types/out_actions) (`/docs/standard_library/types/out_actions`) | 2026-06-10T22:00:01.000Z | Review pending |
| ACTON-137 | [transaction](https://ton-blockchain.github.io/acton/docs/standard_library/types/transaction) (`/docs/standard_library/types/transaction`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-138 | [assert](https://ton-blockchain.github.io/acton/docs/standard_library/testing/assert) (`/docs/standard_library/testing/assert`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-139 | [bench](https://ton-blockchain.github.io/acton/docs/standard_library/testing/bench) (`/docs/standard_library/testing/bench`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-140 | [expect](https://ton-blockchain.github.io/acton/docs/standard_library/testing/expect) (`/docs/standard_library/testing/expect`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-141 | [fuzz](https://ton-blockchain.github.io/acton/docs/standard_library/testing/fuzz) (`/docs/standard_library/testing/fuzz`) | 2026-04-29T16:07:01.000Z | Review pending |

### testing (20)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-142 | [built in matchers and helpers](https://ton-blockchain.github.io/acton/docs/testing/built-in-matchers-and-helpers) (`/docs/testing/built-in-matchers-and-helpers`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-143 | [code coverage](https://ton-blockchain.github.io/acton/docs/testing/code-coverage) (`/docs/testing/code-coverage`) | 2026-05-31T19:53:38.000Z | Review pending |
| ACTON-144 | [cookbook](https://ton-blockchain.github.io/acton/docs/testing/cookbook) (`/docs/testing/cookbook`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-145 | [fork testing](https://ton-blockchain.github.io/acton/docs/testing/fork-testing) (`/docs/testing/fork-testing`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-146 | [fuzz testing](https://ton-blockchain.github.io/acton/docs/testing/fuzz-testing) (`/docs/testing/fuzz-testing`) | 2026-05-12T23:27:01.000Z | Review pending |
| ACTON-147 | [gas profiling with snapshots](https://ton-blockchain.github.io/acton/docs/testing/gas-profiling-with-snapshots) (`/docs/testing/gas-profiling-with-snapshots`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-148 | [generating wrappers](https://ton-blockchain.github.io/acton/docs/testing/generating-wrappers) (`/docs/testing/generating-wrappers`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-149 | [overview](https://ton-blockchain.github.io/acton/docs/testing/overview) (`/docs/testing/overview`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-150 | [reading transaction chains](https://ton-blockchain.github.io/acton/docs/testing/reading-transaction-chains) (`/docs/testing/reading-transaction-chains`) | 2026-06-10T22:00:01.000Z | Review pending |
| ACTON-151 | [saved trace bundles](https://ton-blockchain.github.io/acton/docs/testing/saved-trace-bundles) (`/docs/testing/saved-trace-bundles`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-152 | [step by step execution](https://ton-blockchain.github.io/acton/docs/testing/step-by-step-execution) (`/docs/testing/step-by-step-execution`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-153 | [test attributes](https://ton-blockchain.github.io/acton/docs/testing/test-attributes) (`/docs/testing/test-attributes`) | 2026-05-14T13:05:57.000Z | Review pending |
| ACTON-154 | [test configuration](https://ton-blockchain.github.io/acton/docs/testing/test-configuration) (`/docs/testing/test-configuration`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-155 | [world state snapshots](https://ton-blockchain.github.io/acton/docs/testing/world-state-snapshots) (`/docs/testing/world-state-snapshots`) | 2026-09-18T15:13:21.000Z | Review pending |
| ACTON-156 | [writing your own matchers](https://ton-blockchain.github.io/acton/docs/testing/writing-your-own-matchers) (`/docs/testing/writing-your-own-matchers`) | 2026-05-12T23:13:44.000Z | Review pending |
| ACTON-157 | [overview](https://ton-blockchain.github.io/acton/docs/testing/mutation-testing/overview) (`/docs/testing/mutation-testing/overview`) | 2026-05-20T14:58:15.000Z | Review pending |
| ACTON-158 | [rules](https://ton-blockchain.github.io/acton/docs/testing/mutation-testing/rules) (`/docs/testing/mutation-testing/rules`) | 2026-05-09T12:03:42.000Z | Review pending |
| ACTON-159 | [overview](https://ton-blockchain.github.io/acton/docs/testing/test-ui/overview) (`/docs/testing/test-ui/overview`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-160 | [quickstart](https://ton-blockchain.github.io/acton/docs/testing/test-ui/quickstart) (`/docs/testing/test-ui/quickstart`) | 2026-09-16T08:48:39.000Z | Review pending |
| ACTON-161 | [reference](https://ton-blockchain.github.io/acton/docs/testing/test-ui/reference) (`/docs/testing/test-ui/reference`) | 2026-09-16T08:48:39.000Z | Review pending |

### tolk_standard_library (9)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-162 | [common](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/common) (`/docs/tolk_standard_library/common`) | 2026-09-28T11:43:00.000Z | Review pending |
| ACTON-163 | [exotic cells](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/exotic-cells) (`/docs/tolk_standard_library/exotic-cells`) | 2026-09-28T11:43:00.000Z | Review pending |
| ACTON-164 | [gas payments](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/gas-payments) (`/docs/tolk_standard_library/gas-payments`) | 2026-06-19T18:05:02.000Z | Review pending |
| ACTON-165 | [lisp lists](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/lisp-lists) (`/docs/tolk_standard_library/lisp-lists`) | 2026-09-28T11:43:00.000Z | Review pending |
| ACTON-166 | [overview](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/overview) (`/docs/tolk_standard_library/overview`) | 2026-05-11T01:42:31.000Z | Review pending |
| ACTON-167 | [reflection](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/reflection) (`/docs/tolk_standard_library/reflection`) | 2026-05-03T22:19:34.000Z | Review pending |
| ACTON-168 | [strings](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/strings) (`/docs/tolk_standard_library/strings`) | 2026-09-28T11:43:00.000Z | Review pending |
| ACTON-169 | [tvm dicts](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/tvm-dicts) (`/docs/tolk_standard_library/tvm-dicts`) | 2026-04-29T16:07:01.000Z | Review pending |
| ACTON-170 | [tvm lowlevel](https://ton-blockchain.github.io/acton/docs/tolk_standard_library/tvm-lowlevel) (`/docs/tolk_standard_library/tvm-lowlevel`) | 2026-06-19T18:05:02.000Z | Review pending |

### tutorial (10)

| ID | Официальная страница | Last modified в sitemap | Статус |
|---|---|---|---|
| ACTON-171 | [bounces as feedback](https://ton-blockchain.github.io/acton/docs/tutorial/bounces-as-feedback) (`/docs/tutorial/bounces-as-feedback`) | 2026-06-19T18:05:02.000Z | Review pending |
| ACTON-172 | [close and owner](https://ton-blockchain.github.io/acton/docs/tutorial/close-and-owner) (`/docs/tutorial/close-and-owner`) | 2026-06-19T18:05:02.000Z | Review pending |
| ACTON-173 | [first tests](https://ton-blockchain.github.io/acton/docs/tutorial/first-tests) (`/docs/tutorial/first-tests`) | 2026-06-19T18:05:02.000Z | Review pending |
| ACTON-174 | [frontend](https://ton-blockchain.github.io/acton/docs/tutorial/frontend) (`/docs/tutorial/frontend`) | 2026-09-16T10:35:45.000Z | Review pending |
| ACTON-175 | [mutation and fuzz](https://ton-blockchain.github.io/acton/docs/tutorial/mutation-and-fuzz) (`/docs/tutorial/mutation-and-fuzz`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-176 | [naive centralized poll](https://ton-blockchain.github.io/acton/docs/tutorial/naive-centralized-poll) (`/docs/tutorial/naive-centralized-poll`) | 2026-06-30T11:06:25.000Z | Review pending |
| ACTON-177 | [overview](https://ton-blockchain.github.io/acton/docs/tutorial/overview) (`/docs/tutorial/overview`) | 2026-09-16T09:51:45.000Z | Review pending |
| ACTON-178 | [scaffolding](https://ton-blockchain.github.io/acton/docs/tutorial/scaffolding) (`/docs/tutorial/scaffolding`) | 2026-05-20T14:28:37.000Z | Review pending |
| ACTON-179 | [splitting contracts](https://ton-blockchain.github.io/acton/docs/tutorial/splitting-contracts) (`/docs/tutorial/splitting-contracts`) | 2026-06-19T18:05:02.000Z | Review pending |
| ACTON-180 | [testnet](https://ton-blockchain.github.io/acton/docs/tutorial/testnet) (`/docs/tutorial/testnet`) | 2026-09-16T10:35:45.000Z | Review pending |
