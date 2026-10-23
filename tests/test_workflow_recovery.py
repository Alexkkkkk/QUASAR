"""Execute the actual workflow shell snippets with deterministic local stubs."""
import os
from pathlib import Path
import subprocess
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]


def step_script(workflow, name):
    text = (ROOT / '.github/workflows' / workflow).read_text()
    block = text.split('      - name: ' + name + '\n', 1)[1]
    block = block.split('\n      - name:', 1)[0]
    run = block.split('        run: |\n', 1)[1]
    lines = []
    for line in run.splitlines():
        if line.strip() and not line.startswith('          '):
            break
        lines.append(line)
    return textwrap.dedent('\n'.join(lines))


class WorkflowRecoveryTests(unittest.TestCase):
    def run_review(self, mode):
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            gh = directory / 'gh'
            gh.write_text('''#!/bin/bash
n=0
[[ ! -f "$RUNNER_TEMP/calls" ]] || n=$(cat "$RUNNER_TEMP/calls")
n=$((n+1)); echo "$n" > "$RUNNER_TEMP/calls"
case "$TEST_MODE" in
 error) exit 1;;
 retry) [[ "$n" -gt 1 ]] || exit 1;;
 empty) exit 0;;
esac
printf 'diff --git a/test b/test\\n'
''')
            gh.chmod(0o755)
            sleep = directory / 'sleep'
            sleep.write_text('#!/bin/sh\nexit 0\n')
            sleep.chmod(0o755)
            env = dict(os.environ, PATH=str(directory) + ':' + os.environ['PATH'],
                       RUNNER_TEMP=temp, GITHUB_ENV=str(directory / 'env'),
                       GITHUB_REPOSITORY='owner/repo', PR='1', TEST_MODE=mode)
            result = subprocess.run(['bash', '-c', step_script('_ai-review.yml', 'Collect the PR diff as bounded context')],
                                    env=env, capture_output=True, text=True)
            state = (directory / 'env').read_text() if (directory / 'env').exists() else ''
            return result.returncode, int((directory / 'calls').read_text()), state

    def test_review_retries_transient_failure(self):
        code, attempts, state = self.run_review('retry')
        self.assertEqual((code, attempts), (0, 2))
        self.assertNotIn('SKIP=true', state)

    def test_review_skips_empty_diff(self):
        code, attempts, state = self.run_review('empty')
        self.assertEqual((code, attempts), (0, 1))
        self.assertIn('SKIP=true', state)

    def test_review_persistent_failure_is_not_success(self):
        code, attempts, _ = self.run_review('error')
        self.assertNotEqual(code, 0)
        self.assertEqual(attempts, 3)

    def test_autofix_exports_no_changes_for_both_cases(self):
        script = step_script('autofix.yml', 'Produce the patch')
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            repo = base / 'repo'
            repo.mkdir()
            def git(*args):
                return subprocess.run(['git', *args], cwd=repo, check=True, capture_output=True)
            git('init', '-q')
            git('-c', 'user.name=test', '-c', 'user.email=test@example.invalid', 'commit', '--allow-empty', '-qm', 'initial')
            for modified, expected in [(False, 'true'), (True, 'false')]:
                if modified:
                    (repo / 'a.txt').write_text('new file\n')
                output = base / ('out-' + expected)
                env = dict(os.environ, RUNNER_TEMP=temp, GITHUB_OUTPUT=str(output))
                result = subprocess.run(['bash', '-c', script], cwd=repo, env=env, capture_output=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn('no_changes=' + expected, output.read_text())
        workflow = (ROOT / '.github/workflows/autofix.yml').read_text()
        self.assertIn("needs.heal.outputs.no_changes == 'false'", workflow)

    def test_scout_transfers_input_between_jobs(self):
        workflow = (ROOT / '.github/workflows/_scout.yml').read_text()
        self.assertEqual(workflow.count('name: scout-problems'), 2)
        self.assertIn('path: ${{ runner.temp }}/problems.json', workflow)
        for name in ['_scout.yml', '_idle-agent.yml']:
            self.assertNotIn('uses: google-github-actions/run-gemini-cli', (ROOT / '.github/workflows' / name).read_text())
