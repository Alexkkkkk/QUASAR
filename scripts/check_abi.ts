import { deepStrictEqual } from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type AbiType = {
    kind: string;
    type: string;
    optional: boolean;
    format?: string | number;
};

type AbiField = {
    name: string;
    type: AbiType;
};

type AbiTypeDefinition = {
    name: string;
    header: number | null;
    fields: AbiField[];
};

type AbiReceiver = {
    receiver: string;
    message: {
        kind: 'typed' | 'text';
        type?: string;
        text?: string;
    };
};

type AbiGetter = {
    name: string;
    methodId: number;
    arguments: AbiField[];
    returnType: AbiType;
};

type Abi = {
    types: AbiTypeDefinition[];
    receivers: AbiReceiver[];
    getters: AbiGetter[];
};

type Snapshot = {
    schemaVersion: 1;
    contract: string;
    artifact: string;
    messages: Array<{
        name: string;
        opcode: string;
        fields: AbiField[];
    }>;
    textReceivers: string[];
    getters: Array<{
        name: string;
        methodId: number;
        arguments: AbiField[];
        returns: AbiType;
    }>;
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'build');
const snapshotDir = join(root, 'docs', 'abi');

const contracts = [
    {
        contract: 'QuasarMaster',
        artifact: 'quasar_QuasarMaster.abi',
        snapshot: 'quasar-master.json'
    },
    {
        contract: 'QuasarWallet',
        artifact: 'quasar_QuasarWallet.abi',
        snapshot: 'quasar-wallet.json'
    },
    {
        contract: 'QuasarDeFi',
        artifact: 'quasar_defi_QuasarDeFi.abi',
        snapshot: 'quasar-defi.json'
    },
    {
        contract: 'QuasarAdminTimelock',
        artifact: 'quasar_admin_QuasarAdminTimelock.abi',
        snapshot: 'quasar-admin-timelock.json'
    }
] as const;

function typeShape(type: AbiType): AbiType {
    const shape: AbiType = {
        kind: type.kind,
        type: type.type,
        optional: type.optional
    };

    if (type.format !== undefined) {
        shape.format = type.format;
    }

    return shape;
}

function fieldShape(field: AbiField): AbiField {
    return {
        name: field.name,
        type: typeShape(field.type)
    };
}

function opcode(header: number): string {
    return `0x${header.toString(16).padStart(8, '0')}`;
}

function createSnapshot(artifact: string, contract: string, abi: Abi): Snapshot {
    const definitions = new Map(abi.types.map((type) => [type.name, type]));
    const typedReceivers = abi.receivers
        .filter((receiver) => receiver.message.kind === 'typed')
        .map((receiver) => receiver.message.type as string);

    const messages = [...new Set(typedReceivers)]
        .map((name) => {
            const definition = definitions.get(name);
            if (!definition || definition.header === null) {
                throw new Error(`Missing opcode definition for typed receiver ${name} in ${artifact}`);
            }

            return {
                name,
                opcode: opcode(definition.header),
                fields: definition.fields.map(fieldShape)
            };
        })
        .sort((left, right) => left.name.localeCompare(right.name));

    const textReceivers = abi.receivers
        .filter((receiver) => receiver.message.kind === 'text')
        .map((receiver) => receiver.message.text as string)
        .sort();

    const getters = abi.getters
        .map((getter) => ({
            name: getter.name,
            methodId: getter.methodId,
            arguments: getter.arguments.map(fieldShape),
            returns: typeShape(getter.returnType)
        }))
        .sort((left, right) => left.name.localeCompare(right.name));

    return {
        schemaVersion: 1,
        contract,
        artifact,
        messages,
        textReceivers,
        getters
    };
}

async function loadJson<T>(path: string): Promise<T> {
    return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function verifySharedWalletArtifact(): Promise<void> {
    const [masterWallet, defiWallet] = await Promise.all([
        readFile(join(buildDir, 'quasar_QuasarWallet.code.boc')),
        readFile(join(buildDir, 'quasar_defi_QuasarWallet.code.boc'))
    ]);

    if (!masterWallet.equals(defiWallet)) {
        throw new Error(
            'QuasarWallet code differs between quasar and quasar_defi builds. ' +
            'Both projects must use the shared contracts/quasar_common.tact implementation.'
        );
    }
}

async function main(): Promise<void> {
    const update = process.argv.includes('--update');

    await verifySharedWalletArtifact();

    for (const contract of contracts) {
        const artifactPath = join(buildDir, contract.artifact);
        const snapshotPath = join(snapshotDir, contract.snapshot);
        const abi = await loadJson<Abi>(artifactPath);
        const actual = createSnapshot(contract.artifact, contract.contract, abi);

        if (update) {
            await writeFile(snapshotPath, `${JSON.stringify(actual, null, 2)}\n`);
            console.log(`Updated ${contract.snapshot}`);
            continue;
        }

        const expected = await loadJson<Snapshot>(snapshotPath);
        try {
            deepStrictEqual(actual, expected);
        } catch {
            throw new Error(
                `ABI snapshot mismatch: ${contract.snapshot}. ` +
                'If the contract ABI change is intentional, run npm run abi:update and review the snapshot diff.'
            );
        }

        console.log(`Verified ${contract.contract}`);
    }
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});