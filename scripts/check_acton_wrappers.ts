// Differential wire check: both compilers must serialize the same public messages.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { Address, beginCell, type Cell } from '@ton/core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generated = resolve(process.argv[2] ?? join(root, 'tolk/build/synchronized'));
const contracts = [
    ['QuasarWallet', 'quasar-wallet.json', 'quasar_QuasarWallet.ts'],
    ['QuasarMaster', 'quasar-master.json', 'quasar_QuasarMaster.ts'],
    ['QuasarDeFi', 'quasar-defi.json', 'quasar_defi_QuasarDeFi.ts'],
    ['QuasarAdminTimelock', 'quasar-admin-timelock.json', 'quasar_admin_QuasarAdminTimelock.ts'],
] as const;
type Field = { name: string; type: { type: string; optional: boolean; format?: number | string } };
type Message = { name: string; fields: Field[] };

function normalizeTypeName(name: string): string {
    return name.replace(/[A-Z]{2,}(?=[A-Z][a-z]|$)/g, (match) => match[0] + match.slice(1).toLowerCase());
}

function value(field: Field, variant: number, tolk: boolean): unknown {
    const type = field.type;
    if (type.optional && variant === 0) return null;
    switch (type.type) {
        case 'uint': return BigInt(variant + 17);
        case 'int': return BigInt(variant === 0 ? -17 : 123);
        case 'bool': return variant === 1;
        case 'address': return new Address(0, Buffer.alloc(32, variant + 1));
        case 'cell': return beginCell().storeUint(variant + 19, 16).storeRef(beginCell().storeUint(3, 8).endCell()).endCell();
        case 'slice': return beginCell().storeBit(1).storeRef(beginCell().storeUint(23, 8).endCell()).endCell().beginParse();
        case 'string': return variant === 0 ? 'QUASAR' : 'wire-совместимость-'.repeat(30);
        case 'fixed-bytes': {
            assert.equal(typeof type.format, 'number');
            const bytes = Buffer.alloc(type.format as number, variant + 1);
            return tolk ? beginCell().storeBuffer(bytes).endCell().beginParse() : bytes;
        }
        default: throw new Error(`Unsupported ABI fixture type ${type.type}`);
    }
}

let messages = 0;
let cases = 0;
for (const [contract, snapshot, tactArtifact] of contracts) {
    const reference = JSON.parse(await readFile(join(root, 'docs/abi', snapshot), 'utf8')) as { messages: Message[] };
    const tact = await import(pathToFileURL(join(root, 'build', tactArtifact)).href);
    const tolk = await import(pathToFileURL(join(generated, 'wrappers-ts', `${contract}.gen.ts`)).href);
    for (const message of reference.messages) {
        const serializeTact = tact[`store${message.name}`];
        const serializeTolk = tolk[contract][`createCellOf${normalizeTypeName(message.name)}`];
        assert.equal(typeof serializeTact, 'function', `${contract}.${message.name}: missing Tact serializer`);
        assert.equal(typeof serializeTolk, 'function', `${contract}.${message.name}: missing Tolk serializer`);
        for (let variant = 0; variant < 2; variant++) {
            const bodyTact = Object.fromEntries(message.fields.map(field => [field.name, value(field, variant, false)]));
            const bodyTolk = Object.fromEntries(message.fields.map(field => [field.name, value(field, variant, true)]));
            const expected = beginCell().store(serializeTact({ $$type: message.name, ...bodyTact })).endCell();
            const actual: Cell = serializeTolk(bodyTolk);
            assert.ok(expected.equals(actual), `${contract}.${message.name}: wire mismatch, fixture ${variant}`);
            cases++;
        }
        messages++;
    }
}
console.log(`Tact/Tolk wire equivalence: ${messages} messages, ${cases} cell comparisons passed`);
