# QUASAR GitHub AI agent — proposal

**Status: design only.** This draft PR does not install a runnable issue-agent workflow. The ai-fix label exists, but no workflow currently reacts to it, so applying the label will not start an agent.

## Intended design (not active)

The proposed free-tier agent would read a labeled issue, prepare a focused patch in an isolated job, run the repository's CI checks, and open a draft PR only after validation. It must never write directly to main, merge, deploy, access wallet credentials, or perform on-chain actions.

A future implementation should use a Gemini API free-tier model only. Free-tier requests are quota-limited, and Google may use free-tier prompts and outputs to improve its products. Do not use that service for confidential source or data. For a strict zero-spend setup, do not attach billing to the Google project; quotas and model availability may change.

## Requirements before enabling automation

- Add a reviewed workflow under .github/workflows that validates trusted labelers, treats issue text as untrusted, withholds write credentials from the model job, rejects protected-file changes, and runs the same checks as repository CI before opening a draft PR.
- Store any required API key only in the repository's Actions secrets; never put it in an issue, source file, or commit.
- Require human review for all generated changes. Contract changes are not an audit and do not establish mainnet readiness.
- Review or remove the repository's existing blanket auto-merge workflow before enabling any agent-generated PRs. That existing workflow has not been changed by this draft.

## Scope of this draft PR

This PR adds documentation and the repository-level Gemini safety policy only. It does not add the agent workflow, remove the existing auto-merge workflow, add a secret, run an agent, or close issue #94. The issue remains open until the runnable implementation is completed and reviewed.
