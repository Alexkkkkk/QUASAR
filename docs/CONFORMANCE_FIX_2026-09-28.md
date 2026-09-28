# Исправления соответствия (docs.ton.org) — 2026-09-28

Аудит фронтенда и конфигурации TON Connect по актуальной документации `docs.ton.org`
и по реальной ABI скомпилированных контрактов.

## 1. Опкоды DeFi во фронтенде

`website/tonconnect.js` содержал вручную заданные опкоды, часть из которых не
совпадала со значениями, которые генерирует компилятор Tact для сообщений
`QuasarDeFi`. Сверка выполнена с `build/quasar_defi_QuasarDeFi.ts`.

| Сообщение | Было (фронтенд) | Стало (= ABI) |
|-----------|-----------------|----------------|
| `AddLiquidity` | 146776957 | 3092728186 |
| `RemoveLiquidity` | 3287568056 | 1352338794 |
| `SwapToTON` | 1118291020 | 2498242160 |
| `SwapToQSR` | 3020093557 | 1827817842 |

Без этого любая операция ликвидности/свопа с сайта отклонялась бы (Invalid opcode).

## 2. Тела сообщений DeFi

Сообщения `AddLiquidity`, `RemoveLiquidity`, `SwapToTON`, `SwapToQSR` собирались
без обязательных полей (`minLpOut`, `minTonOut`, `minQsrOut`, `deadline`).
Контракт проверяет `deadline > now()` (`_requireDeadline`), поэтому такие
сообщения отклонялись бы. Добавлены недостающие поля и явный `deadline`.

## 3. REST-эндпоинт Toncenter

Запрос баланса TON использовал `${jsonRPC}/getAddressBalance` —
несуществующий путь. Введён `restEndpoint()` (убирает суффикс `jsonRPC`);
getter-вызовы (`runGetMethod`) продолжают использовать jsonRPC.

Источник: <https://docs.ton.org/v3/guidelines/dapps/apis-sdks/ton-http-apis>

## 4. Манифест TON Connect

Поле `url` манифеста должно быть URL dApp (DApp identifier), а не путём к
репозиторию. `iconUrl` должен указывать на PNG (SVG не поддерживается),
рекомендуется 180×180.

Источник: <https://docs.ton.org/v3/guidelines/ton-connect/guidelines/creating-manifest>

## Проверка

- `npm test` — успешно (89 тестов, включая инварианты безопасности);
- `npx tsc --noEmit` — без ошибок;
- `npm run build` — успешно.
