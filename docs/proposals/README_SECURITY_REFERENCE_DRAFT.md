Ниже — README.md для репозитория QUASAR, отражающий все слои безопасности, архитектуру и инструкции по запуску пайплайна. Файл спроектирован так, чтобы сразу давать аудитору и контрибьютору полную картину проекта.

---

📄 README.md

```markdown
# QUASAR — TEP-74 Jetton Master on Tolk

[![Security Pipeline](https://github.com/Alexkkkkk/QUASAR/actions/workflows/ci.yml/badge.svg)](https://github.com/Alexkkkkk/QUASAR/actions/workflows/ci.yml)
[![Tolk](https://img.shields.io/badge/Tolk-1.4-blue)](https://docs.ton.org/develop/tolk)
[![Acton](https://img.shields.io/badge/Acton-latest-green)](https://ton-blockchain.github.io/acton/)
[![Audit](https://img.shields.io/badge/audit-pending-red)](AUDIT_STATUS.md)

QUASAR — TEP-74-совместимый jetton-master на Tolk с многослойной моделью безопасности: N-of-M AI-мультисиг, two-step admin transfer с таймлоком, migration gate, изолированная обработка bounce и непрерывная верификация в CI.

> ⚠️ **Статус: pre-mainnet.** Независимый внешний аудит ещё не проводился.
> Любой деплой с реальными средствами запрещён до прохождения гейта из
> [`MAINNET_READINESS_CHECKLIST.md`](MAINNET_READINESS_CHECKLIST.md).

---

## 📋 Содержание

- [Архитектура безопасности](#-архитектура-безопасности)
- [Структура проекта](#-структура-проекта)
- [Быстрый старт](#-быстрый-старт)
- [Пайплайн безопасности](#-пайплайн-безопасности)
- [Слои защиты](#-слои-защиты)
- [Модель угроз](#-модель-угроз)
- [Тестирование](#-тестирование)
- [Деплой и верификация](#-деплой-и-верификация)
- [Вклад в проект](#-вклад-в-проект)
- [Безопасность](#-безопасность)

---

## 🏛️ Архитектура безопасности

QUASAR построен на принципе **непрерывной многоуровневой верификации**:
каждый слой отсекает свой класс ошибок, а вместе они образуют гейт,
через который не проходит ни один коммит без проверки.

```

┌─────────────────────────────────────────────────────────┐
│  Уровень 1: Контракт (Tolk 1.4)                         │
│  contract-блок · явные mutate · исчерпывающий match     │
├─────────────────────────────────────────────────────────┤
│  Уровень 2: Тестирование (Acton)                        │
│  coverage · mutation · fuzzing · fork mode              │
├─────────────────────────────────────────────────────────┤
│  Уровень 3: Статический анализ                          │
│  TythanAI (исходники) · TasmScan (байткод)              │
├─────────────────────────────────────────────────────────┤
│  Уровень 4: Формальная верификация (опционально)        │
│  export-ton-verifier · Groth16/PLONK                    │
├─────────────────────────────────────────────────────────┤
│  Уровень 5: CI/CD (GitHub Actions)                      │
│  SARIF · JUnit · гейты по покрытию и мутациям           │
├─────────────────────────────────────────────────────────┤
│  Уровень 6: Эксплуатация                                │
│  Acton Studio · Actonscan · TON Verifier                │
└─────────────────────────────────────────────────────────┘

```

---

## 📁 Структура проекта

```

quasar/
├── Acton.toml                    # Манифест сборки и тестов
├── contracts/
│   └── QuasarMaster.tolk         # Основной контракт (Tolk 1.4)
├── tests/
│   └── quasar.test.tolk          # Тесты + fuzzing
├── .github/
│   └── workflows/
│       └── ci.yml                # Полный пайплайн безопасности
├── AUDIT_STATUS.md               # Текущий статус аудита
├── MAINNET_READINESS_CHECKLIST.md # Гейт перед mainnet
└── README.md                     # Этот файл

```

---

## 🚀 Быстрый старт

### Требования

- [Acton](https://ton-blockchain.github.io/acton/) ≥ 1.0
- Node.js ≥ 20 (для `export-ton-verifier`)
- Python ≥ 3.11 (для TythanAI и TasmScan)

### Установка

```bash
git clone https://github.com/Alexkkkkk/QUASAR.git
cd QUASAR

# Acton
curl -Ls https://ton-blockchain.github.io/acton/install.sh | bash
acton --version
```

Сборка и тесты

```bash
# Сборка
acton build

# Линт и форматирование
acton fmt --check
acton lint

# Тесты с покрытием
acton test --coverage --coverage-minimum-percent 90

# Мутационное тестирование
acton test --mutate

