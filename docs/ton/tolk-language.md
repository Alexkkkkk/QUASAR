# Tolk language (https://docs.ton.org/llms/tolk/overview/content.md)



Tolk is a statically typed language for writing smart contracts on TON. It provides declarative data structures, automatic cell serialization, and message handling primitives.

The language compiles to [TVM](https://docs.ton.org/llms/tvm/overview/content.md) and provides direct control over execution.

```tolk
type AllowedMessage = CounterIncrement | CounterReset

contract Counter {
    storage: Storage
    incomingMessages: AllowedMessage
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessage.fromSlice(in.body);
    match (msg) {
        CounterIncrement => { ... }
        CounterReset => { ... }
    }
}

get fun currentCounter() {
    val storage = lazy Storage.load();
    return storage.counter;
}
```

Tolk is compatible with existing [TON standards](https://docs.ton.org/llms/from-ethereum/content.md).

## Key features [#key-features]

Tolk provides high-level readability while preserving low-level control:

* a type system for describing [cell](https://docs.ton.org/llms/foundations/serialization/cells/content.md) layouts;
* [`lazy` loading](https://docs.ton.org/llms/tolk/features/lazy-loading/content.md) that skips unused fields;
* unified message composition and deployment;
* a [`contract` declaration](https://docs.ton.org/llms/tolk/features/contract-abi/content.md) that drives ABI export, TypeScript wrappers, source maps, and debugging;
* a compiler targeting the Fift assembler;
* tooling with IDE integration.

## From FunC to Tolk [#from-func-to-tolk]

Tolk evolved from FunC and is now the recommended language for TON smart contracts. To migrate from FunC:

* see [Tolk contract examples](https://docs.ton.org/llms/tolk/examples/content.md) for embedded jetton and NFT examples;
* check [gas benchmarks](https://github.com/ton-blockchain/tolk-bench);
* study [reference contracts](https://github.com/ton-blockchain/acton-contracts);
* read [Tolk vs FunC](https://docs.ton.org/llms/tolk/from-func/tolk-vs-func/content.md) for an overview;
* use the [FunC-to-Tolk converter](https://docs.ton.org/llms/tolk/from-func/converter/content.md) to migrate existing projects.

## Quick start [#quick-start]

Follow the [quickstart page in the Acton documentation](https://ton-blockchain.github.io/acton/docs/quickstart).

## IDE support [#ide-support]

1. [JetBrains IDEs plugin](https://docs.ton.org/llms/contracts/ide/jetbrains/content.md) provides syntax highlighting and code navigation.
2. [VSCode extension](https://docs.ton.org/llms/contracts/ide/vscode/content.md) adds syntax highlighting, code navigation, and other language features for VS Code and VS Code-based editors such as VSCodium, Cursor, and Windsurf.
3. [Language server](https://github.com/ton-blockchain/ton-language-server#other-editors) supports (Neo)Vim, Helix, and other editors with LSP support.

## Start with [#start-with]

* [Basic syntax](https://docs.ton.org/llms/tolk/basic-syntax/content.md)
* [Idioms and conventions](https://docs.ton.org/llms/tolk/idioms-conventions/content.md)
* [Contract examples](https://docs.ton.org/llms/tolk/examples/content.md)
* [Type system](https://docs.ton.org/llms/tolk/types/list-of-types/content.md)
* [Message handling](https://docs.ton.org/llms/tolk/features/message-handling/content.md)
