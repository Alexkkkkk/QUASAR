# QUASAR GitHub AI agent

This workflow lets a repository writer request a code proposal by applying the ai-fix label to an issue. It creates an isolated branch and a draft pull request only after the repository checks pass. It never writes to main, merges, deploys, or sends on-chain transactions.

## Free-tier setup

1. Create a Gemini API key in Google AI Studio using a project that is not linked to paid billing.
2. In the repository, open Settings > Secrets and variables > Actions and add a repository secret named GEMINI_API_KEY.
3. Do not paste the key into an issue or commit it to Git.

The workflow uses gemini-3.8-flash and the free Gemini API tier. Free-tier requests are quota-limited; if the quota is unavailable or exhausted, no PR is opened. Google currently states that free-tier prompts and outputs may be used to improve its products. Do not use this mode for confidential source or data. Free-tier quotas and model availability can change; keep the project on the free tier and do not attach billing if the requirement is zero spend.

## Request an AI fix

1. Create an issue with a clear bug report or change request and acceptance criteria. Do not include secrets, wallet keys, seed phrases, or private deployment details.
2. Apply the ai-fix label. Only a user with repository write/maintain/admin permission can start a run.
3. The agent prepares a patch in an isolated job with no repository write token. A separate job rejects workflow, deployment, policy, and credential-file changes, then runs the same checks as repository CI: lint, contract build/security tests, ABI checks, build hashes, TypeScript, and npm audit.
4. If validation passes, the workflow pushes an ai/issue-… branch and opens a draft PR. If it fails, it comments with a link to the run and does not open a PR.
5. A human must review and merge any proposal. Contract changes are not an audit, and no mainnet deployment is authorized by this workflow.

## Safety notes

- Model-generated code is untrusted until reviewed.
- The model job cannot push or create a PR; write credentials are exposed only in the final publication step, after validation.
- The agent cannot edit its own workflow, policy, deployment files, or credentials.
- The repository's previous blanket auto-merge workflow is removed by the agent setup PR; keep AI-created PRs in draft until safeguards are reviewed.
