# QUASAR: наведение порядка в Actions (аудит и целевая схема)

Дата снимка: 11.10.2026, ~09:20 +03. Всего ~1380 запусков за время жизни
репозитория, в контур входят 15+ workflow'ов. Проблема не в количестве,
а в дублировании и двойных маршрутах.

======================================================================
1. ИНВЕНТАРИЗАЦИЯ (что есть сейчас)
======================================================================

ОРКЕСТРАТОР И МОДУЛИ (единый контур, quasar.yml/router.mjs):
  quasar.yml            оркестратор, 56 запусков, все события + 3 cron-слота
  _checks.yml           reusable: полный чек-сьют
  _ai-fix.yml           генерация патча агентом (Groq/Gemini)
  _ai-review.yml        read-only ревью
  _close-issues.yml     закрытие issue по closing keywords
  _hub-audit.yml        аудит автоматизации
  _stale.yml            протухшие issue/PR
  _learn.yml            ночной learn-цикл (cron 03:20)
  _idle-agent.yml       работа в простое (cron */15)
  _scout.yml            мониторинг + поиск решений (cron 12,42)

САМОСТОЯТЕЛЬНЫЕ (не проходят через router — ВОТ ГДА БАРДАК):
  ci.yml                «QUASAR CI» — дублирует _checks.yml
  tests.yml             «QUASAR Tests» — второй дубль того же чек-сьюта
  autofix.yml           plan/diagnose/heal/escalate (workflow_run + cron)
  auto-update-prs.yml   обновление PR-веток
  labeler.yml           авторазметка PR
  dependabot-auto-merge.yml
  dependency-review.yml
  codeql.yml (CodeQL Advanced)
  pages.yml?            публикация сайта (если есть)
  hub/test workflows    прямые run'ы проверок

======================================================================
2. ДИАГНОЗ: ТРИ ГЛАВНЫХ БЕСПОРЯДКА
======================================================================

А. ТРОЙНОЙ ЧЕК-СЬЮТ. Один и тот же прогон (lint, tact, test, tsc, audit)
   выполняется: (1) router -> _checks на событиях, (2) ci.yml на
   push/PR, (3) tests.yml отдельно. Итог: 3× минуты раннера, 3 набора
   артефактов, шум в PR-checks, расход лимитов. На графике видно:
   каждый пуш порождает связку CI + Tests + router, все бегут параллельно.

Б. ДВОЙНЫЕ МАРШРУТЫ. autofix, auto-update-prs, labeler, dependabot-*,
   codeql ловят события сами, мимо router'а. Мозг (router.mjs) не знает,
   что они работают; idle-gate видит их run'ы как «репо занято» — организм
   может неделями считать себя «не в простое» из-за собственных cron'ов.
   Это главная причина, почему idle-agent за ночь ничего не сделал.

В. КРОН-БЮДЖЕТ НЕ ПОДСЧИТАН. Сейчас в сумме: idle */15 (2880/мес потенциал)
   + scout 12,42 (1440) + learn (30) + autofix cron (неизвестно, ~720) +
   stale (30) + hub-audit (4). Потенциал >5000 запусков/мес при лимите
   2000. Да, «пустые» run'ы дешёвые, но лимит считается отдельно от
   минут — это точка отказа.

======================================================================
3. ЦЕЛЕВАЯ СХЕМА (после наведения порядка)
======================================================================

