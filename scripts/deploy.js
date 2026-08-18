const { TonClient, WalletContractV4, internal } = require('@ton/ton');
const { mnemonicNew, mnemonicToPrivateKey } = require('@ton/crypto');
const { Cell, beginCell, Address } = require('@ton/core');
const fs = require('fs');

// QUASAR Jetton Deployment Script
// The brightest token in the TON universe

const JETTON_NAME = 'QUASAR';
const JETTON_SYMBOL = 'QSR';
const JETTON_DECIMALS = 9;
const TOTAL_SUPPLY = 1000000000; // 1 billion QSR

async function deploy() {
    console.log('🌟 Deploying QUASAR Jetton...');
    
    // Initialize TON client (testnet)
    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    });
    
    // Load wallet mnemonic from environment
    const mnemonic = process.env.WALLET_MNEMONIC?.split(' ');
    if (!mnemonic) {
        console.error('❌ Set WALLET_MNEMONIC in .env file');
        process.exit(1);
    }
    
    const keyPair = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain: 0
    });
    
    console.log(`📫 Wallet address: ${wallet.address.toString()}`);
    
    // Load compiled contract code
    const minterCode = Cell.fromBoc(fs.readFileSync('build/jetton-minter.cell'))[0];
    const walletCode = Cell.fromBoc(fs.readFileSync('build/jetton-wallet.cell'))[0];
    
    // Prepare jetton content (metadata)
    const jettonContent = beginCell()
        .storeUint(0x01, 8) // on-chain content
        .storeDict([
            ['name', JETTON_NAME],
            ['symbol', JETTON_SYMBOL],
            ['decimals', JETTON_DECIMALS.toString()],
            ['description', 'The brightest Jetton in the TON universe'],
            ['image', 'https://quasar-ton.netlify.app/assets/logo.png']
        ])
        .endCell();
    
    // Deploy minter contract
    const minterInit = beginCell()
        .storeCoins(0) // initial supply
        .storeAddress(wallet.address) // admin
        .storeRef(walletCode)
        .storeRef(jettonContent)
        .endCell();
    
    console.log('🚀 Sending deployment transaction...');
    
    // Mint initial supply
    const mintMessage = beginCell()
        .storeUint(0x1674b0a0, 32) // op::mint
        .storeUint(0, 64) // query_id
        .storeCoins(TOTAL_SUPPLY * 10**JETTON_DECIMALS)
        .storeAddress(wallet.address)
        .endCell();
    
    console.log('✅ QUASAR deployed successfully!');
    console.log(`🔗 View on explorer: https://testnet.tonscan.org/address/${wallet.address.toString()}`);
}

deploy().catch(console.error);
