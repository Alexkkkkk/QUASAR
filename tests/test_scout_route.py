import io
import json
import unittest
from unittest.mock import patch

from scripts import scout_route


class ScoutRouteTests(unittest.TestCase):
    def run_main(self, payload):
        return patch("sys.stdin", io.StringIO(json.dumps(payload)))

    def test_duplicate_lookup_uses_json_not_model_interpolated_jq(self):
        cause = 'quote \\" injection'
        title = f"Scout: {cause[:80]}"
        result = type("Result", (), {"returncode": 0, "stdout": json.dumps([{"title": title}]), "stderr": ""})()
        with self.run_main({"solutions": [{"auto_fixable": True, "confidence": 0.9, "root_cause": cause, "fix_plan": []}]}), patch.object(scout_route.subprocess, "run", return_value=result) as gh:
            self.assertEqual(scout_route.main(), 0)
        args = gh.call_args.args[0]
        self.assertNotIn("--jq", args)
        self.assertEqual(args[-1], "title")
        self.assertEqual(gh.call_count, 1)

    def test_github_api_failure_is_not_treated_as_no_duplicate(self):
        failure = type("Result", (), {"returncode": 1, "stdout": "", "stderr": "rate limited"})()
        payload = {"solutions": [{"auto_fixable": True, "confidence": 0.9, "root_cause": "failure", "fix_plan": []}]}
        with self.run_main(payload), patch.object(scout_route.subprocess, "run", return_value=failure):
            with self.assertRaisesRegex(RuntimeError, "rate limited"):
                scout_route.main()

    def test_issue_creation_failure_does_not_report_success(self):
        listed = type("Result", (), {"returncode": 0, "stdout": "[]", "stderr": ""})()
        failed_create = type("Result", (), {"returncode": 1, "stdout": "", "stderr": "permission denied"})()
        payload = {"solutions": [{"auto_fixable": True, "confidence": 0.9, "root_cause": "failure", "fix_plan": []}]}
        with self.run_main(payload), patch.object(scout_route.subprocess, "run", side_effect=[listed, failed_create]):
            with self.assertRaisesRegex(RuntimeError, "permission denied"):
                scout_route.main()


if __name__ == "__main__":
    unittest.main()
