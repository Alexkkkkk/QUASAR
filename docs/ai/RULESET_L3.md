# Branch protection `main`: CI-only auto-merge

Актуальная политика QUASAR, обновлена 2026-10-22. Это не предложение: она
применена к ruleset `QUASAR main protection` (id `24596486`) и хранится в
[`ruleset-l3.json`](./ruleset-l3.json). Человеческие approving reviews отключены
постоянно и в ruleset, и в legacy classic branch protection
(`required_approving_review_count: 0`); review bypass allowances пусты.

## Merge gates

- `required_approving_review_count: 0`; code-owner review, last-push approval и
  review-thread resolution не требуются.
- `bypass_actors: []`; никто не обходит защиту ветки.
- Status checks обязательны и должны относиться к актуальной базе
  (`strict_required_status_checks_policy: true`): `validate / verify`, `CodeQL`,
  `Tests (contracts)`, `Tests (dapp)`, `Tests (python)`, `review`.
- Автоматика переводит draft в ready и ставит auto-merge в очередь только после
  `SUCCESS` каждого обязательного context на текущем head SHA. Пропущенные,
  отсутствующие, pending и failed checks не считаются зелёными.
- `do-not-merge` останавливает авто-слияние. GitHub ruleset остаётся последней
  server-side защитой; automation не использует bypass.

## Deployment boundary

GitHub Pages deploy workflow удалён и отключён. Авто-merge изменений `website/**`
не публикует сайт; текущая опубликованная версия может оставаться доступной, но
не обновляется автоматически через Pages. Contract deployment, транзакции и
любые on-chain действия запрещены и не входят в merge automation.

## Reapply the desired state

`setup-repo.sh` применяет этот же файл `docs/ai/ruleset-l3.json` и проверяет,
что Pages deployment workflow отсутствует. Скрипт также сбрасывает classic
branch-protection review count до 0, если такой review rule существует, не снимая
остальные защиты ветки. Для ручного применения ruleset:

```bash
gh api --method PUT repos/Alexkkkkk/QUASAR/rulesets/24596486 \
  -H "Accept: application/vnd.github+json" \
  --input docs/ai/ruleset-l3.json
```
