import copy
import importlib.util
import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TolkMigrationParityTests(unittest.TestCase):
    def test_historical_tact_and_current_tolk_interfaces_remain_in_parity(self):
        result = subprocess.run(
            [sys.executable, "scripts/check_migration_parity.py"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("55 typed receivers", result.stdout)
        self.assertIn("Numeric protocol constants checked: 15", result.stdout)
        self.assertIn("Legacy text receiver payloads checked: 13", result.stdout)
        self.assertIn("43 getters", result.stdout)

    def checker_and_wallet_abis(self):
        spec = importlib.util.spec_from_file_location("parity_gate", ROOT / "scripts/check_migration_parity.py")
        assert spec is not None and spec.loader is not None
        checker = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(checker)
        old = json.loads((checker.BASELINE / checker.PAIRS["Wallet"][0]).read_text())
        new = json.loads((checker.CURRENT / checker.PAIRS["Wallet"][1]).read_text())
        return checker, old, new

    def checker_and_defi_abis(self):
        spec = importlib.util.spec_from_file_location("parity_gate", ROOT / "scripts/check_migration_parity.py")
        assert spec is not None and spec.loader is not None
        checker = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(checker)
        old = json.loads((checker.BASELINE / checker.PAIRS["DeFi"][0]).read_text())
        new = json.loads((checker.CURRENT / checker.PAIRS["DeFi"][1]).read_text())
        return checker, old, new

    def test_recovery_abi_additions_are_exactly_pinned(self):
        checker, old, new = self.checker_and_defi_abis()
        self.assertEqual(checker.check_contract("DeFi", old, new), [])

        changed_opcode = copy.deepcopy(new)
        message = next(item for item in changed_opcode["messages"] if item["name"] == "RetrySwapQsr")
        message["opcode"] = "0xdeadbeef"
        self.assertTrue(any("approved additive opcode changed" in error for error in checker.check_contract("DeFi", old, changed_opcode)))

        changed_getter = copy.deepcopy(new)
        getter = next(item for item in changed_getter["getters"] if item["name"] == "tonPayoutClaim")
        getter["methodId"] += 1
        self.assertTrue(any("approved additive getter method ID changed" in error for error in checker.check_contract("DeFi", old, changed_getter)))

        unexpected = copy.deepcopy(new)
        unexpected["messages"].append({"name": "UnreviewedControl", "opcode": "0xdeadbeef", "fields": []})
        self.assertTrue(any("unexpected typed Tolk receiver UnreviewedControl" in error for error in checker.check_contract("DeFi", old, unexpected)))

    def test_schema3_any_address_widening_is_specific_to_tep89_query(self):
        checker, old, new = self.checker_and_wallet_abis()
        self.assertEqual(checker.check_contract("Wallet", old, new), [])
        changed = copy.deepcopy(new)
        transfer = next(message for message in changed["messages"] if message["name"] == "TokenTransfer")
        destination = next(field for field in transfer["fields"] if field["name"] == "destination")
        destination["type"]["type"] = "any_address"
        errors = checker.check_contract("Wallet", old, changed)
        self.assertTrue(any("TokenTransfer" in error and "name/type mismatch" in error for error in errors))

    def test_tep89_widening_does_not_allow_renames_or_optional_struct_fields(self):
        checker, old, new = self.checker_and_wallet_abis()
        for mutation in ("rename", "optional"):
            with self.subTest(mutation=mutation):
                changed = copy.deepcopy(new)
                query = next(message for message in changed["messages"] if message["name"] == "ProvideWalletAddress")
                owner = next(field for field in query["fields"] if field["name"] == "ownerAddress")
                if mutation == "rename":
                    owner["name"] = "renamedOwner"
                else:
                    owner["type"]["optional"] = True
                self.assertTrue(checker.check_contract("Wallet", old, changed))


if __name__ == "__main__":
    unittest.main()
