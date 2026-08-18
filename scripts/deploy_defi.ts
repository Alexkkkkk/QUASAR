import { toNano, Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════
// QUASAR DeFi Standalone Deployment
// Links to existing QuasarMaster
// ═══════════════════════════════════════════════════════════════

export async function run(provider: NetworkProvider) {
    const owner = provider.sender().address!!;
    
    // Load QuasarMaster address
    const deploymentPath = path.join(__dirname, '..', 'build', 'deployment.json');
    let qsrMaster: Address;
    
    if (fs.existsSync(deploymentPath)) {
        const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
        qsrMaster = Address.parse(deployment.contracts.master.address);
        console.log(`🔗 Linked to QuasarMaster: ${qsrMaster.toString()}`);
    } else {
        console.error('❌ Run deploy_all.ts first or create build/deployment.json');
        process.exit(1);
    }
    
    const { QuasarDeFi } = await import('../build/QuasarDeFi/tact_QuasarDeFi');
    const defi = provider.open(await QuasarDeFi.fromInit(owner, qsrMaster));
    
    console.log(`📄 QuasarDeFi: ${defi.address.toString()}`);
    
    await defi.send(
        provider.sender(),
        { value: toNano('0.5') },
        { $$type: 'Deploy', queryId: 0n }
    );
    
    await provider.waitForDeploy(defi.address);
    console.log('✅ QuasarDeFi deployed!');
    
    // Update deployment.json
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
    deployment.contracts.defi = {
        address: defi.address.toString(),
        name: 'QuasarDeFi',
        deployedAt: new Date().toISOString()
    };
    fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
}
