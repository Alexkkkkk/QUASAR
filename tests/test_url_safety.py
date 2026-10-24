from __future__ import annotations

import unittest
from urllib.request import Request

from scripts.url_safety import assert_https, open_url


class UrlSafetyTests(unittest.TestCase):
    def test_rejects_file_urls(self) -> None:
        with self.assertRaises(ValueError):
            assert_https("file:///etc/passwd")

    def test_accepts_absolute_https_urls(self) -> None:
        self.assertEqual(assert_https("https://api.github.com/x"), "https://api.github.com/x")

    def test_rejects_non_https_and_relative_urls(self) -> None:
        for url in ("http://example.com", "ftp://example.com/a", "/local/path"):
            with self.subTest(url=url), self.assertRaises(ValueError):
                assert_https(url)

    def test_request_validation_happens_before_open(self) -> None:
        with self.assertRaises(ValueError):
            open_url(Request("file:///etc/passwd"), timeout=1)


if __name__ == "__main__":
    unittest.main()
