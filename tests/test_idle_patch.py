import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from idle_patch import validate_idle_patch
from ollama_issue_agent import AgentError


def patch_for(name):
    return f'diff --git a/{name} b/{name}\n--- a/{name}\n+++ b/{name}\n@@ -1 +1 @@\n-old\n+new\n'


class IdlePatchTests(unittest.TestCase):
    def test_allows_only_target(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            self.assertTrue(validate_idle_patch(patch_for('tests/example.ts'), 'tests', root))
            for name in ['contracts/example.tact', '.github/workflows/ci.yml', 'scripts/hub_audit.ts', 'package.json', 'tests/../scripts/file.ts', 'tests/.env', 'tests/private_key.ts']:
                with self.subTest(name=name), self.assertRaises(AgentError):
                    validate_idle_patch(patch_for(name), 'tests', root)

    def test_rejects_invalid_target_and_symlink(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            (root / 'tests').symlink_to(Path(directory).parent, target_is_directory=True)
            for target in ['tests', '.', '..', '/tests']:
                with self.subTest(target=target), self.assertRaises(AgentError):
                    validate_idle_patch(patch_for('tests/example.ts'), target, root)

    def test_rejects_binary_and_symlink_patch(self):
        for suffix in ['GIT binary patch\n', 'new file mode 120000\n']:
            with self.assertRaises(AgentError):
                validate_idle_patch(patch_for('tests/a.ts') + suffix, 'tests', Path.cwd())
