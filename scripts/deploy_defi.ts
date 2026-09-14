import { toNano, Address } from '@ton/core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isMainnet = process.env.TON_NETWORK === 'mainnet';
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
    if (!fs.existsSync(deploymentPath)) {
        console.error('Run deploy_all.ts first or create build/deployment.json');
        process.exit(1);
    }

    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
    const qsrMaster = Address.parse(deployment.contracts.master.address);
    const { QuasarDeFi } = await import('../build/quasar_defi_QuasarDeFi.js');
    const defi = client.open(await QuasarDeFi.fromInit(wallet.address, qsrMaster));
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

    deployment.contracts.defi = {
        address: defi.address.toString(),
        name: 'QuasarDeFi',
        deployedAt: new Date().toISOString()
    };
    fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
    console.log('QuasarDeFi deployed and deployment.json updated.');
}

deploy().catch(error => {
    console.error('DeFi deployment failed:', error);
    process.exit(1);
});
