"""Offline tests of the canonical Tolk build publication boundary."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
# sync_acton imports its sibling ABI codec when launched as a script.
sys.path.insert(0, str(SCRIPTS))
try:
    SPEC = importlib.util.spec_from_file_location("quasar_sync_acton", SCRIPTS / "sync_acton.py")
    assert SPEC is not None and SPEC.loader is not None
    sync = importlib.util.module_from_spec(SPEC)
    SPEC.loader.exec_module(sync)
finally:
    sys.path.remove(str(SCRIPTS))


def project(root: Path) -> Path:
    (root / "tolk" / "contracts").mkdir(parents=True)
    (root / "tolk" / "tests").mkdir()
    (root / "tolk" / "scripts").mkdir()
    (root / "scripts").mkdir()
    (root / "docs" / "abi").mkdir(parents=True)
    (root / "node_modules").mkdir()
    (root / "tolk" / "Acton.toml").write_text('[toolchain]\nacton = "1.2.1"\n')
    (root / "package-lock.json").write_text('{}\n')
    for filename in ("acton_abi.py", "acton_typescript.mjs", "check_acton_wrappers.ts", "sync_acton.py"):
        (root / "scripts" / filename).write_text("fixture\n")
    (root / "tolk" / "contracts" / "Contract.tolk").write_text("fixture contract\n")
    generated = root / "staged"
    generated.mkdir()
    (generated / "contract.boc").write_bytes(b"fixture BoC")
    return generated


def manifest(root: Path, generated: Path) -> dict:
    data = {
        "schemaVersion": sync.SCHEMA, "acton": "1.2.1", "abi": {},
        "sources": sync.source_hashes(root), "artifacts": sync.artifact_hashes(generated),
    }
    (generated / "sync-manifest.json").write_text(json.dumps(data))
    return data


class SyncActonTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.generated = project(self.root)

    def publish(self) -> dict:
        data = manifest(self.root, self.generated)
        sync.publish(self.root, self.generated)
        return data

    def test_published_generation_is_self_consistent_and_check_is_read_only(self) -> None:
        data = self.publish()
        directory = self.root / "tolk" / sync.OUTPUT
        before = {p.name: p.read_bytes() for p in directory.iterdir()}
        with mock.patch.object(sync, "run", side_effect=AssertionError("offline check must not execute tools")):
            self.assertEqual(sync.check(self.root), data)
        self.assertEqual(before, {p.name: p.read_bytes() for p in directory.iterdir()})
        self.assertTrue(directory.is_symlink())

    def test_changed_and_added_tolk_sources_invalidate_generation(self) -> None:
        self.publish()
        for folder in ("contracts", "tests", "scripts"):
            with self.subTest(folder=folder):
                added = self.root / "tolk" / folder / "New.tolk"
                added.write_text("new input\n")
                with self.assertRaisesRegex(ValueError, "sources or ABI snapshots changed"):
                    sync.check(self.root)
                added.unlink()
        source = self.root / "tolk" / "contracts" / "Contract.tolk"
        source.write_text("changed\n")
        with self.assertRaisesRegex(ValueError, "sources or ABI snapshots changed"):
            sync.check(self.root)

    def test_changed_codec_lockfile_or_snapshot_invalidates_generation(self) -> None:
        self.publish()
        for path in (self.root / "package-lock.json", self.root / "scripts" / "acton_abi.py"):
            original = path.read_bytes()
            path.write_bytes(b"changed")
            with self.subTest(path=path.name), self.assertRaisesRegex(ValueError, "sources or ABI snapshots changed"):
                sync.check(self.root)
            path.write_bytes(original)
        (self.root / "docs" / "abi" / "quasar-wallet.json").write_text('{}')
        with self.assertRaisesRegex(ValueError, "sources or ABI snapshots changed"):
            sync.check(self.root)

    def test_missing_modified_and_extra_artifacts_are_rejected(self) -> None:
        self.publish()
        directory = self.root / "tolk" / sync.OUTPUT
        artifact = directory / "contract.boc"
        artifact.write_bytes(b"tampered")
        with self.assertRaisesRegex(ValueError, "artifacts are missing, modified, or stale"):
            sync.check(self.root)
        artifact.unlink()
        with self.assertRaisesRegex(ValueError, "artifacts are missing, modified, or stale"):
            sync.check(self.root)
        artifact.write_bytes(b"fixture BoC")
        (directory / "extra.boc").write_bytes(b"unexpected")
        with self.assertRaisesRegex(ValueError, "artifacts are missing, modified, or stale"):
            sync.check(self.root)

    def test_unknown_manifest_schema_is_rejected(self) -> None:
        self.publish()
        path = self.root / "tolk" / sync.OUTPUT / "sync-manifest.json"
        data = json.loads(path.read_text())
        data["schemaVersion"] = -1
        path.write_text(json.dumps(data))
        with self.assertRaisesRegex(ValueError, "unsupported Tolk synchronization manifest"):
            sync.check(self.root)

    def test_old_generation_remains_when_symlink_commit_fails(self) -> None:
        data = self.publish()
        directory = self.root / "tolk" / sync.OUTPUT
        old = directory.resolve()
        with mock.patch.object(sync.os, "replace", side_effect=OSError("injected commit failure")):
            with self.assertRaisesRegex(OSError, "injected commit failure"):
                sync.publish(self.root, self.generated)
        self.assertEqual(directory.resolve(), old)
        self.assertEqual(sync.check(self.root), data)
        self.assertEqual(list(directory.parent.glob(".synchronized-*")), [])

    def test_legacy_directory_is_restored_when_first_symlink_commit_fails(self) -> None:
        data = manifest(self.root, self.generated)
        directory = self.root / "tolk" / sync.OUTPUT
        directory.mkdir(parents=True)
        for path in self.generated.iterdir():
            (directory / path.name).write_bytes(path.read_bytes())
        with mock.patch.object(sync.os, "replace", side_effect=OSError("injected commit failure")):
            with self.assertRaisesRegex(OSError, "injected commit failure"):
                sync.publish(self.root, self.generated)
        self.assertTrue(directory.is_dir(), "failed publication must not remove the previous directory")
        self.assertFalse(directory.is_symlink())
        self.assertEqual(sync.check(self.root), data)

    def test_copy_failure_never_replaces_published_generation(self) -> None:
        data = self.publish()
        with mock.patch.object(sync.shutil, "copytree", side_effect=OSError("copy failed")):
            with self.assertRaisesRegex(OSError, "copy failed"):
                sync.publish(self.root, self.generated)
        self.assertEqual(sync.check(self.root), data)

    def test_lock_rejects_concurrent_build_and_releases_after_exception(self) -> None:
        build = self.root / "tolk" / "build"
        with sync.sync_lock(build):
            with self.assertRaisesRegex(ValueError, "already running"):
                with sync.sync_lock(build):
                    self.fail("concurrent writer acquired lock")
        with self.assertRaisesRegex(RuntimeError, "abort"):
            with sync.sync_lock(build):
                raise RuntimeError("abort")
        with sync.sync_lock(build):
            pass

    def test_wrong_acton_version_is_rejected_before_build(self) -> None:
        with mock.patch.object(sync, "run", return_value="acton 1.2.0 (old)\n") as run:
            with self.assertRaisesRegex(ValueError, "expected Acton 1.2.1"):
                sync.synchronize(self.root)
        self.assertEqual(run.call_count, 1)
        self.assertFalse((self.root / "tolk" / sync.OUTPUT).exists())

    def test_failed_validation_stages_never_publish(self) -> None:
        data = self.publish()
        summary = {"Contract": {"messages": 1, "getters": 1}}
        for failing_stage in ("fmt", "build", "wrapper", "check", "test", "script", "node"):
            def fake_run(
                args: list[str],
                cwd: Path,
                _stage: str = failing_stage,
                **kwargs: object,
            ) -> str:
                second = args[1] if len(args) > 1 else ""
                if second == "--version":
                    return "acton 1.2.1 (fixture)\n"
                if args[0] == "acton" and second == "build":
                    (cwd / sync.OUTPUT).mkdir(parents=True)
                if second == _stage or args[0] == _stage:
                    raise subprocess.CalledProcessError(1, args)
                return ""
            with (
                self.subTest(stage=failing_stage),
                mock.patch.object(sync, "run", side_effect=fake_run),
                mock.patch.object(sync, "verify", return_value=summary),
                mock.patch.object(sync, "publish") as publish,
            ):
                with self.assertRaises(subprocess.CalledProcessError):
                    sync.synchronize(self.root)
                publish.assert_not_called()
                self.assertEqual(sync.check(self.root), data)


if __name__ == "__main__":
    unittest.main()
