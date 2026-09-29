// Verifies that the opcode map used by the dApp matches the compiled ABI.
//
// `website/tonconnect.js` mirrors contract opcodes by hand, so a contract
// change could silently leave the dApp sending a message the contract rejects
// (issues #55, #61). This script maps each dApp entry to its ABI message name
// and fails when the numeric value differs from the compiler's header.
//
// Run with: npm run abi:dapp (CI runs it after `npm run build`).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ABI_DIR = 'build';
const DAPP_FILE = 'website/tonconnect.js';

// dApp constant -> ABI (Tact message) name. Keep in sync when a dApp entry is
// renamed; an unmapped entry is a failure, never a silent skip.
const DAPP_TO_ABI: Record<string, string> = {
    STAKE_QSR: 'Stake',
    UNSTAKE_QSR: 'Unstake',
    CLAIM_STAKE: 'ClaimRewards',
    ADD_LIQUIDITY: 'AddLiquidity',
    REMOVE_LIQUIDITY: 'RemoveLiquidity',
    SWAP_TO_TON: 'SwapToTON',
    SWAP_TO_QSR: 'SwapToQSR',
    CLAIM_FARM: 'ClaimFarmRewards',
    REFUND_PENDING_QSR: 'RefundPendingQsr',
};

type AbiType = { name: string; header?: number | null };

function abiHeaders(): Map<string, number> {
    const headers = new Map<string, number>();
    for (const file of readdirSync(ABI_DIR).filter((f) => f.endsWith('.abi'))) {
        const abi = JSON.parse(readFileSync(join(ABI_DIR, file), 'utf8')) as { types?: AbiType[] };
        for (const type of abi.types ?? []) {
            if (typeof type.header === 'number') headers.set(type.name, type.header);
        }
    }
    return headers;
}

function main() {
    const source = readFileSync(DAPP_FILE, 'utf8');
    const headers = abiHeaders();
    const failures: string[] = [];

    const block = /const OP = \{([\s\S]*?)\n\};/.exec(source);
    if (!block) {
        console.error('dApp ABI check: could not locate the `const OP = { ... }` map');
        process.exitCode = 1;
        return;
    }

    const entries = new Map<string, number>();
    for (const [, name, value] of block[1].matchAll(/([A-Z_0-9]+):\s*(\d+)/g)) {
        entries.set(name, Number(value));
    }
    if (entries.size === 0) {
        console.error('dApp ABI check: the dApp opcode map is empty');
        process.exitCode = 1;
        return;
    }

    for (const [dappName, value] of entries) {
        const abiName = DAPP_TO_ABI[dappName];
        if (!abiName) {
            failures.push(`${dappName}: no ABI mapping registered in DAPP_TO_ABI`);
            continue;
        }
        const header = headers.get(abiName);
        if (header === undefined) {
            failures.push(`${dappName}: ABI message ${abiName} not found in ${ABI_DIR}/*.abi`);
            continue;
        }
        if (header !== value) {
            failures.push(`${dappName}: dApp has ${value} (0x${value.toString(16)}) but ABI ${abiName} is ${header} (0x${header.toString(16)})`);
        }
    }

    const transfer = /const JETTON_TRANSFER_OP = 0x([0-9a-fA-F]+)/.exec(source);
    if (!transfer) {
        failures.push('JETTON_TRANSFER_OP: constant not found (TEP-74 transfer opcode is required)');
    } else {
        const value = parseInt(transfer[1], 16);
        const header = headers.get('TokenTransfer');
        if (header === undefined) failures.push('JETTON_TRANSFER_OP: TokenTransfer not found in the ABI');
        else if (header !== value) failures.push(`JETTON_TRANSFER_OP: dApp has 0x${value.toString(16)} but ABI TokenTransfer is 0x${header.toString(16)}`);
    }

    if (failures.length > 0) {
        console.error('dApp ABI check failed:');
        for (const failure of failures) console.error(`  - ${failure}`);
        process.exitCode = 1;
        return;
    }
    console.log(`Verified ${DAPP_FILE} against the compiled ABI (${entries.size} opcodes + TEP-74 transfer)`);
}

main();