Правило: ОДИН вход для событий (quasar.yml), модули — только
workflow_call, сателлиты — только если платформа требует отдельного
триггера (CodeQL, dependency-review, dependabot, pages).

  Слой 1. СОБЫТИЯ -> quasar.yml (router.mjs решает)
    ├─ _checks          (единственный чек-сьют; ci.yml/tests.yml удалить)
    ├─ _ai-review       (PR)
    ├─ _ai-fix          (label ai-fix / escalation)
    ├─ _close-issues    (merge)
    ├─ _merge-bot       (по конституции)
    └─ _pr-polish       (synchronize в ветках агента)

  Слой 2. РАСПИСАНИЕ -> один слот в quasar.yml, маршрутизация по минуте:
    03:20  learn          (ночь)
    */90   idle-agent     (через два interleaved cron'а из пакета v9)
    12,42  scout          (мониторинг)
    06:00  hub-audit      (понедельник)
    daily  autofix-daily (только plan->diagnose->escalate; heal убрать
            в отдельный вызов по событию, чтобы не жечь лимит)
    stale убрать из отдельного workflow -> тот же слот

  Слой 3. САТЕЛЛИТЫ (оставить как есть, это платформа):
    codeql.yml, dependency-review.yml, dependabot-auto-merge.yml,
    labeler.yml (событие pull_request_target — платформенный), pages.yml

  УДАЛИТЬ/СЛИТЬ:
    ci.yml, tests.yml     -> весь мир чеков живёт в _checks.yml
    auto-update-prs.yml   -> слить в _close-issues (оба про PR-ветки)
    отдельные cron-workflows (stale, hub-audit, learn, idle, scout)
                          -> единый schedule-слот в quasar.yml

======================================================================
4. ПЛАН МИГРАЦИИ (по шагам, каждый шаг = отдельный маленький PR)
======================================================================

  Шаг 1. [workflows, ручной review] Удалить ci.yml и tests.yml; в
         branch protection заменить required checks: было
         «QUASAR CI / QUASAR Tests» -> стало «checks» (имя job'а в
         _checks.yml). До мержа этого шага остальное не трогать.

  Шаг 2. Перевести cron'ы: добавить единый schedule-слот в quasar.yml
         (90-минутный интерleaved + 12,42 scout + 03:20 learn + пн 06:00
         hub-audit), убрать on.schedule у модулей (workflow_call его
         игнорирует — просто зачистка читаемости), удалить отдельные
         cron-workflows. Router уже умеет различать слоты по строке cron.

  Шаг 3. autofix.yml: убрать собственный schedule (остаётся
         workflow_run на падения + вызов из schedule-слота через
         gh workflow run с параметром). Escalate-job оставить.

  Шаг 4. idle-gate починить: считать «занятыми» только run'ы НЕ свои —
         отфильтровывать по head_branch/имени (все autopilot/*, idle/*,
         scout, learn, autofix-daily НЕ блокируют простой). Иначе
         idle-agent так и будет молчать.

  Шаг 5. merge-bot + constitution: включить автономный merge для классов
         docs/scripts (autonomy.json mergePolicy), чтобы закрывать цикл
         learn (урок закрывается по ai-fix-мержу — без merge-бота learn
         бессмысленен).

  Шаг 6. hub-audit дополнить: правило «нет workflow с on.* кроме
         workflow_call, кроме сателлитов из белого списка» и «суммарный
         cron-бюджет ≤ 1900/мес». Тогда беспорядок физически невозможен
         без красного флага в аудите.

======================================================================
5. КОНТРОЛЬНЫЕ ЦИФРЫ (после порядка)
======================================================================

  Workflow-файлы:      ~12 (было 15+)
  Триггеров schedule:  5 строк в одном файле (было 8+ размазано)
  Чек-сьют на пуш:     1 прогон (было 3)
  Cron-бюджет:         ~1900/мес (idle 480 + scout 1440 + learn 30 +
                       autofix-daily 30 + hub-audit 4 — впритык, scout
                       при необходимости резать до 1×/час)
  Required checks:     1 имя («checks»)

======================================================================
ПРИЛОЖЕНИЕ: патч idle_check.py для Шага 4 (свои run'ы не блокируют простой)
======================================================================

В scripts/idle_check.py заменить начало is_idle():

```python
# Свои/плановые run'ы простой не блокируют — иначе организм никогда
# не увидит простое из-за собственного cron-шума.
OWN_PATTERNS = ("autofix", "idle-agent", "scout", "learn", "stale",
                "hub-audit", "auto-update", "labeler", "dependabot")

def is_idle() -> tuple[bool, str]:
    runs = json.loads(gh("run", "list", "--status", "in_progress",
                        "--limit", "50", "--json",
                        "databaseId,workflowName,headBranch"))
    foreign = [r for r in runs
               if not any(p in r["workflowName"].lower() for p in OWN_PATTERNS)]
    if len(foreign) > MAX_ACTIVE:
        return False, f"{len(foreign)} foreign runs in progress"
    # ... дальше проверка human PR без изменений
```

======================================================================
6. РАБОТА С ТЕКУЩИМИ ХВОСТАМИ (параллельно с миграцией)
======================================================================

  #176  — рабочий процесс: смотрим падающий шаг, ai-fix или руками;
          после зелёного main закрывается.
  #166  — снять и повесить ai-fix заново (событие при развёрнутом
          контуре) — первый полный цикл.
  #170  — «Closes #167, Closes #168» перед мержем.
  #154/#157 — ai-fix по мере готовности (после шага 2, когда
          schedule-контур стабилен).
