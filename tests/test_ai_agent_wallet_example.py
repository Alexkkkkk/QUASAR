from __future__ import annotations

import os
import shutil
import subprocess
import unittest
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
PROJECT = REPOSITORY_ROOT / "examples" / "ai-agent-wallet"


class AiAgentWalletPipelineTests(unittest.TestCase):
    """Run the educational example only where the contract CI installed Acton."""

    @unittest.skipUnless(shutil.which("acton"), "Acton CLI is installed only in the contract CI job")
    def test_pinned_acton_pipeline(self) -> None:
        acton = shutil.which("acton")
        self.assertIsNotNone(acton)
        environment = os.environ.copy()
        environment["NO_COLOR"] = "1"
        commands = (
            (acton, "init", "--stdlib-only"),
            (acton, "fmt", "--check"),
            (acton, "build"),
            (acton, "wrapper", "AgentWallet", "--output-dir", "wrappers"),
            (acton, "check"),
            (acton, "test"),
        )
        for command in commands:
            with self.subTest(command=command[1:]):
                result = subprocess.run(
                    command,
                    cwd=PROJECT,
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
