"""Safe URL opening helpers for scripts that consume untrusted URL components."""
from __future__ import annotations

from urllib.parse import urlparse
from urllib.request import HTTPSHandler, HTTPErrorProcessor, OpenerDirector, Request


_HTTPS_OPENER = OpenerDirector()
_HTTPS_OPENER.add_handler(HTTPSHandler())
_HTTPS_OPENER.add_handler(HTTPErrorProcessor())


def assert_https(url: str) -> str:
    """Validate that *url* is an absolute HTTPS URL and return it unchanged."""
    if not isinstance(url, str):
        raise ValueError("URL must be a string")
    parsed = urlparse(url)
    if parsed.scheme.lower() != "https" or not parsed.netloc:
        raise ValueError("only absolute https:// URLs are allowed")
    return url


def open_url(request: Request | str, *, timeout: float):
    """Open an HTTPS URL without enabling file://, ftp://, or HTTP handlers."""
    target = request.full_url if isinstance(request, Request) else request
    assert_https(target)
    return _HTTPS_OPENER.open(request, timeout=timeout)
