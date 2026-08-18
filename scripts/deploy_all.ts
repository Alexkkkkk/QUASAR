import { toNano, beginCell, Address, Cell } from '@ton/core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════
// QUASAR Unified Deployment Script
// Deploys QuasarMaster → QuasarDeFi sequentially
// Saves all addresses to build/deployment.json
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    name: 'QUASAR',
    symbol: 'QSR',
    decimals: 9,
    totalSupply: 1_000_000_000,
};

async function deploy() {
    console.log('🌟 QUASAR Unified Deployment');
    console.log('═══════════════════════════════════════');
    
    // ─── Setup Client ───
    const isMainnet = process.env.TON_NETWORK === 'mainnet';
    const client = new TonClient({
        endpoint: isMainnet
            ? 'https://toncenter.com/api/v2/jsonRPC'
            : 'https://testnet.toncenter.com/api/v2/jsonRPC',
        apiKey: process.env.TONCENTER_API_KEY || ''
    });
    
    // ─── Setup Wallet ───
    const mnemonic = process.env.WALLET_MNEMONIC?.split(' ');
    if (!mnemonic || mnemonic.length !== 24) {
        console.error('❌ Set WALLET_MNEMONIC (24 words) in .env');
        process.exit(1);
    }
    
    const keyPair = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain: 0
    });
    
    console.log(`📫 Deployer: ${wallet.address.toString()}`);
    
    // ─── Load Build Artifacts ───
    const buildDir = path.join(__dirname, '..', 'build');
    const walletCodePath = path.join(buildDir, 'quasar_QuasarWallet.cell');
    
    if (!fs.existsSync(walletCodePath)) {
        console.error('❌ Build artifacts missing. Run: npm run build');
        process.exit(1);
    }
    
    const walletCode = Cell.fromBoc(fs.readFileSync(walletCodePath))[0];
    
    // ─── Jetton Metadata (TEP-64) ───
    const jettonContent = beginCell()
        .storeUint(0x01, 8)
        .storeDict([
            ['name', CONFIG.name],
            ['symbol', CONFIG.symbol],
            ['decimals', CONFIG.decimals.toString()],
            ['description', 'The brightest AI-powered Jetton with DeFi integration'],
            ['image', 'https://quasar-ton.netlify.app/assets/logo.png']
        ])
        .endCell();
    
    // ═══════════════════════════════════════════════════════
    // STEP 1: Deploy QuasarMaster
    // ═══════════════════════════════════════════════════════
    console.log('\n📦 STEP 1: Deploying QuasarMaster...');
    
    const { QuasarMaster } = await import('../build/quasar_QuasarMaster');
    const quasar = client.open(
        QuasarMaster.createFromConfig({
            owner: wallet.address,
            content: jettonContent,
            walletCode: walletCode
        })
    );
    
    console.log(`   Address: ${quasar.address.toString()}`);
    
    await quasar.sendDeploy(wallet.sender(keyPair.secretKey), toNano('0.1'));
    console.log('   ⏳ Waiting for deployment...');
    await new Promise(r => setTimeout(r, 15000));
    
    // Mint initial supply
    console.log(`   🔨 Minting ${CONFIG.totalSupply} QSR...`);
    await quasar.sendMint(wallet.sender(keyPair.secretKey), {
        amount: CONFIG.totalSupply * (10 ** CONFIG.decimals),
        receiver: wallet.address
    });
    await new Promise(r => setTimeout(r, 5000));
    
    // Setup AI Oracle if provided
    if (process.env.AI_ORACLE_ADDRESS) {
        console.log('   🤖 Setting AI Oracle...');
        const oracleAddr = Address.parse(process.env.AI_ORACLE_ADDRESS);
        await quasar.send(wallet.sender(keyPair.secretKey), {
            value: toNano('0.05'),
            body: beginCell()
                .storeUint(0x12345678, 32)
                .storeAddress(oracleAddr)
                .endCell()
        });
    }
    
    console.log('   ✅ QuasarMaster deployed!');
    
    // ═══════════════════════════════════════════════════════
    // STEP 2: Deploy QuasarDeFi
    // ═══════════════════════════════════════════════════════
    console.log('\n📦 STEP 2: Deploying QuasarDeFi...');
    
    const { QuasarDeFi } = await import('../build/QuasarDeFi/tact_QuasarDeFi');
    const defi = client.open(
        await QuasarDeFi.fromInit(wallet.address, quasar.address)
    );
    
    console.log(`   Address: ${defi.address.toString()}`);
    
    await defi.send(
        wallet.sender(keyPair.secretKey),
        { value: toNano('0.5') },
        { $$type: 'Deploy', queryId: 0n }
    );
    console.log('   ⏳ Waiting for deployment...');
    await new Promise(r => setTimeout(r, 15000));
    
    // Link DeFi to Master
    console.log('   🔗 Linking QuasarMaster ↔ QuasarDeFi...');
    await quasar.send(wallet.sender(keyPair.secretKey), {
        value: toNano('0.05'),
        body: beginCell()
            .storeUint(0xabcdef00, 32)  // SetDefiAddress op
            .storeAddress(defi.address)
            .endCell()
    });
    
    console.log('   ✅ QuasarDeFi deployed & linked!');
    
    // ═══════════════════════════════════════════════════════
    // STEP 3: Save Deployment Info
    // ═══════════════════════════════════════════════════════
    const deploymentInfo = {
        name: CONFIG.name,
        symbol: CONFIG.symbol,
        decimals: CONFIG.decimals,
        totalSupply: CONFIG.totalSupply,
        network: isMainnet ? 'mainnet' : 'testnet',
        deployedAt: new Date().toISOString(),
        contracts: {
            master: {
                address: quasar.address.toString(),
                name: 'QuasarMaster'
            },
            defi: {
                address: defi.address.toString(),
                name: 'QuasarDeFi'
            }
        },
        wallet: {
            address: wallet.address.toString(),
            publicKey: keyPair.publicKey.toString('hex')
        },
        ai: {
            enabled: !!process.env.AI_ORACLE_ADDRESS,
            oracle: process.env.AI_ORACLE_ADDRESS || null
        },
        explorer: `https://${isMainnet ? '' : 'testnet.'}tonscan.org/address/${quasar.address.toString()}`
    };
    
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
    fs.writeFileSync(
        path.join(buildDir, 'deployment.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ DEPLOYMENT COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(`Master:  ${quasar.address.toString()}`);
    console.log(`DeFi:    ${defi.address.toString()}`);
    console.log(`Explorer: ${deploymentInfo.explorer}`);
    console.log('\n📝 Saved to build/deployment.json');
}

deploy().catch(err => {
    console.error('❌ Deployment failed:', err);
    process.exit(1);
});
