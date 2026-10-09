#!/usr/bin/env bash
# Детерминированные фиксеры для workflow `QUASAR autofix`.
#
# Принципы:
#   1. Только обратимые, механические операции — ничего из текста issue и лога
#      не исполняется как команда.
#   2. Контракты (`contracts/**`), `.github/workflows/**`, `package.json`
#      корня, деплой-скрипты и секреты не переписываются этим скриптом.
#   3. Каждый фиксер идемпотентен: повторный запуск не даёт новых изменений.
#
# Переменные окружения:
#   PLAN      — путь к plan.json от scripts/autofix/classify_failure.py (опционально)
#   EVIDENCE  — каталог с уликами (опционально)

set -euo pipefail

PLAN="${PLAN:-}"
EVIDENCE="${EVIDENCE:-}"

log() { printf '\033[1;36m[autofix]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[autofix]\033[0m %s\n' "$*" >&2; }

log "Планировщик: ${PLAN:-не задан}; улики: ${EVIDENCE:-не задан}"

# --- 1. Синхронизация пинов GitHub Actions --------------------------------
# Детерминированно: SHA переразрешаются из тегов, объявленных в
# scripts/action_pins.json. Работает и когда упал именно pins:check.
log "Переразрешение SHA для пиннутых actions"
npm run pins:sync --silent || warn "pins:sync завершился с ошибкой — пропускаю"

# --- 2. Форматирование ------------------------------------------------
# prettier применяется только там, где он объявлен как зависимость.
if [[ -f integrations/minter-tasks/package.json ]] && [[ -x integrations/minter-tasks/node_modules/.bin/prettier || -x node_modules/.bin/prettier ]]; then
  log "Форматирование вложенного dApp"
  (
    cd integrations/minter-tasks
    npx --no-install prettier --write "src/**/*.{ts,tsx,css}" "*.json" >/dev/null 2>&1 \
      || warn "prettier в dApp завершился с ошибкой — пропускаю"
  )
else
  log "prettier в dApp не установлен — пропускаю форматирование"
fi

# --- 3. Зависимости вложенного dApp --------------------------------------
# Только неразрушающие обновления: `npm audit fix` без `--force`, чтобы
# никогда не перейти на ломающий major автоматически.
if [[ -f integrations/minter-tasks/package-lock.json ]]; then
  log "Установка зависимостей вложенного dApp"
  (
    cd integrations/minter-tasks
    npm ci --ignore-scripts --no-audit --no-fund >/dev/null 2>&1 \
      || npm install --ignore-scripts --no-audit --no-fund >/dev/null 2>&1 \
      || warn "установка зависимостей dApp не удалась"

    log "Безопасные обновления (npm audit fix без --force)"
    npm audit fix --ignore-scripts --no-fund >/dev/null 2>&1 \
      || warn "npm audit fix не смог устранить часть алертов без ломающих изменений"

    log "Аудит после фиксов"
    npm audit --audit-level=high || warn "в dApp остаются уязвимости уровня high и выше"
  )
fi

# --- 4. Аудит корневого проекта ------------------------------------------
log "Безопасные обновления корневого проекта"
npm audit fix --no-fund >/dev/null 2>&1 || warn "npm audit fix в корне не смог устранить часть алертов"

# --- 5. Пересборка lock-файлов без установки ------------------------------
# Лечит класс `npm ci can only install ... lock file out of sync`.
if [[ -f package-lock.json ]]; then
  log "Проверка согласованности lock-файла корня"
  npm install --package-lock-only --ignore-scripts --no-fund >/dev/null 2>&1 \
    || warn "пересборка lock-файла корня не удалась"
fi
if [[ -f integrations/minter-tasks/package-lock.json ]]; then
  log "Проверка согласованности lock-файла dApp"
  (
    cd integrations/minter-tasks
    npm install --package-lock-only --ignore-scripts --no-fund >/dev/null 2>&1 \
      || warn "пересборка lock-файла dApp не удалась"
  )
fi

# --- 6. Отчёт о том, что реально изменилось -------------------------------
log "Изменённые файлы:"
git --no-pager diff --name-only || true

log "Детерминированные фиксеры завершены"
