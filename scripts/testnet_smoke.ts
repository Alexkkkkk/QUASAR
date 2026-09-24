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

const [jetton, maxSupply, reserveBalance, custodyBalance, linkedDefi, linkedMaster, pool, feeBps, buyback] = await Promise.all([
    master.getGetJettonData(),
    master.getGetMaxSupply(),
    master.getGetReserveBalance(),
    master.getGetCustodyBalance(),
    master.getGetDefiAddress(),
    defi.getQsrMaster(),
    defi.getPoolInfo(),
    defi.getFeeConfig(),
    master.getGetBuybackState()
]);
if (linkedDefi.toRawString() !== defi.address.toRawString()) fail('Master does not point to the deployed DeFi address');
if (linkedMaster.toRawString() !== master.address.toRawString()) fail('DeFi does not point to the deployed Master address');
if (jetton.totalSupply <= 0n) fail('Jetton total supply is zero');
if (maxSupply !== 1_000_000_000n * 1_000_000_000n) fail('Unexpected hard supply cap: ' + maxSupply);
if (jetton.totalSupply > maxSupply) fail('Jetton total supply exceeds the hard cap');
if (reserveBalance < 0n || custodyBalance < 0n) fail('Master getter returned a negative balance');
if (pool.totalSupply < 0n || pool.tonReserve < 0n || pool.qsrReserve < 0n) fail('Pool getter returned a negative reserve');
if (feeBps <= 0n || feeBps > 30n) fail('DeFi fee exceeds the documented 30 bps ceiling: ' + feeBps);
if (!buyback.enabled || buyback.threshold <= 0n) fail('Buyback configuration is not initialized');

const expectedSupply = BigInt(deployment.totalSupply || 0) * 1_000_000_000n;
if (expectedSupply > 0n && jetton.totalSupply !== expectedSupply) {
    fail('totalSupply mismatch: expected ' + expectedSupply + ', got ' + jetton.totalSupply);
}

console.log(JSON.stringify({
    network: deployment.network,
    master: master.address.toString(),
    defi: defi.address.toString(),
    totalSupply: jetton.totalSupply.toString(),
    maxSupply: maxSupply.toString(),
    mintable: jetton.mintable,
    masterBalances: {
        reserve: reserveBalance.toString(),
        custody: custodyBalance.toString()
    },
    pool: {
        lpTotalSupply: pool.totalSupply.toString(),
        tonReserve: pool.tonReserve.toString(),
        qsrReserve: pool.qsrReserve.toString(),
        feeBps: feeBps.toString()
    },
    buyback: {
        enabled: buyback.enabled,
        threshold: buyback.threshold.toString()
    },
    writes: 0,
    status: 'ok'
}, null, 2));
