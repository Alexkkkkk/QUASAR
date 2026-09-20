# F-02 Remediation — TonConnect Manifest

Дата: 2026-09-20
Ветка: `fix/f02-tonconnect-manifest`

## Суть проблемы (F-02)

Из аудита (`docs/AUDIT_2026-09-17.md`):

> `website/tonconnect-manifest.json` отсутствует в репозитории, хотя на него
> ссылаются `config.js:7` и `tonconnect.js:45`

Файл с тех пор добавлен, но реальный остаток проблемы: сам манифест и оба
места ссылок указывали на мёртвый домен `quasar-ton.netlify.app`
(проверка 2026-09-20: HTTP 404). Кошельки не могут загрузить манифест →
кнопка подключения TON Connect не работает.

Спецификация TON Connect 2.0 требует: манифест должен быть доступен по
HTTPS, а его поле `url` — совпадать с origin, с которого манифест
загружается кошельком. Поэтому «просто поменять домен в одной строке»
недостаточно — источник и поле `url` должны быть согласованы.

## Что сделано

| Файл | Изменение |
|---|---|
| `website/tonconnect-manifest.json` | `url` и `iconUrl` переведены на `raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website` (анонимный доступ, версионирование git-ом); `termsOfUseUrl` / `privacyPolicyUrl` — на репозиторий GitHub |
| `website/config.js` | Дефолт `manifestUrl` — относительный `./tonconnect-manifest.json`: same-origin по спецификации и работает на любом хостинге (Netlify, GitHub Pages, свой домен) без правок кода |
| `website/tonconnect.js` | Fallback убран с мёртвого домена на тот же same-origin `./tonconnect-manifest.json` |
| `tests/security_regression.test.ts` | Новый source-инвариант F-02: манифест существует, валиден, все URL — https и не с мёртвого домена; `config.js`/`tonconnect.js` не содержат hardcode мёртвого домена; дефолт — same-origin relative |

## Оговорки

- `raw.githubusercontent.com` отдаёт `text/plain`, а не `application/json`,
  и не задаёт CORS-заголовки для произвольных origin. Для манифеста это
  обычно некритично (кошелёк запрашивает его сам), но для продакшена
  рекомендуется GitHub Pages или собственный домен — тогда достаточно
  положить сайт туда и манифест подхватится автоматически благодаря
  same-origin дефолту.
- Ссылка на сайт в `README.md` (`quasar-ton.netlify.app`) — информационная,
  не функциональная; обновить при появлении реального домена.
