# Проверяемый статический dApp artifact

Этот документ описывает только подготовку файлов из `website/` к статической
публикации. Он не разрешает Pages publication, создание `deployment.json`,
подключение кошелька, подписание сообщений или любую on-chain операцию.

## Состав artifact

`website/index.html` загружает wallet runtime только из tracked-файлов:

- `website/vendor/tonconnect-ui-3.0.2.min.js` — зафиксированный TON Connect UI;
- `website/vendor/tonconnect.bundle.js` — browser bundle для
  `website/tonconnect.js` и закреплённой `@ton/core`;
- `website/config.js`, `website/amounts.js`, manifest, metadata и изображения.

`website/vendor/tonconnect.bundle.manifest.json` фиксирует SHA-256 исходника и
bundle, версию `esbuild`, набор аргументов и версию `@ton/core`. Лицензии
поставщиков сохранены в `website/vendor/TONCONNECT-UI-LICENSE.txt` и
`website/vendor/TON-CORE-LICENSE.txt`.

Без `website/deployment.json` интерфейс остаётся fail-closed: адреса пусты,
TON Connect скрыт, а contract controls disabled. Даже корректный testnet
artifact не делает проект audited или готовым к mainnet.

## Проверка release candidate

После `npm ci` и установки закреплённого Acton выполните:

```bash
npm run build
bash website/scripts/build-tonconnect-bundle.sh --check
npm test
```

`--check` пересобирает bundle во временный файл с закреплённым
`esbuild@0.25.12`, не меняет tracked-файлы и требует точного совпадения bundle
и provenance manifest. Тест `tests/website_release_asset.test.ts` запускает ту
же проверку, проверяет self-hosted asset graph и проверяет, что manifest и
metadata ссылаются на существующие PNG assets.

## Осознанное обновление bundle

При изменении `website/tonconnect.js` обновление выполняется только явно:

```bash
bash website/scripts/build-tonconnect-bundle.sh --write
bash website/scripts/build-tonconnect-bundle.sh --check
npm test
```

В review должны входить вместе исходник, bundle и его manifest. Перед merge
нужны все обязательные checks репозитория. Не заменяйте self-hosted wallet
runtime на mutable CDN URL.

## После отдельного разрешения на публикацию

После отдельно одобренной публикации Pages выполняется только read-only
`npm run tonconnect:smoke`. Он проверяет origin и публичные статические URLs,
но не создаёт адреса, не подтверждает контрактный deployment и не заменяет
rehearsal, audit или governance release decision.
