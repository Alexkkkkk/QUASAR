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

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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
ensure_label "ai-fix"        "d4c5f9" "Groq issue agent (label triggers the workflow)"
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
ensure_label "ai-merge-ok"   "0e8a16" "Optional fast-path trigger; not an approval"
ensure_label "needs-human"   "b60205" "Automation stopped; follow-up required"

# ── 5. Rulesets ──────────────────────────────────────────────────────────
echo
echo "== 5. rulesets"
ruleset_payload() {
  python3 - "$1" "$ROOT/docs/ai/ruleset-l3.json" <<'PY'
import json, sys
kind, branch_config = sys.argv[1:]
if kind == "branch":
    with open(branch_config, encoding="utf-8") as source:
        payload = json.load(source)
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

# ── 5a. Legacy classic branch-protection review gate ─────────────────────
echo
echo "== 5a. classic branch-protection review gate"
review_endpoint="repos/$REPO/branches/main/protection/required_pull_request_reviews"
if [[ "$DRY_RUN" == "1" ]]; then
  echo "  [dry-run] remove classic review gate; preserve other branch protections"
else
  if current_review=$(gh api "$review_endpoint" 2>&1); then
    gh api --method DELETE "$review_endpoint" --silent
    echo "  ok removed classic review gate and its bypass allowances"
  elif [[ "$current_review" == *"HTTP 404"* ]]; then
    echo "  ok no classic review rule exists; ruleset remains authoritative"
  else
    printf '%s\n' "$current_review" >&2
    exit 1
  fi
fi

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

# ── 7. GitHub Pages ───────────────────────────────────────────────────────
echo
echo "== 7. GitHub Pages (deployment disabled)"
if [[ -e "$ROOT/.github/workflows/pages.yml" ]]; then
  echo "error: pages.yml would re-enable automatic deployment; remove it." >&2
  exit 1
else
  echo "  ok no Pages deployment workflow is present"
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
classic_review_count=$(gh api "repos/$REPO/branches/main/protection/required_pull_request_reviews" --jq .required_approving_review_count 2>/dev/null || echo absent)
if [[ "$classic_review_count" == "0" || "$classic_review_count" == "absent" ]]; then
  echo "  ok no classic human approval requirement"
else
  echo "error: classic branch protection still requires $classic_review_count approving review(s)." >&2
  exit 1
fi
if [[ "$(gh api "repos/$REPO/actions/permissions" --jq .sha_pinning_required)" != "true" ]]; then
  echo "error: GitHub does not require actions to be pinned to a full-length commit SHA." >&2
  exit 1
fi

echo
echo "== done."
echo "Remaining setup steps (no API exists for them):"
echo "  1. Settings -> Branches: confirm no classic branch-protection review rule"
echo "     reintroduces approvals; setup sets any classic review count to zero."
echo "  2. Settings -> Secrets and variables -> Actions: add GROQ_API_KEY if the"
echo "     Groq agent is used (the Ollama agent needs no model key)."
echo "  3. Settings -> Code security: confirm 'CodeQL analysis: default setup'."
echo "  4. Add the label ai-fix to an issue to trigger the agent. Green required checks"
echo "     enable automatic PR readiness/merge; no approving review is required."
