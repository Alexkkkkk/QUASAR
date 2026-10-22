import { describe, expect, test } from "vitest";
import { normalizeVitestArguments } from "./vitest-compat.mjs";

describe("normalizeVitestArguments", () => {
    test("removes only the legacy Jest flags passed by CI", () => {
        expect(normalizeVitestArguments(["--watchAll=false", "--runInBand"])).toEqual([]);
    });

    test("forwards all supported Vitest arguments and test filters unchanged", () => {
        expect(
            normalizeVitestArguments([
                "--watchAll=false",
                "--runInBand",
                "--reporter=verbose",
                "--maxWorkers=2",
                "src/components/header/Header.test.tsx",
            ]),
        ).toEqual([
            "--reporter=verbose",
            "--maxWorkers=2",
            "src/components/header/Header.test.tsx",
        ]);
    });

    test("does not silently discard other values", () => {
        expect(
            normalizeVitestArguments(["--watchAll", "--watchAll=true", "--runInBand=false"]),
        ).toEqual(["--watchAll", "--watchAll=true", "--runInBand=false"]);
    });
});
