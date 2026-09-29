import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Address } from '@ton/core';

type ContractRecord = {
    address?: string;
    name?: string;
};

type Deployment = {
    name?: string;
    symbol?: string;
    decimals?: number;
    totalSupply?: number;
    network?: string;
    deployedAt?: string;
    contracts?: {
        master?: ContractRecord;
        defi?: ContractRecord;
        timelock?: ContractRecord;
    };
    wallet?: unknown;
    ai?: unknown;
};

const deploymentPath = resolve(process.env.DEPLOYMENT_FILE || 'website/deployment.json');

if (!existsSync(deploymentPath)) {
    console.log(`[deployment] no artifact at ${deploymentPath}; no deployment is published`);
    process.exit(0);
}

function fail(message: string): never {
    throw new Error(`[deployment] ${message}`);
}

const deployment = JSON.parse(readFileSync(deploymentPath, 'utf8')) as Deployment;

if (deployment.network !== 'mainnet' && deployment.network !== 'testnet') {
    fail('network must be exactly "mainnet" or "testnet"');
}
if (deployment.name !== 'QUASAR') fail('name must be QUASAR');
if (deployment.symbol !== 'QSR') fail('symbol must be QSR');
if (deployment.decimals !== 9) fail('decimals must be 9');
if (!Number.isSafeInteger(deployment.totalSupply) || (deployment.totalSupply ?? 0) <= 0) {
    fail('totalSupply must be a positive whole-token number');
}

const contracts = deployment.contracts;
if (!contracts) fail('contracts is required');

for (const name of ['master', 'defi', 'timelock'] as const) {
    const address = contracts[name]?.address;
    if (!address) fail(`contracts.${name}.address is required`);
    try {
        Address.parse(address);
    } catch {
        fail(`contracts.${name}.address is not a valid TON address`);
    }
}

if (deployment.wallet !== undefined) fail('wallet/deployer details must not be published');
if (deployment.ai !== undefined) {
    const ai = deployment.ai as Record<string, unknown>;
    if (typeof ai.oracle === 'string' && ai.oracle.length > 0) {
        try {
            Address.parse(ai.oracle);
        } catch {
            fail('ai.oracle is not a valid TON address');
        }
    }
}

if (deployment.deployedAt !== undefined && Number.isNaN(Date.parse(deployment.deployedAt))) {
    fail('deployedAt must be an ISO timestamp');
}

console.log(`[deployment] valid ${deployment.network} artifact: ${deploymentPath}`);