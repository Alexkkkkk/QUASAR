# Ruleset для L3 (branch protection `main`) — предложение

Эпик #145 (Шаги 7 и 10: issues #152, #155). **Не применять без явного решения владельца.**

## Текущее (ruleset `QUASAR main protection`, id 24596486)
`required_approving_review_count: 0`; thread resolution выключен; контексты: `validate`, `Analyze (javascript-typescript)`, `Analyze (python)`; `strict`, `enforce_admins`.

## Предлагаемое для L3
`required_approving_review_count: 1`, `required_review_thread_resolution: true`, `require_last_push_approval: true`; контексты дополнить `Tests (contracts)`, `Tests (dapp)`, `Tests (python)`.

## Применение (после approve владельца)
```bash
gh api --method PUT repos/Alexkkkkk/QUASAR/rulesets/24596486 -H "Accept: application/vnd.github+json" --input docs/ai/ruleset-l3.json
```
`autonomy.json`/`merge-bot` (L3-full) не включены — противоречат требованию human review в #152. L4/on-chain закрыт.
