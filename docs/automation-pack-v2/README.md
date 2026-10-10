# QUASAR: память + эскалация (установка)

Три недостающих куска, чтобы агенты учились и исправляли сами:
escalate (авто-issue после неудачного heal), learn (ночная запись уроков),
failure_patterns.md (память обеих моделей).

## Куда класть

| Файл из архива | Путь в репозитории |
|---|---|
| `autofix-escalate.job.yml` | добавить job `escalate` в `.github/workflows/autofix.yml` (после job `heal`) |
| `_learn.yml` | `.github/workflows/_learn.yml` |
| `learn_loop.py` | `scripts/learn_loop.py` |
| `failure_patterns.md` | `docs/ai/failure_patterns.md` |
| `escalation-issue-template.md` | текст для issue (используется escalate job'ом) |

## Проверка

1. `python3 scripts/learn_loop.py --dry-run` локально.
2. Вручную: `gh workflow run "QUASAR autofix"` после падения heal —
   должен появиться issue «Failing checks on main (heal exhausted)».
3. Повесить `ai-fix` на issue → полный цикл агента → draft PR.
