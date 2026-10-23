from __future__ import annotations

import os
import shutil
import subprocess
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
COUNTER_PROJECT = REPOSITORY_ROOT / "examples" / "counter"


class CounterExamplePipelineTests(unittest.TestCase):
    def test_pinned_acton_pipeline(self) -> None:
        acton = shutil.which("acton")
        self.assertIsNotNone(acton, "Acton CLI must be installed to run repository tests")

        environment = os.environ.copy()
        environment["NO_COLOR"] = "1"
        commands = (
            (acton, "init", "--stdlib-only"),
            (acton, "fmt", "--check"),
            (acton, "build"),
            (acton, "wrapper", "Counter", "--output-dir", "wrappers"),
            (acton, "check"),
            (acton, "test"),
        )

        for command in commands:
            with self.subTest(command=command[1:]):
                result = subprocess.run(
                    command,
                    cwd=COUNTER_PROJECT,
                    env=environment,
                    check=False,
                    capture_output=True,
                    text=True,
                    timeout=120,
                )
                self.assertEqual(
                    result.returncode,
                    0,
                    msg=(
                        f"Command failed: {' '.join(command)}\n"
                        f"stdout:\n{result.stdout}\n"
                        f"stderr:\n{result.stderr}"
                    ),
                )


if __name__ == "__main__":
    unittest.main()
