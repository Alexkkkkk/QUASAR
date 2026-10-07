#!/usr/bin/env bash
#
# QUASAR repository-settings applier.
#
# Applies the hardened automation baseline to the LIVE GitHub repository:
# merge policy, security features, rulesets, branch protection, Actions
# permissions, labels and code scanning.
#
# The token is read from the environment ONLY. Never hardcode it, never pass
# it on the command line (it would land in your shell history), never commit
# it. Required scope: Administration (write) + repo.
#
#   export GH_TOKEN=...            # fine-grained PAT with Administration:write
#   ./setup-repo.sh --dry-run      # print every request without sending it
#   ./setup-repo.sh                # apply
#
# Owner/repo defaults to Alexkkkkk/QUASAR; override with the first argument.

set -euo pipefail

REPO="${1:-Alexkkkkk/QUASAR}"
DRY_RUN=0
[[ "${2:-}" == "--dry-run" || "${1:-}" == "--dry-run" ]] && DRY_RUN=1
[[ "${1:-}" == "--dry-run" ]] && REPO="Alexkkkkk/QUASAR"

if [[ "$DRY_RUN" != "1" ]]; then
  if [[ -z "${GH_TOKEN:-}" ]]; then
    echo "error: GH_TOKEN is not set. Export a fine-grained PAT with Administration:write." >&2
    exit 1
  fi

  command -v gh >/dev/null || { echo "error: the GitHub CLI (gh) is required." >&2; exit 1; }
fi

echo "== target repository: $REPO (dry-run=$DRY_RUN)"

api() {
  local method="$1"; shift
  if [[ "$DRY_RUN" == "1" ]]; then
    printf '  [dry-run] gh api --method %q' "$method" >&2
    printf ' %q' "$@" >&2
    printf '\n' >&2
    return 0
  fi
  gh api --method "$method" "$@"
}

# ── 1. Merge policy and general repository flags ─────────────────────────
echo
echo "== 1. merge policy"
api PATCH "repos/$REPO" \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=true \
  -F allow_auto_merge=true \
  -F delete_branch_on_merge=true \
  -F allow_update_branch=true \
  -F squash_merge_commit_title=PR_TITLE \
  -F squash_merge_commit_message=PR_BODY \
  -F has_issues=true >/dev/null

# ── 2. Secret scanning and Dependabot alerts ─────────────────────────────
echo
echo "== 2. security features"
api PATCH "repos/$REPO" \
  -F 'security_and_analysis[secret_scanning][status]=enabled' \
  -F 'security_and_analysis[secret_scanning_push_protection][status]=enabled' \
  -F 'security_and_analysis[secret_scanning_non_provider_patterns][status]=enabled' \
  -F 'security_and_analysis[secret_scanning_validity_checks][status]=enabled' \
  -F 'security_and_analysis[dependabot_security_updates][status]=enabled' >/dev/null
api PUT "repos/$REPO/vulnerability-alerts"
api PUT "repos/$REPO/automated-security-fixes"

# ── 3. Actions permissions ───────────────────────────────────────────────
echo
echo "== 3. Actions permissions"
api PUT "repos/$REPO/actions/permissions" \
  -F enabled=true -F allowed_actions=selected >/dev/null
api PUT "repos/$REPO/actions/permissions/workflow" \
  -F default_workflow_permissions=read \
  -F can_approve_pull_request_reviews=false >/dev/null
api PUT "repos/$REPO/actions/permissions/access" \
  -F access_level=none >/dev/null 2>&1 || true
if [[ "$DRY_RUN" == "1" ]]; then
  echo "  [dry-run] gh api --method PUT repos/$REPO/actions/permissions/selected-actions (action allowlist)"
else
  gh api --method PUT "repos/$REPO/actions/permissions/selected-actions" \
    -F github_owned_allowed=true \
    -F verified_allowed=false \
    -F 'patterns_allowed[]=actions/*' \
    -F 'patterns_allowed[]=github/codeql-action@*' \
    -F 'patterns_allowed[]=google-github-actions/*' \
    -F 'patterns_allowed[]=peter-evans/create-pull-request@*' \
    -F 'patterns_allowed[]=dependabot/*' >/dev/null