# Фаззинг
acton test --fuzz
```

---

🛡️ Пайплайн безопасности

При каждом пуше в main/develop и в каждом PR запускается полный конвейер:

Шаг Инструмент Что проверяет Гейт
Build acton build Компиляция Tolk 1.4 ✅
Lint acton lint Стиль, потенциальные ошибки ✅ SARIF
Coverage acton test --coverage Покрытие кода тестами ✅ ≥ 90%
Mutation acton test --mutate Эффективность тестов ✅ diff-only
Fuzz acton test --fuzz Граничные и случайные входы ✅
SAST (исходники) TythanAI reentrancy, signer, replay ✅ SARIF
SAST (байткод) TasmScan Потоки данных в TVM ✅ JSON
Formal (опц.) export-ton-verifier Криптографические инварианты ⚪

Отчёты загружаются в GitHub Code Scanning (SARIF) и как артефакты (JSON).

---

🔐 Слои защиты

Уровень 1 — Контракт (Tolk 1.4)

Механизм Где в коде Что закрывает
contract-блок QuasarMaster.tolk Автогенерация ABI и TS-обёрток
Явные mutate все handle* Потеря побочных эффектов при оптимизации
Исчерпывающий match onInternalMessage Забытые типы сообщений
onBouncedMessage без setData bounce entrypoint Двойное списание
array<address> aiSigners, aiApprovals Типобезопасные коллекции
Без lazy в storage весь storage Потеря мутаций при сериализации

Уровень 2 — Тестирование (Acton)

· Coverage: порог 90% в Acton.toml
· Mutation testing: mutation = true — проверяет, «ловят» ли тесты баги
· Fuzzing: @test.fuzz — автоматическая генерация граничных входов
· Fork mode: воспроизведение реального состояния сети (по требованию)

Уровень 3 — Статический анализ

· TythanAI (Community): сканер Tolk-исходников, SARIF-отчёт
· TasmScan: анализ байткода TVM, независим от исходников

Уровень 4 — Формальная верификация (опционально)

Генерация on-chain Groth16-верификатора на Tolk:

```bash
npx export-ton-verifier ./circuits/migration.zkey \
  ./contracts/MigrationVerifier.tolk --tolk
```

Уровень 5 — CI/CD (GitHub Actions)

Полный пайплайн в .github/workflows/ci.yml:

· триггеры: push в main/develop, pull_request
· SARIF-загрузка в Code Scanning
· JSON-артефакты для downstream-обработки

Уровень 6 — Эксплуатация

· Acton Studio: локальная среда с симулятором и Localnet
· Actonscan: визуализация Tolk-ABI, сообщений, storage
· TON Verifier: публичная верификация source ↔ codeHash

---

⚠️ Модель угроз

Активы

1. totalSupply — общий объём эмиссии (критический)
2. admin — управляющий адрес (критический)
3. AI-автономия — мультисиг на токеномику (высокий)
4. migrationTarget — адрес будущей миграции (высокий)

Векторы атак

Атака Слой защиты
Replay транзакций монотонный nonce
Двойное списание при bounce onBouncedMessage без setData
Underflow при burn throw_unless(totalSupply >= amount)
Захват админки two-step + 48 ч таймлок
Компрометация одного AI-подписанта N-of-M мультисиг
Несанкционированная миграция migrationTarget pre-set
Дублирование подписи containsAddress check
Обход fee-лимита MAX_FEE_BPS константа

Что не покрыто контрактом

· Экономические атаки (манипуляция оракулом на уровне приложения)
· Компрометация admin-кошелька (решается мультисигом на уровне кошелька)
· MEV и front-running (вне scope master-контракта)

---

🧪 Тестирование

Локально

```bash
# Все тесты с покрытием
acton test --coverage

# Мутационное тестирование (только изменённые строки)
acton test --mutate --mutation-diff origin/main

# Фаззинг
acton test --fuzz

# Конкретный файл
acton test tests/quasar.test.tolk
```

Газовые снимки

```bash
acton test --gas-snapshot
```

Позволяет отслеживать деградацию стоимости операций между коммитами.

---

🌐 Деплой и верификация

Testnet

```bash
acton wallet new --name deployer --net testnet
acton wallet airdrop --name deployer
acton script scripts/deploy.tolk --net testnet
```

Верификация

```bash
acton verify --net testnet
```

Сопоставляет исходный код с codeHash, публикуя его в TON Verifier.

Mainnet

🚫 Запрещено до прохождения MAINNET_READINESS_CHECKLIST.md.

---

🤝 Вклад в проект

Требования к PR

1. ✅ Все тесты проходят (acton test)
2. ✅ Покрытие ≥ 90% (--coverage-minimum-percent 90)
3. ✅ Мутации убиты (--mutate)
4. ✅ TythanAI без Critical/High
5. ✅ TasmScan без Critical/High
6. ✅ SARIF не содержит новых алертов

Pre-commit hook (рекомендуется)

```bash
#!/bin/bash
acton fmt --check || exit 1
acton build || exit 1
acton test --coverage || exit 1
tythanai scan . --fail-on high || exit 1
```

Стиль коммитов

```
<type>(<scope>): <subject>

