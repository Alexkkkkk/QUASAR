# QUASAR idle-pack v3 — агенты изучают репозиторий в простое

Состав:
  _idle-agent.yml        модуль: idle-gate -> explore -> fix -> draft PR
  idle_check.py          скрипт: простое ли репо + выбор модуля для изучения
  validate_findings.py   валидация findings по схеме (traversal/red-lines отказ)
  explore.schema.json    схема findings
  _scout.yml             модуль: мониторинг здоровья репо + поиск решений
  scout_scan.py          скрипт: детерминированный скан проблем (runs/issues/PR/TODO)
  scout_route.py         валидация решений + маршрутизация (ai-fix issue / коммент-план)
  scout.schema.json      схема решений
  router-idle.patch.md   как включить (триггеры + job'ы + ветки router)

Scout работает 2 раза в час (cron 12,42), не в простое а всегда:
сканирует упавшие прогоны, issues без меток, зависшие draft'ы, TODO-дебт ->
модель строит гипотезы причин и планы решений -> уверенные и автофиксибельные
(confidence >= 0.7) становятся issue с label ai-fix (дедуп по заголовку),
остальные — комментариями-планами в существующие issue. Scout код не правит.

Установка: файлы по README, правки в quasar.yml/router.mjs — по router-idle.patch.md
(класс workflows -> PR с ручным review, как обычно).

Логика простоя: никаких in-progress run'ов (кроме своего), никаких
человеческих PR, обновлённых <6ч. Не просто — 5 секунд и выход.
