import "QuasarCommon"

contract QuasarWallet {
    storage: QuasarWalletStorage
    incomingMessages: AllowedMessageToWallet
}

type AllowedMessageToWallet =
    | TokenTransfer
    | TokenBurn
    | InternalTransfer
    | PoolPayout
    | TokenExcesses
    | TransferConfirmed
    | BurnConfirmed
    | ProvideWalletAddress

type BounceOpToHandle = InternalTransfer | FeeTransfer | BurnNotification

fun sendTokenExcesses(to: address, queryId: uint64, value: coins, mode: int) {
    val excessesMessage = createMessage({
        bounce: BounceMode.NoBounce,
        dest: to,
        value,
        body: TokenExcesses { queryId },
    });
    excessesMessage.send(mode);
}

fun sendNotification(
    owner: address,
    queryId: uint64,
    amount: coins,
    from: address,
    forwardTonAmount: coins,
    forwardPayload: slice,
) {
    val notificationMessage = createMessage({
        // The Tact reference uses bounce=true for the owner notification.
        bounce: BounceMode.Only256BitsOfBody,
        dest: owner,
        value: forwardTonAmount,
        body: TokenNotification { queryId, amount, from, forwardPayload },
    });
    notificationMessage.send(SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS);
}

fun sendInternalTransfer(
    deployment: AutoDeployAddress,
    queryId: uint64,
    amount: coins,
    from: address,
    responseDestination: address?,
    forwardTonAmount: coins,
    forwardPayload: slice,
    value: coins,
    sendMode: int,
) {
    val internalTransferMessage = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: deployment,
        value,
        body: InternalTransfer {
            queryId,
            amount,
            from,
            responseDestination,
            forwardTonAmount,
            forwardPayload,
        },
    });
    internalTransferMessage.send(sendMode);
}

fun onBouncedMessage(in: InMessageBounced) {
    // Only the opcode, query ID, and amount are guaranteed in a normal TON
    // bounce. Never read trailing addresses from the 224-bit prefix.
    in.bouncedBody.skipBouncedPrefix();
    val bounced = lazy BounceOpToHandle.fromSlice(in.bouncedBody);
    var storage = QuasarWalletStorage.load();

    match (bounced) {
        InternalTransfer => {
            assert (bounced.amount > 0) throw 100;
            val queryKey: int257 = bounced.queryId as int257;

            // Route by the marker first. A normal user query ID that happens to
            // collide with a pool sequence must not consume the pool ledger.
            val marked = queryKey >= QUASAR_POOL_PAYOUT_MARKER;
            var localId: int257 = queryKey;
            var poolAmount: int257? = null;
            if (marked) {
                localId = queryKey - QUASAR_POOL_PAYOUT_MARKER;
                val poolLookup = storage.pendingPoolPayouts.get(localId);
                if (poolLookup.isFound) {
                    poolAmount = poolLookup.loadValue();
                }
            }
            if (poolAmount != null) {
                storage.pendingPoolPayouts.delete(localId);
                storage.pendingPoolPayoutReceivers.delete(localId);
                storage.balance += bounced.amount;
                storage.save();

                val failed = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: storage.owner,
                    value: 0,
                    body: PayoutFailed {
                        queryId: localId as uint64,
                        amount: bounced.amount,
                        destination: storage.owner,
                    },
                });
                failed.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS);
                return;
            }

            val responseLookup = storage.pendingResponses.get(queryKey);
            val response: address? = responseLookup.isFound ? responseLookup.loadValue() : null;
            storage.pendingResponseFees.delete(queryKey);
            storage.pendingResponses.delete(queryKey);
            storage.pendingResponseReceivers.delete(queryKey);
            // The master-bound FeeTransfer is an independent asynchronous leg.
            // Its bounce restores the fee itself; this recipient-leg bounce
            // restores only principal, never a fee the master may have credited.
            storage.balance += bounced.amount;
            storage.save();

            if (!isNoResponseAddress(response) && response! != contract.getAddress()) {
                sendTokenExcesses(
                    response!,
                    bounced.queryId,
                    0,
                    SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS,
                );
            }
        }

        FeeTransfer => {
            assert (bounced.amount > 0) throw 100;
            val queryKey: int257 = bounced.queryId as int257;
            storage.balance += bounced.amount;
            storage.pendingResponseFees.delete(queryKey);
            storage.pendingResponseReceivers.delete(queryKey);
            storage.pendingResponses.delete(queryKey);
            storage.save();
        }

        BurnNotification => {
            assert (bounced.amount > 0) throw 100;
            val queryKey: int257 = bounced.queryId as int257;
            storage.balance += bounced.amount;
            val responseLookup = storage.pendingBurnResponses.get(queryKey);
            val response: address? = responseLookup.isFound ? responseLookup.loadValue() : null;
            storage.pendingBurnResponses.delete(queryKey);
            storage.save();

            if (!isNoResponseAddress(response) && response! != contract.getAddress()) {
                sendTokenExcesses(
                    response!,
                    bounced.queryId,
                    0,
                    SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS,
                );
            }
        }
    }
}