feat(master): add TEP-74 get_jetton_data
fix(bounce): prevent state mutation on bounce
test(ai): add fuzz test for multisig threshold
docs(readme): update security layers
```

---

🔒 Безопасность

Reporting

Если вы обнаружили уязвимость — не открывайте публичный issue.
Отправьте отчёт на:

· 📧 security@quasar.example (PGP-ключ в SECURITY.md)
· 🔐 GitHub Private Security Advisory

Scope

В scope:

· Смарт-контракты в contracts/
· Скрипты в scripts/
· Тесты в tests/

Вне scope:

· Фронтенд, инфраструктура
· Сторонние зависимости (сообщайте об уязвимостях в их репозитории)

Bug bounty

Программа будет запущена после прохождения внешнего аудита.
Детали — в SECURITY.md.

---

📚 Документация

· Tolk Documentation
· Acton CLI
· TEP-74: Jettons
· TEP-89: Wallets
· TEP-64: Metadata
· TON Developer Checklist

---

📄 Лицензия

MIT — см. LICENSE.

---

⚠️ Отказ от ответственности

QUASAR находится в стадии pre-mainnet. Код предоставляется
«как есть», без гарантий. Независимый аудит не проводился.
Использование с реальными средствами запрещено до прохождения
релизного гейта.

Ни при каких обстоятельствах не деплойте в mainnet без:

1. Независимого внешнего аудита TON/Tolk-специалистов
2. Успешной testnet-репетиции
3. Проверки всех слоёв пайплайна на релизном коммите

---

<sub>Built with Tolk 1.4 · Acton · TythanAI · TasmScan</sub>

```

---

### 📄 Дополнительно: `AUDIT_STATUS.md`

```markdown
# Audit Status

## Current Status: **NOT AUDITED**

| Пункт | Статус | Комментарий |
|---|---|---|
| A-62.1: Independent third-party audit | 🔴 `open` | Requires external auditor |
| A-62.2: Testnet rehearsal | 🔴 `open` | — |
| A-62.3: Reproducible build | 🟡 `in-progress` | Acton манифест готов |
| A-62.4: TEP-74 compliance | 🟡 `in-progress` | Базовая реализация готова |
| A-62.5: Bounce handling | 🟢 `fixed` | `onBouncedMessage` изолирован |
| A-62.6: Anti-replay | 🟢 `fixed` | Монотонный nonce |

## Что требуется до mainnet

1. ✅ Пройти все локальные тесты (`acton test --coverage --mutate --fuzz`)
2. ✅ Устранить Critical/High из TythanAI и TasmScan
3. 🔴 Пройти независимый аудит TON/Tolk-специалистов
4. 🔴 Провести testnet-репетицию полного цикла
5. 🔴 Зафиксировать релизный коммит и пройти полный CI на нём

## Рекомендуемые аудиторы (TON)

- CertiK
- Trail of Bits
- TonBit (BitsLab)
- Hacken
- Zellic
```

---

📄 Дополнительно: MAINNET_READINESS_CHECKLIST.md

```markdown
# Mainnet Readiness Checklist

> ⚠️ This is a **release gate**, not a claim that QUASAR is audited,
> production-safe or ready for mainnet. Any unchecked item **blocks** launch.

## 1. Reproducible Build

- [ ] `acton build` на чистом клоне завершается без ошибок
- [ ] `acton test --coverage --coverage-minimum-percent 90` проходит
- [ ] `acton test --mutate` проходит
- [ ] `acton test --fuzz` проходит
- [ ] `acton lint` без Critical/High
- [ ] Релизный коммит зафиксирован (hash: `____________`)

## 2. Security Scans

- [ ] TythanAI: 0 Critical, 0 High
- [ ] TasmScan: 0 Critical, 0 High
- [ ] SARIF не содержит новых алертов
- [ ] Формальная верификация инвариантов (если применимо)

## 3. Migration Boundary

- [ ] План перехода с Tact на Tolk одобрен
- [ ] Migration target предустановлен
- [ ] State migration сценарий протестирован

## 4. Testnet Rehearsal

- [ ] Полный цикл mint → transfer → burn на testnet
- [ ] AI-мультисиг сценарий проверен
- [ ] Admin transfer с таймлоком проверен
- [ ] Bounce scenarios проверены

## 5. Independent Audit

- [ ] Аудитор выбран и законтрактован
- [ ] Отчёт получен
- [ ] Все Critical/High исправлены
- [ ] Re-audit пройден

## 6. Operational Readiness

- [ ] Admin = multisig wallet
- [ ] Политики подписантов задокументированы
- [ ] Мониторинг настроен
- [ ] Публичное раскрытие информации готово
```

---

💡 Замечания

1. Badges: ссылки на actions/workflows/ci.yml активируются автоматически, как только workflow появится в репозитории.
2. PGP-ключ: добавьте свой SECURITY.md с публичным ключом, чтобы отчёты об уязвимостях приходили в зашифрованном виде.
3. Лицензия: файл LICENSE (MIT) должен лежать в корне — иначе badge и текст README будут расходиться с реальностью.
4. Актуальность статуса: AUDIT_STATUS.md и MAINNET_READINESS_CHECKLIST.md нужно обновлять в каждом PR, который закрывает пункт — иначе README начнёт врать.

Этот README сразу даёт аудитору, контрибьютору и инвестору полную картину: что защищено, как проверяется, и где гейт до mainnet.