// Exact decimal/coin helpers for transaction values. Keep this file dependency-free so
// UI handlers never have to round a user-entered amount through Number.
(function attachQuasarAmountTools(root) {
    'use strict';

    // TON Coins is VarUInteger 16: at most 15 bytes of payload.
    const MAX_COINS = (1n << 120n) - 1n;

    function assertDecimals(decimals) {
        if (typeof decimals !== 'number' || !Number.isSafeInteger(decimals) || decimals < 0 || decimals > 255) {
            throw new RangeError('Token decimals must be an integer from 0 to 255');
        }
    }

    function assertCoinRange(amount) {
        if (typeof amount !== 'bigint' || amount < 0n || amount > MAX_COINS) {
            throw new RangeError('Amount is outside the TON Coins range');
        }
        return amount;
    }

    function parsePositiveNanoAmount(value, decimals = 9) {
        assertDecimals(decimals);
        if (typeof value !== 'string' || !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) {
            throw new TypeError('Enter a decimal amount without signs or exponent notation');
        }

        const [whole, fraction = ''] = value.split('.');
        if (fraction.length > decimals) {
            throw new RangeError(`Amount supports at most ${decimals} decimal places`);
        }

        const scale = 10n ** BigInt(decimals);
        const fractional = fraction === '' ? 0n : BigInt(fraction.padEnd(decimals, '0'));
        const amount = BigInt(whole) * scale + fractional;
        if (amount <= 0n) {
            throw new RangeError('Amount must be greater than zero');
        }
        return assertCoinRange(amount);
    }

    // A percentage expressed in basis points. Unlike a transaction amount, zero is valid.
    function parseSlippageBps(value) {
        if (typeof value !== 'string' || !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) {
            throw new TypeError('Enter a decimal percentage without signs or exponent notation');
        }
        const [whole, fraction = ''] = value.split('.');
        if (fraction.length > 2) {
            throw new RangeError('Slippage supports at most 2 decimal places');
        }
        const bps = BigInt(whole) * 100n + BigInt((fraction || '').padEnd(2, '0') || '0');
        if (bps >= 10000n) {
            throw new RangeError('Slippage must be between 0% and 100%');
        }
        return bps;
    }

    function formatNanoAmount(amount, decimals = 9, fractionDigits = 4) {
        assertDecimals(decimals);
        assertCoinRange(amount);
        if (typeof fractionDigits !== 'number' || !Number.isSafeInteger(fractionDigits) || fractionDigits < 0) {
            throw new RangeError('Fraction digits must be a non-negative integer');
        }
        const scale = 10n ** BigInt(decimals);
        const whole = amount / scale;
        if (fractionDigits === 0 || decimals === 0) return whole.toString();
        const fraction = (amount % scale).toString().padStart(decimals, '0').slice(0, fractionDigits);
        return `${whole}.${fraction.padEnd(fractionDigits, '0')}`;
    }

    root.QUASARAmounts = Object.freeze({
        MAX_COINS,
        assertCoinRange,
        parsePositiveNanoAmount,
        parseSlippageBps,
        formatNanoAmount,
    });
})(window);
