import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const legacyArguments = new Set(["--runInBand", "--watchAll=false"]);

export function normalizeVitestArguments(arguments_) {
    return arguments_.filter((argument) => !legacyArguments.has(argument));
}

function isMainModule() {
    return (
        process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
    );
}

if (isMainModule()) {
    const scriptDirectory = dirname(fileURLToPath(import.meta.url));
    const vitestEntrypoint = resolve(scriptDirectory, "../node_modules/vitest/vitest.mjs");
    const result = spawnSync(
        process.execPath,
        [vitestEntrypoint, "run", ...normalizeVitestArguments(process.argv.slice(2))],
        {
            stdio: "inherit",
        },
    );

    if (result.error) {
        throw result.error;
    }

    process.exitCode = result.status ?? 1;
}
