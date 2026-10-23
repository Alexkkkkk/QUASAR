#!/usr/bin/env python3
"""Build, verify, and atomically publish QUASAR's Tolk artifacts.

No Tact compiler, reference bytecode, deployment, broadcast, or wallet material
is used.  ``--check`` is read-only and verifies the published generation.
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

from acton_abi import verify

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "tolk"
OUTPUT = "build/synchronized"
SCHEMA = 2


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_hashes(root: Path) -> dict[str, str]:
    paths = [
        root / "tolk" / "Acton.toml",
        root / "package-lock.json",
        root / "scripts" / "acton_abi.py",
        root / "scripts" / "acton_typescript.mjs",
        root / "scripts" / "check_acton_wrappers.ts",
        root / "scripts" / "sync_acton.py",
    ]
    for directory in ("contracts", "tests", "scripts"):
        paths.extend(sorted((root / "tolk" / directory).rglob("*.tolk")))
    paths.extend(sorted((root / "docs" / "abi").glob("quasar-*.json")))
    return {path.relative_to(root).as_posix(): digest(path) for path in sorted(paths)}


def artifact_hashes(directory: Path) -> dict[str, str]:
    return {
        path.relative_to(directory).as_posix(): digest(path)
        for path in sorted(directory.rglob("*"))
        if path.is_file() and path.name != "sync-manifest.json"
    }


def run(args: list[str], cwd: Path, timeout: int = 600, capture: bool = False) -> str:
    print("+ " + " ".join(args), flush=True)
    result = subprocess.run(args, cwd=cwd, check=True, timeout=timeout, text=True, capture_output=capture)
    return result.stdout if capture else ""


@contextmanager
def sync_lock(build: Path):
    build.mkdir(parents=True, exist_ok=True)
    with (build / ".sync.lock").open("a") as handle:
        try:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise ValueError("another Tolk synchronization is already running") from error
        try:
            yield
        finally:
            fcntl.flock(handle, fcntl.LOCK_UN)


def check(root: Path) -> dict:
    directory = (root / "tolk" / OUTPUT).resolve(strict=True)
    manifest = json.loads((directory / "sync-manifest.json").read_text())
    if manifest.get("schemaVersion") != SCHEMA:
        raise ValueError("unsupported Tolk synchronization manifest")
    if manifest.get("sources") != source_hashes(root):
        raise ValueError("Tolk sources or ABI snapshots changed; run `npm run build`")
    if manifest.get("artifacts") != artifact_hashes(directory):
        raise ValueError("Tolk artifacts are missing, modified, or stale; run `npm run build`")
    return manifest


def publish(root: Path, generated: Path) -> None:
    build = root / "tolk" / "build"
    generations = build / "generations"
    generations.mkdir(parents=True, exist_ok=True)
    generation = generations / uuid.uuid4().hex
    shutil.copytree(generated, generation)
    target = build / "synchronized"
    legacy = None
    if target.exists() and not target.is_symlink():
        legacy = generations / ("legacy-" + uuid.uuid4().hex)
        target.rename(legacy)
    link = build / (".synchronized-" + uuid.uuid4().hex)
    committed = False
    try:
        link.symlink_to(generation.relative_to(build), target_is_directory=True)
        os.replace(link, target)
        committed = True
        fd = os.open(build, os.O_RDONLY | os.O_DIRECTORY)
        try:
            os.fsync(fd)
        finally:
            os.close(fd)
    except OSError:
        # The first publication may replace a pre-existing real directory.
        # Restore it if creating/committing the pointer fails. Once committed,
        # a later fsync error must not overwrite the new valid generation.
        if legacy is not None and not committed:
            legacy.rename(target)
        raise
    finally:
        link.unlink(missing_ok=True)


def synchronize(root: Path, acton: str = "acton") -> dict:
    project = root / "tolk"
    config = tomllib.loads((project / "Acton.toml").read_text())
    pin = config["toolchain"]["acton"]
    version = run([acton, "--version"], project, capture=True)
    if not re.match(rf"acton {re.escape(pin)}(?:\s|$)", version):
        raise ValueError(f"expected Acton {pin}; got {version.strip()}")
    before = source_hashes(root)
    with tempfile.TemporaryDirectory(prefix="quasar-tolk-") as temporary:
        stage = Path(temporary) / "tolk"
        shutil.copytree(
            project,
            stage,
            ignore=shutil.ignore_patterns("build", ".acton", "node_modules", "wallets.toml", ".env*"),
        )
        (stage / "node_modules").symlink_to(root / "node_modules", target_is_directory=True)
        if (project / ".acton").is_dir():
            shutil.copytree(project / ".acton", stage / ".acton")
        run([acton, "fmt", "--check"], stage)
        run([acton, "build"], stage)
        generated = stage / OUTPUT
        summary = verify(root, generated / "abi")
        run([acton, "wrapper", "--all", "--output-dir", OUTPUT + "/wrappers"], stage)
        wrappers_ts = generated / "wrappers-ts"
        wrappers_ts.mkdir()
        for contract in summary:
            run(
                [
                    "node", "--import", "tsx", str(root / "scripts" / "acton_typescript.mjs"),
                    str(generated / "abi" / f"{contract}.json"),
                    str(generated / "boc" / f"{contract}.boc"),
                    str(wrappers_ts / f"{contract}.gen.ts"),
                ],
                stage,
            )
        run(["node", "--import", "tsx", str(root / "scripts" / "check_acton_wrappers.ts"), str(generated)], root)
        run([acton, "check"], stage)
        run([acton, "test"], stage)
        for script in ("local-smoke.tolk", "storage-fee.tolk"):
            arguments = ["3600"] if script == "storage-fee.tolk" else []
            run([acton, "script", "scripts/" + script, *arguments], stage)
        if source_hashes(root) != before:
            raise ValueError("sources changed during Tolk synchronization; retry after edits finish")
        manifest = {
            "schemaVersion": SCHEMA,
            "acton": pin,
            "sources": before,
            "abi": summary,
            "artifacts": artifact_hashes(generated),
        }
        (generated / "sync-manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
        publish(root, generated)
    return check(root)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="offline, read-only artifact integrity check")
    parser.add_argument("--acton", default="acton", help="path to the pinned Acton executable")
    args = parser.parse_args()
    try:
        if args.check:
            manifest = check(ROOT)
        else:
            with sync_lock(ROOT / "tolk" / "build"):
                manifest = synchronize(ROOT, args.acton)
        print(json.dumps({"acton": manifest["acton"], "contracts": manifest["abi"], "status": "synchronized"}, indent=2))
        return 0
    except (OSError, ValueError, KeyError, IndexError, subprocess.SubprocessError) as error:
        print(f"Tolk synchronization failed: {error}")
        return 1
    except KeyboardInterrupt:
        print("Tolk synchronization cancelled; use --check to verify the published generation")
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
