"""Offline regression gates for the compiler-derived Tolk public ABI."""
from __future__ import annotations

import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location(
    "quasar_acton_abi", Path(__file__).resolve().parents[1] / "scripts" / "acton_abi.py"
)
assert SPEC is not None and SPEC.loader is not None
abi_codec = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(abi_codec)


def fixture() -> dict:
    return {
        "abi_schema_version": "1.0",
        "compiler_name": "tolk",
        "compiler_version": "1.5.0",
        "contract_name": "Fixture",
        "unique_types": [
            {"kind": "uintN", "n": 64},
            {"kind": "coins"},
            {"kind": "StructRef", "struct_name": "Transfer"},
            {"kind": "StructRef", "struct_name": "WalletData"},
            {"kind": "address"},
            {"kind": "nullable", "inner_ty_idx": 3},
            {"kind": "cellOf", "inner_ty_idx": 3},
            {"kind": "mapKV", "key_ty_idx": 4, "value_ty_idx": 6},
            {"kind": "addressAny"},
            {"kind": "AliasRef", "alias_name": "Balance"},
        ],
        "declarations": [
            {
                "kind": "struct", "name": "Transfer", "ty_idx": 2,
                "prefix": {"prefix_len": 32, "prefix_num": 0x0F8A7EA5},
                "fields": [{"name": "queryId", "ty_idx": 0}, {"name": "amount", "ty_idx": 9}],
            },
            {
                "kind": "struct", "name": "WalletData", "ty_idx": 3,
                "fields": [{"name": "balance", "ty_idx": 1}, {"name": "owner", "ty_idx": 4}],
            },
            {"kind": "alias", "name": "Balance", "target_ty_idx": 1},
            {"kind": "struct", "name": "PrivateStorage", "ty_idx": 10, "fields": []},
        ],
        "incoming_messages": [{"body_ty_idx": 2}],
        "get_methods": [{
            "name": "get_wallet_data", "tvm_method_id": 97026,
            "parameters": [], "return_ty_idx": 5,
        }],
    }


