# TON Docs conformance increment — 2026-10-24

This increment applies the directly relevant guidance from the official TON documentation to the active Tolk contracts.

## Implemented

- All four active contracts ignore empty internal message bodies. TON documents empty internal messages as ordinary balance top-ups; they are not protocol commands and must not be rejected as malformed opcodes.
- Existing Tolk dispatches use typed 32-bit message prefixes and lazy parsing, matching the modern `onInternalMessage` model.
- Existing bounce handlers use the correct `onBouncedMessage` entrypoint and constrain `Only256BitsOfBody` parsing to the bounced prefix. State rollback and replay tests cover Jetton, pool payout and TON payout paths.
- Existing TEP-74 handling authenticates the sender's derived Jetton wallet before accepting notifications, handles transfer/burn/excesses layouts, and preserves query-id correlation.
- Existing TEP-89 handling derives wallet addresses from the configured master and returns `addr_none` for incompatible workchains.
- Existing contract sends select `BounceMode.NoBounce` or `BounceMode.Only256BitsOfBody` explicitly; the code does not assume a full bounced body when only the 256-bit prefix is available.

## Verification

The new regression cases send an empty internal message to Wallet, Master, DeFi and AdminTimelock and require a successful transaction. The complete Acton build/check/test gate is run before publication.

## Source mapping

- [Jetton standard / TEP-74](https://docs.ton.org/contracts/standard/tokens/jettons/overview)
- [Finding a Jetton wallet / TEP-89](https://docs.ton.org/contracts/standard/tokens/jettons/find)
- [Tolk message handling](https://docs.ton.org/tolk/features/message-handling)
- [TON internal messages and bounces](https://docs.ton.org/foundations/messages/internal)
- [TON smart-contract security techniques](https://docs.ton.org/contracts/techniques/security)
- [Jetton asset processing and wallet verification](https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons)

## Intentionally operator-controlled

TON documentation also describes external-message signatures, network forks, wallet deployment, testnet/mainnet verification and asset processing. These are not silently automated: they require explicit keys, network endpoints, addresses and an approved release operation. The repository's offline deployment preflight remains the gate before such an operation.