fun onInternalMessage(in: InMessage) {
    // TON empty-body transfers are balance top-ups, not protocol messages.
    if (in.body.isEmpty()) {
        return;
    }
    val message = lazy AllowedMessageToWallet.fromSlice(in.body);

    match (message) {
        InternalTransfer => {
            var storage = QuasarWalletStorage.load();
            val derived = quasarWalletAddress(message.from, storage.master, contract.getCode());
            assert (in.senderAddress == storage.master || in.senderAddress == derived) throw 100;
            assert (message.amount > 0) throw 101;

            // Master-owned custody is aggregate accounting and is deliberately
            // exempt. Master-funded DeFi deposits are also aggregate. User
            // credits and mint-marked credits retain the wallet cap.
            if (storage.owner != storage.master) {
                if (message.from != storage.master) {
                    assert (storage.balance + message.amount <= QUASAR_MAX_WALLET_AMOUNT) throw 102;
                } else if (isMintMarkedPayload(message.forwardPayload)) {
                    assert (storage.balance + message.amount <= QUASAR_MAX_WALLET_AMOUNT) throw 102;
                }
            }

            storage.balance += message.amount;
            storage.save();

            if (message.forwardTonAmount > 0) {
                sendNotification(
                    storage.owner,
                    message.queryId,
                    message.amount,
                    message.from,
                    message.forwardTonAmount,
                    message.forwardPayload,
                );
            }

            if (!isNoResponseAddress(message.responseDestination)) {
                sendTokenExcesses(
                    message.responseDestination!,
                    message.queryId,
                    0,
                    SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS,
                );
            }
        }

        TransferConfirmed => {
            var storage = QuasarWalletStorage.load();
            val receiverLookup = storage.pendingResponseReceivers.get(message.queryId as int257);
            if (!receiverLookup.isFound) {
                return;
            }
            assert (in.senderAddress == storage.master) throw 103;
            storage.pendingResponseFees.delete(message.queryId as int257);
            storage.pendingResponseReceivers.delete(message.queryId as int257);
            storage.pendingResponses.delete(message.queryId as int257);
            storage.save();
        }

        BurnConfirmed => {
            var storage = QuasarWalletStorage.load();
            assert (storage.pendingBurnResponses.exists(message.queryId as int257)) throw 104;
            assert (in.senderAddress == storage.master) throw 103;
            storage.pendingBurnResponses.delete(message.queryId as int257);
            storage.save();
        }

        TokenExcesses => {
            var storage = QuasarWalletStorage.load();
            val queryKey: int257 = message.queryId as int257;
            val feeLookup = storage.pendingResponseFees.get(queryKey);
            if (feeLookup.isFound) {
                val receiverLookup = storage.pendingResponseReceivers.get(queryKey);
                assert (receiverLookup.isFound) throw 105;
                val receiver = receiverLookup.loadValue();
                assert (
                    in.senderAddress ==
                    quasarWalletAddress(receiver, storage.master, contract.getCode())
                ) throw 106;
                storage.pendingResponseFees.delete(queryKey);
                storage.pendingResponses.delete(queryKey);
                storage.pendingResponseReceivers.delete(queryKey);
                storage.save();
                return;
            }

            // Pool IDs are stored without the marker, while the downstream
            // InternalTransfer and its excesses carry the marked query ID.
            val localId: int257 = queryKey >= QUASAR_POOL_PAYOUT_MARKER
                ? queryKey - QUASAR_POOL_PAYOUT_MARKER
                : queryKey;
            val poolLookup = storage.pendingPoolPayouts.get(localId);
            if (poolLookup.isFound) {
                val receiverLookup = storage.pendingPoolPayoutReceivers.get(localId);
                assert (receiverLookup.isFound) throw 105;
                val receiver = receiverLookup.loadValue();
                assert (
                    in.senderAddress ==
                    quasarWalletAddress(receiver, storage.master, contract.getCode())
                ) throw 106;
                storage.pendingPoolPayouts.delete(localId);
                storage.pendingPoolPayoutReceivers.delete(localId);
                storage.save();
                return;
            }

            val burnLookup = storage.pendingBurnResponses.get(queryKey);
            if (burnLookup.isFound) {
                assert (in.senderAddress == storage.master) throw 103;
                val burnResponse = burnLookup.loadValue();
                storage.pendingBurnResponses.delete(queryKey);
                storage.save();
                if (!isNoResponseAddress(burnResponse) && burnResponse! != contract.getAddress()) {
                    sendTokenExcesses(
                        burnResponse!,
                        message.queryId,
                        0,
                        SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS,
                    );
                }
            }
        }

        TokenTransfer => {
            var storage = QuasarWalletStorage.load();
            assert (in.senderAddress == storage.owner) throw 107;
            assert (message.amount > 0) throw 101;
            assert (!isZeroAddress(message.destination)) throw 108;

            val currentTime = blockchain.now();
            assert (currentTime - storage.lastTxTime >= QUASAR_TRANSFER_COOLDOWN) throw 110;
            if (storage.owner != storage.master) {
                assert (message.amount <= QUASAR_MAX_TX_AMOUNT) throw 111;
            }
            val queryKey: int257 = message.queryId as int257;
            assert (!storage.pendingResponseFees.exists(queryKey)) throw 112;
            if (queryKey >= QUASAR_POOL_PAYOUT_MARKER) {
                assert (
                    !storage.pendingPoolPayouts.exists(queryKey - QUASAR_POOL_PAYOUT_MARKER)
                ) throw 112;
            }

            val fee: coins = max(1, (message.amount * QUASAR_WALLET_FEE_BPS) / 10000);
            // TEP-74 `amount` is the amount the recipient receives. QUASAR's
            // fixed wallet fee is an additional debit, never a deduction from
            // the standard InternalTransfer amount.
            val totalDebit: coins = message.amount + fee;
            assert (storage.balance >= totalDebit) throw 109;
            // Tact's myBalance() includes the current account balance after the
            // storage phase; BALANCE FIRST is the corresponding safe primitive.
            assert (contract.getOriginalBalance() >= 75000000) throw 114;
            assert (in.valueCoins >= 70000000) throw 115;

            storage.lastTxTime = currentTime;
            storage.balance -= totalDebit;
            storage.pendingResponseFees.set(message.queryId as int257, fee as int257);
            storage.pendingResponseReceivers.set(message.queryId as int257, message.destination);
            storage.pendingResponses.set(message.queryId as int257, message.responseDestination);
            storage.save();

            val recipient = quasarWalletDeployment(
                message.destination,
                storage.master,
                contract.getCode(),
            );
            val feeMessage = createMessage({
                bounce: BounceMode.Only256BitsOfBody,
                dest: storage.master,
                value: 50000000,
                body: FeeTransfer {
                    queryId: message.queryId,
                    amount: fee,
                    originalSender: storage.owner,
                    originalReceiver: message.destination,
                },
            });
            feeMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);

            sendInternalTransfer(
                recipient,
                message.queryId,
                message.amount,
                storage.owner,
                message.responseDestination,
                message.forwardTonAmount,
                message.forwardPayload,
                20000000,
                SEND_MODE_PAY_FEES_SEPARATELY,
            );

            // The outgoing message budgets above total 0.07 TON. Return every
            // positive remainder to a supplied response destination instead of
            // retaining an additional fixed 0.02 TON from each transfer.
            val residual = in.valueCoins - 70000000;
            // Preserve QUASAR's legacy all-zero internal no-response sentinel.
            if (residual > 0 && !isNoResponseAddress(message.responseDestination)) {
                val excess = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: message.responseDestination!,
                    value: residual,
                    body: TokenExcesses { queryId: message.queryId },
                });
                excess.send(SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS);
            }
        }

        PoolPayout => {
            var storage = QuasarWalletStorage.load();
            assert (in.senderAddress == storage.owner) throw 107;
            assert (message.amount > 0) throw 101;
            assert (storage.balance >= message.amount) throw 109;
            val poolId: int257 = message.queryId as int257;
            assert (poolId < QUASAR_POOL_PAYOUT_MARKER) throw 112;
            assert (!storage.pendingPoolPayouts.exists(message.queryId as int257)) throw 112;
            val markedQueryKey: int257 = poolId + QUASAR_POOL_PAYOUT_MARKER;
            assert (!storage.pendingResponseFees.exists(markedQueryKey)) throw 112;

            storage.balance -= message.amount;
            storage.pendingPoolPayouts.set(message.queryId as int257, message.amount as int257);
            storage.pendingPoolPayoutReceivers.set(message.queryId as int257, message.destination);
            storage.save();

            val recipient = quasarWalletDeployment(
                message.destination,
                storage.master,
                contract.getCode(),
            );
            val markedQueryId: uint64 = message.queryId + QUASAR_POOL_PAYOUT_MARKER;
            sendInternalTransfer(
                recipient,
                markedQueryId,
                message.amount,
                storage.owner,
                message.responseDestination,
                0,
                createEmptySlice(),
                0,
                SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE,
            );
        }

        TokenBurn => {
            var storage = QuasarWalletStorage.load();
            assert (in.senderAddress == storage.owner) throw 107;
            assert (message.amount > 0) throw 101;
            assert (storage.balance >= message.amount) throw 109;
            assert (!storage.pendingBurnResponses.exists(message.queryId as int257)) throw 112;

            storage.balance -= message.amount;
            storage
                .pendingBurnResponses
                .set(message.queryId as int257, message.responseDestination);
            storage.save();

            val burn = createMessage({
                bounce: BounceMode.Only256BitsOfBody,
                dest: storage.master,
                value: 0,
                body: BurnNotification {
                    queryId: message.queryId,
                    amount: message.amount,
                    sender: storage.owner,
                    responseDestination: message.responseDestination,
                },
            });
            burn.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
        }

        ProvideWalletAddress => {
            val storage = QuasarWalletStorage.load();
            assert (in.valueCoins >= 6100000) throw 116;
            var walletAddress: any_address = createAddressNone();
            if (message.ownerAddress.isInternal()) {
                val requestedOwner = message.ownerAddress.castToInternal();
                val derivedWallet = quasarWalletAddress(
                    requestedOwner,
                    storage.master,
                    contract.getCode(),
                );
                val requestedOwnerAny = message.ownerAddress;
                val derivedWalletAny = derivedWallet as any_address;
                val (ownerWc, _) = requestedOwnerAny.getWorkchainAndHash();
                val (walletWc, _) = derivedWalletAny.getWorkchainAndHash();
                if (ownerWc == walletWc) {
                    walletAddress = derivedWalletAny;
                }
            }
            val ownerRef: Cell<any_address>? = message.includeAddress
                ? message.ownerAddress.toCell()
                : null;
            val response = createMessage({
                bounce: BounceMode.NoBounce,
                dest: in.senderAddress,
                value: 0,
                body: TakeWalletAddress {
                    queryId: message.queryId,
                    walletAddress,
                    ownerAddress: ownerRef,
                },
            });
            response.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
        }
    }
}

get fun get_wallet_data(): JettonWalletData {
    val storage = QuasarWalletStorage.load();
    return JettonWalletData {
        balance: storage.balance,
        owner: storage.owner,
        master: storage.master,
        walletCode: contract.getCode(),
    };
}
