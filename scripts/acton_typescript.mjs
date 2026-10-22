// Use the official pinned generator API, passing large ABIs through files,
// not through execve argv (Linux limits an individual argument to ~128 KiB).
import { readFileSync, writeFileSync, realpathSync, existsSync } from 'node:fs';
import { dirname, join, delimiter } from 'node:path';
import { createRequire } from 'node:module';

const [abiPath, bocPath, outputPath] = process.argv.slice(2);
if (!abiPath || !bocPath || !outputPath || process.argv.length !== 5) {
  throw new Error('Usage: acton_typescript.mjs ABI.json CODE.boc OUTPUT.gen.ts');
}
const executable = (process.env.PATH ?? '').split(delimiter)
  .map(path => join(path, 'tolk-abi-to-typescript')).find(existsSync);
if (!executable) throw new Error('Run with npm exec --package=@ton/tolk-abi-to-typescript@0.5.0 -- node ...');
const require = createRequire(realpathSync(executable));
const packageRoot = dirname(dirname(realpathSync(executable)));
const pkg = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
if (pkg.name !== '@ton/tolk-abi-to-typescript' || pkg.version !== '0.5.0') {
  throw new Error('Expected @ton/tolk-abi-to-typescript@0.5.0');
}
const { runCli } = require(realpathSync(executable));
const abi = JSON.parse(readFileSync(abiPath, 'utf8'));
abi.code_boc64 = readFileSync(bocPath).toString('base64');
runCli([JSON.stringify(abi), '--out', outputPath]);
const output = readFileSync(outputPath, 'utf8');
if (!output.endsWith('\n')) writeFileSync(outputPath, output + '\n');
