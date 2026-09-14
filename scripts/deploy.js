// Backwards-compatible entry point for the unified TypeScript deployer.
// Use `npm run deploy` for the preferred command.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'deploy_all.ts');
const child = spawn(process.execPath, ['--import', 'tsx', scriptPath], {
    stdio: 'inherit',
    env: process.env
});

child.on('exit', (code, signal) => {
    if (signal) {
        process.kill(process.pid, signal);
    } else {
        process.exit(code ?? 1);
    }
});