fi
# SHA pinning may be inherited from a higher-level policy. The verification
# section fails if GitHub reports it disabled; this script does not weaken it.

# ── 4. Labels ────────────────────────────────────────────────────────────
echo
echo "== 4. labels"
ensure_label() {
  local name="$1" color="$2" desc="$3"
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  [dry-run] ensure label $name"
    return 0
  fi
  if gh label list --repo "$REPO" --limit 200 --json name --jq '.[].name' | grep -Fxq "$name"; then
    gh label edit "$name" --repo "$REPO" --color "$color" --description "$desc" >/dev/null
  else
    gh label create "$name" --repo "$REPO" --color "$color" --description "$desc" >/dev/null
  fi
  echo "  ok $name"
}
ensure_label "contracts"     "5319e7" "Tact contracts and their conformance evidence"
ensure_label "defi"          "1d76db" "CPMM pool, liquidity and yield farming"
ensure_label "dapp"          "0e8a16" "website/ and integrations/"
ensure_label "ton-docs"      "c2e0c6" "docs/ton snapshot and TON Docs sync"
ensure_label "ai-fix"        "d4c5f9" "Gemini issue agent (label triggers the workflow)"
ensure_label "ai-fix-ollama" "bfd4f2" "Local Ollama issue agent (label triggers the workflow)"
ensure_label "pinned"        "fef2c0" "Exempt from the stale bot"
ensure_label "audit"         "fbca04" "Audit finding or remediation"
ensure_label "spec"          "f9d0c4" "Specification work"
ensure_label "security"      "b60205" "Security sensitive: never auto-closed"
ensure_label "ci"            "0e8a16" "Workflows and automation"
ensure_label "dependencies"  "0366d6" "Dependency updates"
ensure_label "release"       "c5def5" "Release and packaging"
ensure_label "tests"         "d93f0b" "Test suites"
ensure_label "docs"          "0075ca" "Documentation"
ensure_label "chore"         "ededed" "Housekeeping"
ensure_label "triaged"       "ededed" "Triaged by a maintainer"
ensure_label "stale"         "ffffff" "No activity; see the Stale workflow"
ensure_label "automerge"     "0e8a16" "Green checks may be merged automatically"
ensure_label "do-not-merge"  "b60205" "Never merged automatically"

# ── 5. Rulesets ──────────────────────────────────────────────────────────
echo
echo "== 5. rulesets"
ruleset_payload() {
  python3 - "$1" <<'PY'
import json, sys
kind = sys.argv[1]
if kind == "branch":
    payload = {
        "name": "QUASAR main protection",
        "target": "branch",
        "enforcement": "active",
        "conditions": {"ref_name": {"include": ["~DEFAULT_BRANCH"], "exclude": []}},
        "bypass_actors": [
            {"actor_id": 102665324, "actor_type": "User", "bypass_mode": "pull_request"}
        ],
        "rules": [
            {"type": "deletion"},
            {"type": "non_fast_forward"},
            {"type": "required_linear_history"},
            {"type": "required_signatures"},
            {"type": "creation"},
            {"type": "update"},
            {
                "type": "pull_request",
                "parameters": {
                    "required_approving_review_count": 0,
                    "dismiss_stale_reviews_on_push": False,
                    "required_reviewers": [],
                    "require_code_owner_review": False,
                    "require_last_push_approval": False,
                    "required_review_thread_resolution": False,
                    "allowed_merge_methods": ["squash", "rebase"],
                },
            },
            {
                "type": "required_status_checks",
                "parameters": {
                    "strict_required_status_checks_policy": True,
                    "do_not_enforce_on_create": False,
                    "required_status_checks": [
                        {"context": "validate"},
                        {"context": "Analyze (javascript-typescript)"},
                        {"context": "Analyze (python)"},
                    ],
                },
            },
        ],
    }
else:
    payload = {
        "name": "QUASAR release tags",
        "target": "tag",
        "enforcement": "active",
        "conditions": {"ref_name": {"include": ["refs/tags/v*"], "exclude": []}},
        "bypass_actors": [],
        "rules": [{"type": "deletion"}, {"type": "update"}],
    }
print(json.dumps(payload))
PY
}

