#!/usr/bin/env python3
"""Build, verify and atomically synchronize QUASAR's local Acton artifacts.

No deployment or broadcast commands are accepted. --check is entirely offline
and checks source drift and every artifact checksum without rebuilding anything.
"""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import tomllib
import uuid

from acton_abi import CONTRACTS, verify

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = "build/synchronized"
SCHEMA = 1


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_hashes(root: Path) -> dict[str, str]:
    paths = [root / "tolk/Acton.toml", root / "scripts/acton_abi.py",
             root / "scripts/acton_typescript.mjs", root / "scripts/sync_acton.py",
             root / "scripts/check_acton_wrappers.ts", root / "tact.config.json",
             root / "package-lock.json"]
    paths.extend(sorted((root / "contracts").rglob("*.tact")))
    for directory in ("contracts", "tests", "scripts"):
        paths.extend(sorted((root / "tolk" / directory).rglob("*.tolk")))
    paths.extend(root / "docs/abi" / filename for filename in CONTRACTS.values())
    return {path.relative_to(root).as_posix(): digest(path) for path in sorted(paths)}


def artifact_hashes(directory: Path) -> dict[str, str]:
    return {path.relative_to(directory).as_posix(): digest(path)
            for path in sorted(directory.rglob("*"))
            if path.is_file() and path.name != "sync-manifest.json"}


def run(args: list[str], cwd: Path, timeout: int = 600, capture: bool = False) -> str:
    print("+ " + " ".join(args), flush=True)
    result = subprocess.run(args, cwd=cwd, check=True, timeout=timeout,
                            text=True, capture_output=capture)
    return result.stdout if capture else ""


@contextmanager
def sync_lock(build: Path):
    build.mkdir(parents=True, exist_ok=True)
    # Never unlink a flock file: a second process must lock the same inode.
    with (build / ".sync.lock").open("a") as handle:
        try:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise ValueError("Another Acton synchronization is running") from error
        try:
            yield
        finally:
            fcntl.flock(handle, fcntl.LOCK_UN)


def check(root: Path) -> dict:
    # Resolve once so a concurrent pointer swap cannot mix two generations.
    directory = (root / "tolk" / OUTPUT).resolve(strict=True)
    manifest = json.loads((directory / "sync-manifest.json").read_text())
    if manifest.get("schemaVersion") != SCHEMA:
        raise ValueError("Unsupported synchronization manifest")
    if manifest.get("sources") != source_hashes(root):
        raise ValueError("Acton sources or reference ABI changed; run scripts/sync_acton.py")
    if manifest.get("artifacts") != artifact_hashes(directory):
        raise ValueError("Acton artifacts are missing, modified or stale; synchronize again")
    return manifest


def publish(root: Path, generated: Path) -> None:
    build = root / "tolk/build"
    generations = build / "generations"
    generations.mkdir(parents=True, exist_ok=True)
    generation = generations / uuid.uuid4().hex
    shutil.copytree(generated, generation)
    target = build / "synchronized"
    # An existing directory from direct `acton build` needs a one-time migration.
    # It is never removed; preserve it as an older generation for active readers.
    if target.exists() and not target.is_symlink():
        target.rename(generations / ("legacy-" + uuid.uuid4().hex))
    link = build / (".synchronized-" + uuid.uuid4().hex)
    try:
        link.symlink_to(generation.relative_to(build), target_is_directory=True)
        os.replace(link, target)
        fd = os.open(build, os.O_RDONLY | os.O_DIRECTORY)
        try:
            os.fsync(fd)
        finally:
            os.close(fd)
    finally:
        link.unlink(missing_ok=True)


def synchronize(root: Path, acton: str = "acton") -> dict:
    project = root / "tolk"
    config = tomllib.loads((project / "Acton.toml").read_text())
    pin = config["toolchain"]["acton"]
    version = run([acton, "--version"], project, capture=True)
    if not re.match(rf"acton {re.escape(pin)}(?:\s|$)", version):
        raise ValueError(f"Expected Acton {pin}; got {version.strip()}")
    before = source_hashes(root)
    run(["npm", "run", "build"], root)
    run(["npm", "run", "abi:verify"], root)
    # The entire build/test runs in isolation. A failed generation never touches
    # the previously published ABI, code, wrappers or synchronization manifest.
    with tempfile.TemporaryDirectory(prefix="quasar-acton-") as temporary:
        stage = Path(temporary) / "tolk"
        shutil.copytree(project, stage, ignore=shutil.ignore_patterns("build", ".acton", "node_modules", "wallets.toml", ".env*"))
        (stage / "node_modules").symlink_to(root / "node_modules", target_is_directory=True)
        if (project / ".acton").is_dir():
            shutil.copytree(project / ".acton", stage / ".acton")
        # Keep the synchronized generation subject to the same four Acton
        # validation gates used in CI: format, build, lint, and test.
        run([acton, "fmt", "--check"], stage)
        run([acton, "build"], stage)
        generated = stage / OUTPUT
        summary = verify(root, generated / "abi")
        run([acton, "wrapper", "--all", "--output-dir", OUTPUT + "/wrappers"], stage)
        (generated / "wrappers-ts").mkdir()
        for contract in CONTRACTS:
            run(["npm", "exec", "--yes", "--package=@ton/tolk-abi-to-typescript@0.5.0", "--", "node",
                 str(root / "scripts/acton_typescript.mjs"),
                 str(generated / "abi" / f"{contract}.json"),
                 str(generated / "boc" / f"{contract}.boc"),
                 str(generated / "wrappers-ts" / f"{contract}.gen.ts")], stage)
        run(["node", "--import", "tsx", str(root / "scripts/check_acton_wrappers.ts"), str(generated)], root)
        run([acton, "check"], stage)
        run([acton, "test"], stage)
        for script in ("local-smoke.tolk", "storage-fee.tolk"):
            arguments = ["3600"] if script == "storage-fee.tolk" else []
            run([acton, "script", "scripts/" + script, *arguments], stage)
        if source_hashes(root) != before:
            raise ValueError("Sources changed during synchronization; retry after edits finish")
        manifest = {"schemaVersion": SCHEMA, "acton": pin, "sources": before,
                    "abi": summary, "artifacts": artifact_hashes(generated)}
        (generated / "sync-manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
        publish(root, generated)
    return check(root)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Offline, read-only drift/integrity check")
    parser.add_argument("--acton", default="acton", help="Path to the pinned Acton executable")
    args = parser.parse_args()
    try:
        if args.check:
            manifest = check(ROOT)
        else:
            with sync_lock(ROOT / "tolk/build"):
                manifest = synchronize(ROOT, args.acton)
        print(json.dumps({"acton": manifest["acton"], "contracts": manifest["abi"], "status": "synchronized"}, indent=2))
        return 0
    except (OSError, ValueError, KeyError, StopIteration, IndexError, subprocess.SubprocessError) as error:
        print(f"Acton synchronization failed: {error}")
        return 1
    except KeyboardInterrupt:
        print("Acton synchronization cancelled; use --check to verify the published generation")
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
