# Решение о миграции Tact → Tolk

Обновлено: 2026-10-23, issue #289. QUASAR переключён на Tolk/Acton как
единственный активный путь разработки контрактов. Канонические исходники,
тесты, ABI snapshots, wrappers, CI и build hashes находятся в `tolk/` и
строятся Acton `1.2.1`.

Предыдущие Tact-исходники, конфигурация, sandbox suites и deployment scripts
перенесены в `docs/historical/tact-reference/`. Это read-only evidence для
аудита миграции. Они не компилируются, не typecheck-ятся, не запускаются в CI и
не входят в release artifacts.

## Совместимость и release boundary

Публичный wire ABI Tolk фиксируется compiler-derived snapshots: typed messages,
explicit opcodes, field layouts, getters и method IDs. Это не доказывает
совместимость хранения или адресов. Tolk использует versioned storage, новый
code hash и новый StateInit; Tact Master, DeFi, Timelock и wallet storage нельзя
загрузить в Tolk bytecode и нельзя считать старые wallet addresses адресами
нового поколения.

Master и DeFi сохраняют rent reserve при `Deploy`; Timelock валидирует nonzero
admin/master и минимальную задержку независимо от того, каким первым сообщением
прикреплён StateInit. Эти проверки не заменяют полный behavioral audit.

Перед любым deployment всё ещё необходимы: differential traces success/reject/
bounce paths, проверка non-empty storage dictionaries и границ cell, отдельный
state-transition/claim plan, testnet rehearsal, reproducible code-hash review и
независимый security audit. Никакие секреты, реальные транзакции или адреса не
публикуются этим изменением.
