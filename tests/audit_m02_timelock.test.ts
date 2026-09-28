/**
 * Independent-audit remediation (issue #44): M-02.
 *
 *   M-02 🟠 QuasarAdminTimelock compiled but was never deployed: the deployer
 *           EOA kept unilateral control of Master and DeFi.
 *
 * Source-level assertions on the deployment pipeline (the on-chain hand-over is
 * exercised by the deployable testnet smoke run, which now requires the
 * timelock address and validates its wiring).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const deployAll = readFileSync(join(__dirname, '..', 'scripts', 'deploy_all.ts'), 'utf8');
const smoke = readFileSync(join(__dirname, '..', 'scripts', 'testnet_smoke.ts'), 'utf8');
const adminSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar_admin.tact'), 'utf8');

test('M-02 source: the deployment deploys the timelock and hands over control', () => {
    assert.ok(deployAll.includes("import('../build/quasar_admin_QuasarAdminTimelock.js')"), 'deploy_all must load the compiled timelock');
    assert.ok(deployAll.includes('QuasarAdminTimelock.fromInit('), 'deploy_all must deploy the timelock');
    assert.ok(/newOwner:\s*timelock\.address/.test(deployAll), 'Master ownership must be proposed to the timelock');
    assert.ok(deployAll.includes("$$type: 'ProposePoolOwner'"), 'DeFi ownership must be proposed to the timelock');
    assert.ok(deployAll.includes('TIMELOCK_MIN_DELAY'), 'the minimum delay must be configurable');
    assert.ok(/minDelay\s*<\s*86400n/.test(deployAll), 'the deployment must refuse a sub-24h delay');
    assert.ok(deployAll.includes('timelock: {'), 'deployment.json must record the timelock');
});

test('M-02 source: the testnet smoke run asserts the timelock wiring', () => {
    assert.ok(smoke.includes('QuasarAdminTimelock'), 'the smoke script must open the timelock');
    assert.ok(smoke.includes('timelock.getGetMaster()'), 'the smoke script must verify the managed master');
    assert.ok(smoke.includes('timelock.getGetDefi()'), 'the smoke script must verify the managed defi');
    assert.ok(smoke.includes('timelock.getGetMinDelay()'), 'the smoke script must verify the delay');
});

test('M-02 source: the timelock exposes the getters the wiring depends on', () => {
    assert.ok(adminSrc.includes('get fun get_master(): Address'), 'the timelock must expose get_master');
    assert.ok(adminSrc.includes('get fun get_defi(): Address'), 'the timelock must expose get_defi');
    assert.ok(adminSrc.includes('get fun get_admin(): Address'), 'the timelock must expose get_admin');
});
