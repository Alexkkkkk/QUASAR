# Локальный AI Agent Wallet на Tolk/Acton

Это изолированный учебный пример для Acton 1.2.1. Владелец назначает, меняет или отзывает агента; назначенный агент может выполнить TON-перевод с последовательным `seqno`. Контракт проверяет owner/agent authorization, нулевые адреса и суммы, точный `seqno` для защиты от повторов, а исходящий перевод создаётся с bounce policy `Only256BitsOfBody` и `SEND_MODE_PAY_FEES_SEPARATELY`.

Тесты используют только локальную эмуляцию Acton и покрывают отказ неавторизованных вызовов, rotation/revoke, неверный и повторный `seqno`, нулевую сумму, успешный перевод и отклонённый перевод. Для повторной генерации ABI-обёртки выполните `acton wrapper AgentWallet --output-dir wrappers`.

```sh
cd examples/ai-agent-wallet
acton init --stdlib-only
acton fmt --check
acton build
acton wrapper AgentWallet --output-dir wrappers
acton check
acton test
```

В примере нет mnemonic/private keys, сетевых endpoint'ов, deploy/broadcast-скриптов, адресов или on-chain действий. Он **не проходил независимый аудит** и не предназначен для хранения средств или production-использования. Любая адаптация реального кошелька требует отдельного threat model и независимого аудита.
