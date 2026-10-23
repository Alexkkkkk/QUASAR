# QUASAR Tolk testnet rehearsal runbook

The repository intentionally provides no network deployment or smoke command for
the Tolk generation. The former Tact wrapper-based procedure is historical
material and cannot validate the new StateInit, storage or address space.

Before an externally approved testnet rehearsal, complete the reproducible build
gates in `docs/TESTNET_DEPLOY_CHECKLIST.md` and provide a reviewed adapter for
all StateInit builders, message encoders and getter decoders. The rehearsal must
use a disposable testnet wallet and exercise deploy reserve handling, TEP-74 and
TEP-89 vectors, authorization failures, liquidity paths, pending payout bounces
and Timelock queue/execute/cancel paths.

A rehearsal record must include the exact git commit, Acton version, generated
BoC/ABI hashes, testnet transaction hashes, generated addresses and a
reconciliation report. None of those values should be committed until the
separate deployment and migration approval is complete.
