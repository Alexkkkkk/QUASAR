import { toNano, beginCell, Address, Cell } from '@ton/core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { QuasarMaster } from '../build/quasar_QuasarMaster';
import * as fs from 'fs';

// QUASAR Jetton Deployment Script (Tact + AI)
// The brightest AI-powered token in the TON universe

const JETTON_NAME = 'QUASAR';
const JETTON_SYMBOL = 'QSR';
const JETTON_DECIMALS = 9;
const TOTAL_SUPPLY = 1_000_000_000;

async function deploy() {
    console.log('🌟 Deploying QUASAR AI-Powered Jetton...');
    
    const client = new TonClient({
        endpoint: process.env.TON_NETWORK === 'mainnet' 
            ? 'https://toncenter.com/api/v2/jsonRPC'
            : 'https://testnet.toncenter.com/api/v2/jsonRPC',
        apiKey: process.env.TONCENTER_API_KEY || ''
    });
    
    const mnemonic = process.env.WALLET_MNEMONIC?.split(' ');
    if (!mnemonic || mnemonic.length !== 24) {
        console.error('❌ Set WALLET_MNEMONIC (24 words) in .env file');
        process.exit(1);
    }
    
    const keyPair = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain: 0
    });
    
    console.log(`📫 Wallet address: ${wallet.address.toString()}`);
    
    // Jetton metadata
    const jettonContent = beginCell()
        .storeUint(0x01, 8)
        .storeDict([
            ['name', JETTON_NAME],
            ['symbol', JETTON_SYMBOL],
            ['decimals', JETTON_DECIMALS.toString()],
            ['description', 'The brightest AI-powered Jetton in the TON universe'],
            ['image', 'https://quasar-ton.netlify.app/assets/logo.png']
        ])
        .endCell();
    
    const walletCode = Cell.fromBoc(fs.readFileSync('build/quasar_QuasarWallet.cell'))[0];
    
    const quasar = client.open(
        QuasarMaster.createFromConfig({
            owner: wallet.address,
            content: jettonContent,
            walletCode: walletCode
        })
    );
    
    console.log(`📄 Contract address: ${quasar.address.toString()}`);
    
    // Deploy
    await quasar.sendDeploy(wallet.sender(keyPair.secretKey), toNano('0.1'));
    console.log('⏳ Waiting for deployment...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Mint initial supply
    console.log(`🔨 Minting ${TOTAL_SUPPLY} QSR...`);
    await quasar.sendMint(wallet.sender(keyPair.secretKey), {
        amount: TOTAL_SUPPLY * (10 ** JETTON_DECIMALS),
        receiver: wallet.address
    });
    
    // Setup AI Oracle (optional)
    if (process.env.AI_ORACLE_ADDRESS) {
        console.log('🤖 Setting up AI Oracle...');
        const oracleAddr = Address.parse(process.env.AI_ORACLE_ADDRESS);
        await quasar.send(wallet.sender(keyPair.secretKey), {
            value: toNano('0.05'),
            body: beginCell()
                .storeUint(0x12345678, 32)  // AISetOracle op
                .storeAddress(oracleAddr)
                .endCell()
        });
    }
    
    console.log('✅ QUASAR deployed with AI capabilities!');
    console.log(`🔗 Explorer: https://${process.env.TON_NETWORK === 'mainnet' ? '' : 'testnet.'}tonscan.org/address/${quasar.address.toString()}`);
    
    // Save deployment info
    const deploymentInfo = {
        name: JETTON_NAME,
        symbol: JETTON_SYMBOL,
        decimals: JETTON_DECIMALS,
        totalSupply: TOTAL_SUPPLY,
        contractAddress: quasar.address.toString(),
        network: process.env.TON_NETWORK || 'testnet',
        aiEnabled: !!process.env.AI_ORACLE_ADDRESS,
        aiOracle: process.env.AI_ORACLE_ADDRESS || null,
        deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('build/deployment.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('📝 Deployment info saved to build/deployment.json');
}

deploy().catch(console.error);
