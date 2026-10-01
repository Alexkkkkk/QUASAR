# QUASAR GitHub AI issue agent

**Status:** The runnable workflow is included in this draft PR at .github/workflows/ai-fix-agent.yml. It becomes active only after the PR is merged, the Gemini API secret is configured, and a repository owner applies the existing ai-fix label to an issue.

## What it does

- Runs only for an issue labeled ai-fix by the repository owner; it does not run for every issue or pull request.
- Uses the Gemini API free-tier model gemini-3.8-flash. Gemini CLI and the GitHub Action are pinned to reviewed versions.
- Gives the model read-only GitHub permissions and file tools only. It cannot run shell commands, access web or MCP tools, merge, deploy, or perform wallet/on-chain actions.
- Exports a patch to a short-lived artifact. A separate job applies it and runs the repository CI checks without the Gemini API key or write permissions.
- Rejects changes to workflows, agent policy/configuration, package manifests, deployment/security scripts, build/deployment artifacts, environment files, and wallet credentials.
- Creates or updates a draft PR on ai/<issue-number>-agent only after all checks pass. The PR links to the successful validation run and remains a draft.

The model job never receives the token used to create the PR. The write-capable token exists only in the final job, after validation. The existing blanket auto-merge workflow is removed in this PR; generated changes still require human review and an explicit merge decision.

## Setup after merging

1. Add GEMINI_API_KEY under Settings > Secrets and variables > Actions. Never put it in an issue, source file, commit, or chat.
2. Use a Gemini API project with billing disabled to keep requests on the free tier. Free quota is limited and can change; missing credentials or quota exhaustion stops the run before a PR is created.
3. Keep GitHub Actions token defaults read-only. If repository policy blocks PR creation, allow GitHub Actions to create pull requests; the workflow requests contents: write and pull-requests: write only in its final PR-creation job.
4. Manually add ai-fix to an issue as the repository owner to start an agent run.

## Data and safety limits

Gemini free-tier prompts and outputs may be used by Google to improve its products. Do not label issues containing confidential information for AI processing. See Google's current pricing and data-use terms: https://ai.google.dev/gemini-api/docs/pricing.

The workflow validates a generated patch but does not audit smart contracts or establish testnet/mainnet readiness. A human must inspect all changes, especially TON/DeFi contract changes, before merging.
