#!/usr/bin/env python3
"""Validate a tool-free idle-study diff before it can touch the workspace."""
import re
import sys
from pathlib import Path, PurePosixPath

from ollama_issue_agent import AgentError, DIFF_HEADER_RE, validate_patch

BLOCKED = re.compile(
    r"^(?:contracts/|\.github/|package(?:-lock)?\.json$|"
    r"scripts/(?:deploy|security_check|hub_audit|sync_action_pins))|"
    r"(?:^|/)(?:\.env(?:\.|$)|deployment\.json$|build-hashes\.json$|action_pins\.lock\.json$)|"
    r"mnemonic|seed|private[-_]?key", re.I
)


def validate_idle_patch(raw: str, target: str, root: Path) -> str:
    patch = validate_patch(raw)
    target_path = PurePosixPath(target)
    if target_path.is_absolute() or '..' in target_path.parts or target_path.as_posix() in ('', '.'):
        raise AgentError('invalid idle target')
    for header in DIFF_HEADER_RE.finditer(patch):
        path = header.group(2)
        if BLOCKED.search(path) or not PurePosixPath(path).is_relative_to(target_path):
            raise AgentError(f'idle patch outside allowed target: {path}')
        dest = root / path
        if dest.resolve() != dest.absolute():
            raise AgentError(f'idle patch follows a symlink: {path}')
    return patch


if __name__ == '__main__':
    try:
        sys.stdout.write(validate_idle_patch(sys.stdin.read(), sys.argv[1], Path.cwd()))
    except (AgentError, IndexError) as exc:
        print(f'::error::{exc}', file=sys.stderr)
        sys.exit(1)