apply_ruleset() {
  local name="$1" payload="$2" id
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  [dry-run] gh api repos/$REPO/rulesets (lookup existing ruleset \"$name\")"
    echo "  [dry-run] ensure ruleset \"$name\" (update if present, otherwise create)"
    return 0
  fi
  id=$(gh api "repos/$REPO/rulesets" --jq ".[] | select(.name == \"$name\") | .id" 2>/dev/null | head -1 || true)
  if [[ -n "$id" ]]; then
    printf '%s' "$payload" | gh api --method PUT "repos/$REPO/rulesets/$id" --input - >/dev/null
    echo "  ok updated ruleset \"$name\" (id $id)"
  else
    printf '%s' "$payload" | gh api --method POST "repos/$REPO/rulesets" --input - >/dev/null
    echo "  ok created ruleset \"$name\""
  fi
}

apply_ruleset "QUASAR main protection" "$(ruleset_payload branch)"
apply_ruleset "QUASAR release tags" "$(ruleset_payload tag)"

# ── 6. Code scanning default setup ───────────────────────────────────────
echo
echo "== 6. code scanning default setup"
if [[ "$DRY_RUN" == "1" ]]; then
  echo "  [dry-run] gh api --method PATCH repos/$REPO/code-scanning/default-setup"
else
  state=$(gh api "repos/$REPO/code-scanning/default-setup" --jq .state 2>/dev/null || echo "unknown")
  if [[ "$state" == "configured" ]]; then
    echo "  ok already configured"
  else
    gh api --method PATCH "repos/$REPO/code-scanning/default-setup" \
      -F state=configured \
      -F 'languages[]=javascript-typescript' \
      -F 'languages[]=python' \
      -F query_suite=default >/dev/null
    echo "  ok configured for javascript-typescript + python"
  fi
fi

# ── 7. Pages ─────────────────────────────────────────────────────────────
echo
echo "== 7. GitHub Pages"
if [[ "$DRY_RUN" == "1" ]]; then
  echo "  [dry-run] ensure Pages build_type=workflow, https enforced"
else
  gh api --method PUT "repos/$REPO/pages" -F build_type=workflow >/dev/null 2>&1 \
    && echo "  ok Pages build_type=workflow" \
    || echo "  note: set Pages source to 'GitHub Actions' in Settings -> Pages"
  gh api --method PUT "repos/$REPO/pages" -F https_enforced=true >/dev/null 2>&1 || true
fi

# ── 8. Verification ──────────────────────────────────────────────────────
echo
echo "== 8. verification"
if [[ "$DRY_RUN" == "1" ]]; then
  echo "  [dry-run] skipping verification reads"
  exit 0
fi
gh api "repos/$REPO" --jq '{allow_auto_merge, allow_squash_merge, allow_merge_commit, allow_rebase_merge, delete_branch_on_merge, security_and_analysis}'
gh api "repos/$REPO/actions/permissions" --jq '{sha_pinning_required, allowed_actions}'
gh api "repos/$REPO/actions/permissions/workflow" --jq '.'
gh api "repos/$REPO/rulesets" --jq '.[] | {name, target, enforcement}'
if [[ "$(gh api "repos/$REPO/actions/permissions" --jq .sha_pinning_required)" != "true" ]]; then
  echo "error: GitHub does not require actions to be pinned to a full-length commit SHA." >&2
  exit 1
fi

echo
echo "== done."
echo "Remaining manual steps (no API exists for them):"
echo "  1. Settings -> Branches: confirm the ruleset is the source of truth and that"
echo "     no conflicting classic branch protection rule is left behind."
echo "  2. Settings -> Secrets and variables -> Actions: add GEMINI_API_KEY if the"
echo "     Gemini agent is used (the Ollama agent needs no model key)."
echo "  3. Settings -> Pages: source must be 'GitHub Actions'."
echo "  4. Settings -> Code security: confirm 'CodeQL analysis: default setup'."
echo "  5. Add the labels ai-fix / ai-fix-ollama to an issue to trigger the agents."
