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


if __name__ == "__main__":
    unittest.main()
