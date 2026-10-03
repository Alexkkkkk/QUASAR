import 'dotenv/config';
import { toNano, beginCell, Address, Cell } from '@ton/core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
    buildOffchainContent,
    buildOnchainContent,
    buildSemiChainContent,
    parseContent,
    assertRequiredFields,
    assertDecimalsConsistent
} from './lib/tep64.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const network = process.env.TON_NETWORK?.trim().toLowerCase();
    if (network !== 'mainnet' && network !== 'testnet') {
        throw new Error('TON_NETWORK must be explicitly set to "mainnet" or "testnet"');
    }
    const isMainnet = network === 'mainnet';

    console.log(`🌟 QUASAR Unified Deployment (${network})`);
    console.log('═══════════════════════════════════════');
    
    // ─── Setup Client ───
    const client = new TonClient({
        endpoint: isMainnet
            ? 'https://toncenter.com/api/v2/jsonRPC'
            : 'https://testnet.toncenter.com/api/v2/jsonRPC',
        apiKey: process.env.TONCENTER_API_KEY || ''
    });
    
    // ─── Setup Wallet ───
    const mnemonic = process.env.WALLET_MNEMONIC?.trim().split(/\s+/);
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
    const walletCodePath = path.join(buildDir, 'quasar_QuasarWallet.code.boc');
    
    if (!fs.existsSync(walletCodePath)) {
        console.error('❌ Build artifacts missing. Run: npm run build');
        process.exit(1);
    }
    
    const walletCode = Cell.fromBoc(fs.readFileSync(walletCodePath))[0];
    
    // ─── Jetton Metadata (TEP-64) ───
    // F-01 remediation: the metadata URL is configurable via JETTON_METADATA_URL
    // (default: raw.githubusercontent.com — anonymous access, git-versioned) and
    // is preflighted below. A dead URL must never be baked into the content cell:
    // the content is part of the init data, and after issue #58 it can only be
    // replaced through the 48h ProposeContent -> "Apply Content" timelock.
    //
    // JETTON_CONTENT_LAYOUT selects the TEP-64 layout:
    //   offchain  (default)  0x01 ++ URI
    //   onchain              0x00 ++ sha256-keyed dictionary
    //   semichain            0x00 ++ dictionary that also carries the `uri` attribute
    // The metadata URL must be served with a JSON content type. GitHub's
    // raw.githubusercontent.com serves every file as `text/plain`, so a TEP-64
    // off-chain URI pointing there is rejected by wallets/indexers that check
    // the MIME type (audit 2026-10-02, issue #77). GitHub Pages serves
    // website/metadata.json as application/json.
    const metadataUrl = process.env.JETTON_METADATA_URL?.trim()
        || 'https://alexkkkkk.github.io/QUASAR/metadata.json';
    const contentMode = (process.env.JETTON_CONTENT_LAYOUT?.trim() || 'offchain').toLowerCase();
    if (!['offchain', 'onchain', 'semichain'].includes(contentMode)) {
        throw new Error(`JETTON_CONTENT_LAYOUT must be offchain, onchain or semichain (got "${contentMode}")`);
    }

    console.log(`\n🔎 Preflight: validating TEP-64 metadata at ${metadataUrl}`);
    const metaRes = await fetch(metadataUrl);
    if (!metaRes.ok) {
        throw new Error(`Jetton metadata URL returns HTTP ${metaRes.status} — fix hosting before deploying (F-01)`);
    }
    // TEP-64 off-chain content points at a JSON document; a host that serves it
    // as text/plain (raw.githubusercontent.com) breaks wallets and indexers.
    const metaType = (metaRes.headers.get('content-type') || '').toLowerCase();
    if (!metaType.includes('application/json')) {
        throw new Error(
            `Jetton metadata must be served as application/json, got "${metaType}" — `
            + 'host it on GitHub Pages or another JSON-capable origin (issue #77)'
        );
    }
    const meta = (await metaRes.json()) as Record<string, unknown>;
    const attributes: Record<string, string> = {};
    for (const field of ['name', 'symbol', 'decimals', 'image'] as const) {
        const rawValue = meta[field];
        const value = typeof rawValue === 'number' ? String(rawValue) : rawValue;
        if (typeof value !== 'string' || value.length === 0) {
            throw new Error(`Jetton metadata is missing the required TEP-64 field "${field}" (F-01)`);
        }
        attributes[field] = value;
    }
    if (typeof meta.description === 'string' && meta.description.length > 0) {
        attributes.description = meta.description;
    }
    console.log('   ✅ Metadata resolves and contains all required TEP-64 fields');

    // Validate the attribute set before it is baked into the init data, and make
    // sure `decimals` agrees with the 10**CONFIG.decimals multiplier Mint uses.
    assertRequiredFields(attributes);
    assertDecimalsConsistent(attributes, CONFIG.decimals);

    const jettonContent = contentMode === 'onchain'
        ? buildOnchainContent(attributes)
        : contentMode === 'semichain'
            ? buildSemiChainContent(attributes, metadataUrl)
            : buildOffchainContent(metadataUrl);

    // Round-trip the exact cell that goes into the init data: a layout mistake
    // is permanent, so the deploy must prove it can read its own content back.
    const preflight = parseContent(jettonContent);
    const expectedLayout = contentMode === 'offchain' ? 'offchain' : 'onchain';
    if (preflight.layout !== expectedLayout) {
        throw new Error(`TEP-64 round-trip failed: built "${contentMode}" but parsed "${preflight.layout}"`);
    }
    if (preflight.layout === 'offchain') {
        if (preflight.uri !== metadataUrl) {
            throw new Error(`TEP-64 off-chain round-trip mismatch: "${preflight.uri}" != "${metadataUrl}"`);
        }
    } else {
        const readBack = preflight.fields ?? {};
        assertRequiredFields(readBack);
        assertDecimalsConsistent(readBack, CONFIG.decimals);
        if (contentMode === 'semichain' && readBack.uri !== metadataUrl) {
            throw new Error(`TEP-64 semi-chain content must carry the "uri" attribute (got "${readBack.uri}")`);
        }
    }
    console.log(`   ✅ TEP-64 content (${contentMode}) round-trips through the exact init-data cell`);

    const sender = wallet.sender(client.provider(wallet.address), keyPair.secretKey);
    
    // ═══════════════════════════════════════════════════════
    // STEP 1: Deploy QuasarMaster
    // ═══════════════════════════════════════════════════════
    console.log('\n📦 STEP 1: Deploying QuasarMaster...');
    
    const { QuasarMaster } = await import('../build/quasar_QuasarMaster.js');
    const quasar = client.open(
        await QuasarMaster.fromInit(wallet.address, jettonContent, walletCode)
    );
    
    console.log(`   Address: ${quasar.address.toString()}`);
    
    await quasar.send(
        sender,
        { value: toNano('0.1') },
        { $$type: 'Deploy', queryId: 0n }
    );
    console.log('   ⏳ Waiting for deployment...');
    await new Promise(r => setTimeout(r, 15000));

    // The deployed master must report exactly the cell we preflighted above.
    const onchainData = await quasar.getGetJettonData();
    if (onchainData.jettonContent.hash().toString('hex') !== jettonContent.hash().toString('hex')) {
        throw new Error('the deployed master reported a different jetton content cell');
    }
    console.log(`   ✅ On-chain content hash matches the preflighted cell (${contentMode})`);
    
    // Mint initial supply
    console.log(`   🔨 Minting ${CONFIG.totalSupply} QSR...`);
    await quasar.send(
        sender,
        { value: toNano('0.05') },
        {
            $$type: 'Mint',
            amount: BigInt(CONFIG.totalSupply) * (10n ** BigInt(CONFIG.decimals)),
            receiver: wallet.address
        }
    );
    await new Promise(r => setTimeout(r, 5000));

    // The deployment allocation is the full hard cap. Lock further issuance
    // immediately so a funded deployer wallet cannot mint again by mistake.
    console.log('   🔒 Stopping minting after initial allocation...');
    await quasar.send(
        sender,
        { value: toNano('0.05') },
        'Stop Minting'
    );
    await new Promise(r => setTimeout(r, 5000));
    
    // Setup AI Oracle if provided
    if (process.env.AI_ORACLE_ADDRESS) {
        console.log('   🤖 Setting AI Oracle...');
        const oracleAddr = Address.parse(process.env.AI_ORACLE_ADDRESS);
        await quasar.send(
            sender,
            { value: toNano('0.05') },
            { $$type: 'AISetOracle', oracleAddress: oracleAddr }
        );
    }
    
    console.log('   ✅ QuasarMaster deployed!');
    
    // ═══════════════════════════════════════════════════════
    // STEP 2: Deploy QuasarDeFi
    // ═══════════════════════════════════════════════════════
    console.log('\n📦 STEP 2: Deploying QuasarDeFi...');
    
    const { QuasarDeFi } = await import('../build/quasar_defi_QuasarDeFi.js');
    const defi = client.open(
        await QuasarDeFi.fromInit(wallet.address, quasar.address)
    );
    
    console.log(`   Address: ${defi.address.toString()}`);
    
    await defi.send(
        sender,
        { value: toNano('0.5') },
        { $$type: 'Deploy', queryId: 0n }
    );
    console.log('   ⏳ Waiting for deployment...');
    await new Promise(r => setTimeout(r, 15000));
    
    // Link DeFi to Master
    console.log('   🔗 Linking QuasarMaster ↔ QuasarDeFi...');
    await quasar.send(
        sender,
        { value: toNano('0.05') },
        { $$type: 'SetDefiAddress', defiAddress: defi.address }
    );
    
    console.log('   ✅ QuasarDeFi deployed & linked!');

    // ═══════════════════════════════════════════════════════
    // STEP 2.5: Deploy the admin timelock and hand it control (M-02)
    // ═══════════════════════════════════════════════════════
    // The timelock was compiled but never deployed, so the deployer EOA kept
    // unilateral control. Deploy it, then hand it ownership of both contracts
    // through the existing two-step, 48h-delayed transfer. The admin is an
    // external multisig (TIMELOCK_ADMIN); the timelock only supplies the
    // on-chain delay, target allow-list and cancellation path.
    console.log('\n📦 STEP 2.5: Deploying QuasarAdminTimelock...');
    const adminAddr = process.env.TIMELOCK_ADMIN?.trim()
        ? Address.parse(process.env.TIMELOCK_ADMIN.trim())
        : wallet.address;
    const minDelay = BigInt(process.env.TIMELOCK_MIN_DELAY?.trim() || '86400');
    if (minDelay < 86400n) {
        throw new Error('TIMELOCK_MIN_DELAY must be at least 86400 seconds (M-02)');
    }
    const { QuasarAdminTimelock } = await import('../build/quasar_admin_QuasarAdminTimelock.js');
    const timelock = client.open(
        await QuasarAdminTimelock.fromInit(adminAddr, quasar.address, defi.address, minDelay)
    );
    console.log(`   Address: ${timelock.address.toString()}`);
    await timelock.send(sender, { value: toNano('0.2') }, { $$type: 'Deploy', queryId: 0n });
    await new Promise(r => setTimeout(r, 15000));
    console.log(`   Admin: ${adminAddr.toString()} | minDelay: ${minDelay}s`);

    console.log('   🔐 Proposing timelock ownership of QuasarMaster and QuasarDeFi...');
    await quasar.send(sender, { value: toNano('0.05') }, { $$type: 'ProposeOwner', newOwner: timelock.address });
    await defi.send(sender, { value: toNano('0.05') }, { $$type: 'ProposePoolOwner', newOwner: timelock.address });
    await new Promise(r => setTimeout(r, 3000));
    console.log('   ✅ Timelock deployed and proposed as owner (acceptance queues through the timelock).');
    
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
            },
            timelock: {
                address: timelock.address.toString(),
                name: 'QuasarAdminTimelock',
                admin: adminAddr.toString(),
                minDelay: minDelay.toString(),
                ownershipProposed: true
            }
        },
        ai: {
            enabled: !!process.env.AI_ORACLE_ADDRESS,
            oracle: process.env.AI_ORACLE_ADDRESS || null
        },
        explorer: `https://${isMainnet ? '' : 'testnet.'}tonscan.org/address/${quasar.address.toString()}`
    };
    
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
    const deploymentJson = JSON.stringify(deploymentInfo, null, 2);
    fs.writeFileSync(path.join(buildDir, 'deployment.json'), deploymentJson);
    const websiteDir = path.join(__dirname, '..', 'website');
    fs.mkdirSync(websiteDir, { recursive: true });
    fs.writeFileSync(path.join(websiteDir, 'deployment.json'), deploymentJson);
    
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