class ActonAbiTest(unittest.TestCase):
    def test_public_getter_fields_are_pinned_not_only_struct_names(self) -> None:
        snapshot = abi_codec.create_snapshot(fixture())
        self.assertEqual(snapshot["schemaVersion"], 3)
        self.assertEqual(snapshot["types"]["WalletData"]["fields"], [
            {"name": "balance", "type": {"type": "coins", "optional": False}},
            {"name": "owner", "type": {"type": "address", "optional": False}},
        ])
        self.assertTrue(snapshot["getters"][0]["returns"]["optional"])
        self.assertNotIn("PrivateStorage", snapshot["types"])

    def test_getter_layout_regressions_change_snapshot_with_same_struct_name(self) -> None:
        baseline = fixture()
        for mutation in ("reorder", "rename", "retype", "append"):
            with self.subTest(mutation=mutation):
                changed = copy.deepcopy(baseline)
                fields = changed["declarations"][1]["fields"]
                if mutation == "reorder":
                    fields.reverse()
                elif mutation == "rename":
                    fields[0]["name"] = "newBalance"
                elif mutation == "retype":
                    fields[0]["ty_idx"] = 0
                else:
                    fields.append({"name": "extra", "ty_idx": 0})
                self.assertNotEqual(
                    abi_codec.create_snapshot(baseline), abi_codec.create_snapshot(changed)
                )

    def test_map_and_typed_cell_retain_nested_types(self) -> None:
        abi = fixture()
        abi["get_methods"][0]["return_ty_idx"] = 7
        snapshot = abi_codec.create_snapshot(abi)
        result = snapshot["getters"][0]["returns"]
        self.assertEqual(result["type"], "map")
        self.assertEqual(result["key"]["type"], "address")
        self.assertEqual(result["value"]["type"], "cell")
        self.assertEqual(result["value"]["inner"]["type"], "struct:WalletData")
        self.assertIn("WalletData", snapshot["types"])
        changed = copy.deepcopy(abi)
        changed["unique_types"][7]["key_ty_idx"] = 0
        self.assertNotEqual(snapshot, abi_codec.create_snapshot(changed))
        changed = copy.deepcopy(abi)
        changed["unique_types"][6]["inner_ty_idx"] = 1
        self.assertNotEqual(snapshot, abi_codec.create_snapshot(changed))

    def test_nested_struct_from_message_fields_is_reachable(self) -> None:
        abi = fixture()
        abi["get_methods"] = []
        abi["declarations"][0]["fields"].append({"name": "data", "ty_idx": 6})
        self.assertIn("WalletData", abi_codec.create_snapshot(abi)["types"])

    def test_recursive_typed_cell_record_is_finite(self) -> None:
        abi = fixture()
        abi["declarations"][1]["fields"].append({"name": "next", "ty_idx": 6})
        snapshot = abi_codec.create_snapshot(abi)
        self.assertEqual(len(snapshot["types"]), 1)
        self.assertEqual(snapshot["types"]["WalletData"]["fields"][-1]["type"]["inner"]["type"], "struct:WalletData")

    def test_custom_serializer_presence_and_prefix_are_pinned(self) -> None:
        abi = fixture()
        baseline = abi_codec.create_snapshot(abi)
        abi["declarations"][1]["custom_pack_unpack"] = {"pack_to_builder": True, "unpack_from_slice": True}
        custom = abi_codec.create_snapshot(abi)
        self.assertNotEqual(baseline, custom)
        self.assertIn("custom_pack_unpack", custom["types"]["WalletData"])
        abi["declarations"][1]["prefix"] = {"prefix_len": 8, "prefix_num": 1}
        self.assertNotEqual(custom, abi_codec.create_snapshot(abi))

    def test_any_address_is_not_conflated_with_internal_address(self) -> None:
        abi = fixture()
        self.assertEqual(abi_codec.type_shape(abi, 8), {"type": "any_address", "optional": False})
        self.assertNotEqual(abi_codec.type_shape(abi, 8), abi_codec.type_shape(abi, 4))
        abi["unique_types"].append({"kind": "addressOpt"})
        self.assertEqual(abi_codec.type_shape(abi, 10), {"type": "address", "optional": True})

    def test_alias_resolution_and_integer_width(self) -> None:
        abi = fixture()
        self.assertEqual(abi_codec.type_shape(abi, 9), abi_codec.type_shape(abi, 1))
        self.assertEqual(abi_codec.type_shape(abi, 0)["type"], "uint64")

    def test_invalid_indexes_and_new_type_kinds_fail_closed(self) -> None:
        for index in (-1, 999, True, "1"):
            with self.subTest(index=index), self.assertRaisesRegex(ValueError, "invalid ABI type index"):
                abi_codec.type_shape(fixture(), index)
        abi = fixture()
        abi["unique_types"].append({"kind": "futureComposite", "inner_ty_idx": 1})
        with self.assertRaisesRegex(ValueError, "unsupported ABI type kind"):
            abi_codec.type_shape(abi, 10)

    def test_recursive_alias_and_missing_struct_are_rejected(self) -> None:
        abi = fixture()
        abi["declarations"][2]["target_ty_idx"] = 9
        with self.assertRaisesRegex(ValueError, "recursive ABI type"):
            abi_codec.create_snapshot(abi)
        abi = fixture()
        abi["declarations"].pop(1)
        with self.assertRaisesRegex(ValueError, "missing ABI struct declaration"):
            abi_codec.create_snapshot(abi)

    def test_wrong_compiler_schema_or_message_prefix_are_rejected(self) -> None:
        for key, value in (("compiler_name", "tact"), ("abi_schema_version", "2.0")):
            abi = fixture()
            abi[key] = value
            with self.subTest(key=key), self.assertRaisesRegex(ValueError, "unsupported compiler ABI"):
                abi_codec.create_snapshot(abi)
        abi = fixture()
        abi["declarations"][0]["prefix"]["prefix_len"] = 16
        with self.assertRaisesRegex(ValueError, "32-bit opcode"):
            abi_codec.create_snapshot(abi)

    def test_verify_detects_nested_getter_change_and_update_is_explicit(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            generated = root / "abi"
            generated.mkdir()
            (root / "docs" / "abi").mkdir(parents=True)
            for contract in abi_codec.CONTRACTS:
                abi = fixture()
                abi["contract_name"] = contract
                (generated / f"{contract}.json").write_text(json.dumps(abi))
            abi_codec.verify(root, generated, update=True)
            abi_codec.verify(root, generated)
            changed = fixture()
            changed["contract_name"] = "QuasarWallet"
            changed["declarations"][1]["fields"].reverse()
            (generated / "QuasarWallet.json").write_text(json.dumps(changed))
            with self.assertRaisesRegex(ValueError, "QuasarWallet: ABI snapshot differs"):
                abi_codec.verify(root, generated)
            abi_codec.verify(root, generated, update=True)
            abi_codec.verify(root, generated)


if __name__ == "__main__":
    unittest.main()
