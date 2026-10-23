import 'dotenv/config';
import { toNano, Address } from '@ton/core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Atomic write: the payload is fully written to a private temp file in the same
// directory, flushed, and then renamed over the destination. rename(2) is
// atomic on POSIX, so a concurrent reader can never observe a half-written
// deployment.json and there is no check-then-write window left for a symlink or
// another process to exploit (code scanning js/file-system-race, alert #5).
function writeJsonAtomic(file: string, contents: string): void {
    const dir = path.dirname(file);
    fs.mkdirSync(dir, { recursive: true });
    const tmp = path.join(dir, `.${path.basename(file)}.${process.pid}.tmp`);
    const fd = fs.openSync(tmp, 'w', 0o600);
    try {
        fs.writeFileSync(fd, contents);
        fs.fsyncSync(fd);
    } finally {
        fs.closeSync(fd);
    }
    fs.renameSync(tmp, file);
}

const network = process.env.TON_NETWORK?.trim().toLowerCase();
if (network !== 'mainnet' && network !== 'testnet') {
    throw new Error('TON_NETWORK must be explicitly set to "mainnet" or "testnet"');
}
const isMainnet = network === 'mainnet';
const endpoint = isMainnet
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC';

async function deploy() {
    const mnemonic = process.env.WALLET_MNEMONIC?.trim().split(/\s+/);
    if (!mnemonic || mnemonic.length !== 24) {
        console.error('Set WALLET_MNEMONIC (24 words) in .env');
        process.exit(1);
    }

    const keyPair = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain: 0
    });
    const client = new TonClient({
        endpoint,
        apiKey: process.env.TONCENTER_API_KEY || ''
    });

    const deploymentPath = path.join(__dirname, '..', 'build', 'deployment.json');
    // Read directly and handle a missing/corrupt file in the catch block instead
    // of testing existence first: a check-then-read on the same path is a TOCTOU
    // race (code scanning js/file-system-race, alert #5).
    let deployment: { contracts: Record<string, { address: string; name: string; deployedAt: string }> };
    try {
        deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
    } catch {
        console.error('Run deploy_all.ts first or create build/deployment.json');
        process.exit(1);
    }
    const qsrMaster = Address.parse(deployment.contracts.master.address);
    const { QuasarDeFi } = await import('../build/quasar_defi_QuasarDeFi.js');
    const { QuasarMaster } = await import('../build/quasar_QuasarMaster.js');
    const defi = client.open(await QuasarDeFi.fromInit(wallet.address, qsrMaster));
    const master = client.open(QuasarMaster.fromAddress(qsrMaster));
    const sender = wallet.sender(client.provider(wallet.address), keyPair.secretKey);

    console.log('Deployer:', wallet.address.toString());
    console.log('QuasarMaster:', qsrMaster.toString());
    console.log('QuasarDeFi:', defi.address.toString());

    await defi.send(
        sender,
        { value: toNano('0.5') },
        { $$type: 'Deploy', queryId: 0n }
    );
    await new Promise(resolve => setTimeout(resolve, 15000));

    console.log('Linking QuasarMaster ↔ QuasarDeFi...');
    await master.send(
        sender,
        { value: toNano('0.05') },
        { $$type: 'SetDefiAddress', defiAddress: defi.address }
    );

    deployment.contracts.defi = {
        address: defi.address.toString(),
        name: 'QuasarDeFi',
        deployedAt: new Date().toISOString()
    };
    const deploymentJson = JSON.stringify(deployment, null, 2);
    writeJsonAtomic(deploymentPath, deploymentJson);
    writeJsonAtomic(path.join(__dirname, '..', 'website', 'deployment.json'), deploymentJson);
    console.log('QuasarDeFi deployed and deployment.json updated.');
}

deploy().catch(error => {
    console.error('DeFi deployment failed:', error);
    process.exit(1);
});
