import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';
import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import { QuasarDeFi } from '../build/quasar_defi_QuasarDeFi.js';

type Deployment = {
    network: string;
    totalSupply: number;
    contracts: { master?: { address?: string }; defi?: { address?: string } };
};

function fail(message: string): never {
    throw new Error('[testnet smoke] ' + message);
}

const deploymentPath = resolve(process.env.DEPLOYMENT_FILE || 'build/deployment.json');
const deployment = JSON.parse(readFileSync(deploymentPath, 'utf8')) as Deployment;
if (deployment.network !== 'testnet') fail('deployment.json must describe testnet, not ' + deployment.network);
const masterAddress = deployment.contracts.master?.address;
const defiAddress = deployment.contracts.defi?.address;
if (!masterAddress || !defiAddress) fail('master and defi addresses are required');

const client = new TonClient({
    endpoint: process.env.TONCENTER_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TONCENTER_API_KEY || ''
});
const master = client.open(QuasarMaster.fromAddress(Address.parse(masterAddress)));
const defi = client.open(QuasarDeFi.fromAddress(Address.parse(defiAddress)));

const [masterDeployed, defiDeployed] = await Promise.all([
    client.isContractDeployed(master.address),
    client.isContractDeployed(defi.address)
]);
if (!masterDeployed) fail('QuasarMaster is not deployed at ' + master.address.toString());
if (!defiDeployed) fail('QuasarDeFi is not deployed at ' + defi.address.toString());

const [jetton, linkedDefi, linkedMaster, pool] = await Promise.all([
    master.getGetJettonData(),
    master.getGetDefiAddress(),
    defi.getQsrMaster(),
    defi.getPoolInfo()
]);
if (linkedDefi.toRawString() !== defi.address.toRawString()) fail('Master does not point to the deployed DeFi address');
if (linkedMaster.toRawString() !== master.address.toRawString()) fail('DeFi does not point to the deployed Master address');
if (jetton.totalSupply <= 0n) fail('Jetton total supply is zero');
if (pool.totalSupply < 0n || pool.tonReserve < 0n || pool.qsrReserve < 0n) fail('Pool getter returned a negative reserve');

const expectedSupply = BigInt(deployment.totalSupply || 0) * 1_000_000_000n;
if (expectedSupply > 0n && jetton.totalSupply !== expectedSupply) {
    fail('totalSupply mismatch: expected ' + expectedSupply + ', got ' + jetton.totalSupply);
}

console.log(JSON.stringify({
    network: deployment.network,
    master: master.address.toString(),
    defi: defi.address.toString(),
    totalSupply: jetton.totalSupply.toString(),
    mintable: jetton.mintable,
    pool: {
        lpTotalSupply: pool.totalSupply.toString(),
        tonReserve: pool.tonReserve.toString(),
        qsrReserve: pool.qsrReserve.toString()
    },
    writes: 0,
    status: 'ok'
}, null, 2));
