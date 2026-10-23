"""Offline regression tests for the Acton synchronization gate."""
import copy
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import acton_abi
import sync_acton


def fixture():
    reference = {"contract": "Test", "messages": [{"name": "Transfer", "opcode": "0x00000001", "fields": [{"name": "value", "type": {"kind": "simple", "type": "uint", "format": "coins", "optional": False}}]}], "getters": [{"name": "balance", "methodId": 123, "arguments": [], "returns": {"kind": "simple", "type": "int", "format": 257, "optional": False}}], "textReceivers": []}
    abi = {"abi_schema_version": "1.0", "compiler_name": "tolk", "contract_name": "Test", "unique_types": [{"kind": "coins"}, {"kind": "StructRef", "struct_name": "Transfer"}, {"kind": "int"}], "declarations": [{"kind": "struct", "name": "Transfer", "ty_idx": 1, "prefix": {"prefix_num": 1, "prefix_len": 32}, "fields": [{"name": "value", "ty_idx": 0}]}], "incoming_messages": [{"body_ty_idx": 1}], "incoming_external": [], "get_methods": [{"name": "balance", "tvm_method_id": 123, "parameters": [], "return_ty_idx": 2}]}
    return reference, abi


class AbiTests(unittest.TestCase):
    def test_matching_wire_and_stack(self):
        r, a = fixture()
        self.assertEqual(acton_abi.compare_abi(r, a), [])

    def test_rejects_opcode_field_width_and_field_order_drift(self):
        r, a = fixture()
        for change in ("opcode", "type", "name"):
            bad = copy.deepcopy(a)
            if change == "opcode":
                bad["declarations"][0]["prefix"]["prefix_num"] = 2
            elif change == "type":
                bad["unique_types"][0] = {"kind": "uintN", "n": 64}
            else:
                bad["declarations"][0]["fields"][0]["name"] = "wrong"
            self.assertTrue(acton_abi.compare_abi(r, bad))

    def test_rejects_missing_extra_getter_and_wrong_id(self):
        r, a = fixture()
        for getters in ([], [{**a["get_methods"][0], "tvm_method_id": 456}], [*a["get_methods"], {**a["get_methods"][0], "name": "extra"}]):
            self.assertTrue(acton_abi.compare_abi(r, {**a, "get_methods": getters}))

    def test_nullable_cell_is_not_native_addr_none(self):
        a = {"unique_types": [{"kind": "addressOpt"}, {"kind": "nullable", "inner_ty_idx": 2}, {"kind": "cell"}]}
        self.assertEqual(acton_abi.tolk_type(a, 0), {"type": "address", "optional": False})
        self.assertEqual(acton_abi.tolk_type(a, 1), {"type": "cell", "optional": True})

    def test_optional_return_and_unknown_schema_rejected(self):
        r, a = fixture()
        a["unique_types"].append({"kind": "nullable", "inner_ty_idx": 2})
        a["get_methods"][0]["return_ty_idx"] = 3
        self.assertTrue(acton_abi.compare_abi(r, a))
        a["abi_schema_version"] = "2.0"
        self.assertTrue(acton_abi.compare_abi(r, a))

    def test_named_getter_struct_field_drift_is_rejected(self):
        _, a = fixture()
        tact = {"types": [{"name": "Transfer", "fields": [{"name": "value", "type": {"kind": "simple", "type": "uint", "format": "coins", "optional": False}}]}], "getters": [{"returnType": {"type": "Transfer"}}]}
        self.assertEqual(acton_abi.compare_getter_layouts(tact, a), [])
        a["declarations"][0]["fields"][0]["name"] = "different"
        self.assertTrue(acton_abi.compare_getter_layouts(tact, a))


class SynchronizationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.build = self.root / "tolk/build"
        self.build.mkdir(parents=True)

    def generation(self, name, value):
        directory = self.root / name
        directory.mkdir()
        (directory / "wrapper.gen.tolk").write_text(value)
        (directory / "sync-manifest.json").write_text(json.dumps({"schemaVersion": 1, "acton": "1.2.1", "sources": {"input": "sha"}, "artifacts": sync_acton.artifact_hashes(directory)}))
        return directory

    def test_publishes_all_artifacts_as_one_symlink_generation(self):
        old = self.generation("first", "old")
        new = self.generation("second", "new")
        sync_acton.publish(self.root, old)
        pointer = self.build / "synchronized"
        first = pointer.resolve()
        sync_acton.publish(self.root, new)
        self.assertTrue(pointer.is_symlink())
        self.assertNotEqual(pointer.resolve(), first)
        self.assertEqual((pointer / "wrapper.gen.tolk").read_text(), "new")
        self.assertEqual((first / "wrapper.gen.tolk").read_text(), "old")

    def test_failed_publish_preserves_previous_generation(self):
        sync_acton.publish(self.root, self.generation("old", "old"))
        pointer = self.build / "synchronized"
        previous = pointer.resolve()
        with patch.object(sync_acton.os, "replace", side_effect=OSError("failure")):
            with self.assertRaises(OSError):
                sync_acton.publish(self.root, self.generation("new", "new"))
        self.assertEqual(pointer.resolve(), previous)
        self.assertEqual((pointer / "wrapper.gen.tolk").read_text(), "old")

    def test_migrates_direct_build_without_deleting_it(self):
        directory = self.build / "synchronized"
        directory.mkdir()
        (directory / "old.boc").write_bytes(b"old")
        sync_acton.publish(self.root, self.generation("new", "new"))
        self.assertTrue(directory.is_symlink())
        self.assertEqual(len(list((self.build / "generations").glob("legacy-*/old.boc"))), 1)

    def test_lock_prevents_concurrent_runs_and_inode_is_retained(self):
        with sync_acton.sync_lock(self.build):
            with self.assertRaises(ValueError):
                with sync_acton.sync_lock(self.build):
                    pass
        self.assertTrue((self.build / ".sync.lock").exists())
        with sync_acton.sync_lock(self.build):
            pass

    def test_check_is_read_only_and_detects_source_artifact_drift(self):
        sync_acton.publish(self.root, self.generation("new", "new"))
        pointer = self.build / "synchronized"
        with patch.object(sync_acton, "source_hashes", return_value={"input": "sha"}), patch.object(sync_acton, "verify", return_value={}):
            before = (pointer / "sync-manifest.json").read_bytes()
            sync_acton.check(self.root)
            self.assertEqual((pointer / "sync-manifest.json").read_bytes(), before)
            (pointer / "wrapper.gen.tolk").write_text("corrupt")
            with self.assertRaisesRegex(ValueError, "artifacts"):
                sync_acton.check(self.root)
        with patch.object(sync_acton, "source_hashes", return_value={"input": "changed"}):
            with self.assertRaisesRegex(ValueError, "sources"):
                sync_acton.check(self.root)

    def test_wrong_toolchain_fails_before_build_or_publish(self):
        project = self.root / "tolk"
        (project / "Acton.toml").write_text('[toolchain]\nacton="1.2.1"\n')
        with patch.object(sync_acton, "run", return_value="acton 9.0.0"), patch.object(sync_acton, "publish") as publish:
            with self.assertRaisesRegex(ValueError, "Expected Acton 1.2.1"):
                sync_acton.synchronize(self.root)
            publish.assert_not_called()

    def test_scripts_reject_broadcast_before_wallet_access(self):
        smoke = (ROOT / "tolk/scripts/local-smoke.tolk").read_text()
        self.assertLess(smoke.index("assert (!net.isBroadcasting())"), smoke.index("scripts.wallet("))
        self.assertIn("waitForFirstTransaction() != null", smoke)
        self.assertIn("waitForTrace()", smoke)
        self.assertIn("assert (trace != null)", smoke)
        runner = (ROOT / "scripts/sync_acton.py").read_text()
        self.assertNotIn('"--net"', runner)
        self.assertNotIn('"--fork-net"', runner)

    def test_sync_uses_acton_format_build_wrapper_lint_and_test_gates(self):
        runner = (ROOT / "scripts/sync_acton.py").read_text()
        formatter = 'run([acton, "fmt", "--check"], stage)'
        build = 'run([acton, "build"], stage)'
        wrapper = 'run([acton, "wrapper", "--all", "--output-dir", OUTPUT + "/wrappers"], stage)'
        linter = 'run([acton, "check"], stage)'
        tests = 'run([acton, "test"], stage)'
        self.assertLess(runner.index(formatter), runner.index(build))
        self.assertLess(runner.index(build), runner.index(wrapper))
        self.assertLess(runner.index(wrapper), runner.index(linter))
        self.assertLess(runner.index(linter), runner.index(tests))


if __name__ == "__main__":
    unittest.main()
