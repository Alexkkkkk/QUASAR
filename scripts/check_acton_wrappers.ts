// Verify that generated Tolk wrappers expose every reviewed public message.
// This validates generation and opcode retention without importing legacy Tact
// wrappers or treating them as a build prerequisite.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generated = resolve(process.argv[2] ?? join(root, 'tolk/build/synchronized'));
const contracts = [
    ['QuasarWallet', 'quasar-wallet.json'],
    ['QuasarMaster', 'quasar-master.json'],
    ['QuasarDeFi', 'quasar-defi.json'],
    ['QuasarAdminTimelock', 'quasar-admin-timelock.json'],
] as const;

type Snapshot = { messages: Array<{ name: string; opcode: string }> };

let messages = 0;
for (const [contract, snapshot] of contracts) {
    const wrapperPath = join(generated, 'wrappers-ts', `${contract}.gen.ts`);
    const wrapper = await readFile(wrapperPath, 'utf8');
    const reviewed = JSON.parse(await readFile(join(root, 'docs/abi', snapshot), 'utf8')) as Snapshot;
    for (const message of reviewed.messages) {
        const escaped = message.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const match = new RegExp(
            `export const ${escaped} = \\{\\s*PREFIX: (0x[0-9a-f]+)`,
            'm',
        ).exec(wrapper);
        assert.ok(match, `${contract}.${message.name}: missing generated serializer`);
        assert.equal(
            Number.parseInt(match[1], 16),
            Number.parseInt(message.opcode, 16),
            `${contract}.${message.name}: generated opcode differs from reviewed ABI`,
        );
        messages++;
    }
}
console.log(`Tolk wrapper verification passed: ${messages} public message serializers`);
