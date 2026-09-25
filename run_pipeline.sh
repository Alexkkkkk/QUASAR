#!/bin/bash
# Full pipeline: patch, build+test, commit, push, open PR. Prints a summary.
set -u
cd /home/user/QUASAR
TOKEN="$(cat /home/user/.ghtoken)"

echo "=== PATCH ==="
python3 patch_burn.py || exit 10

echo "=== BUILD + TEST ==="
timeout 1200 npm test > /tmp/run.log 2>&1
TEST_EXIT=$?
echo "TEST_EXIT=$TEST_EXIT"
grep -E "^(not ok|# tests|# pass|# fail)" /tmp/run.log
if [ "$TEST_EXIT" != "0" ]; then
  echo "=== FAILURE DETAIL ==="
  grep -A20 "^not ok" /tmp/run.log | head -40
  exit 11
fi

echo "=== TSC ==="
npx tsc --noEmit > /tmp/tsc.log 2>&1
echo "TSC_EXIT=$?"
tail -3 /tmp/tsc.log

echo "=== COMMIT ==="
git config user.email "agent@quasar.dev"
git config user.name "QUASAR Audit Agent"
git checkout -b fix/tep74-excesses-and-send-modes-2026-09-25 >/dev/null 2>&1 || git checkout fix/tep74-excesses-and-send-modes-2026-09-25
rm -f patch_burn.py
git add -A
git commit -q -m "fix(contracts): TEP-74 excesses, single remaining-value action, staking liveness (F-21/F-22/F-23)

F-21 (TEP-74): the Jetton wallet did not return the unused part of the incoming
message value. TEP-74 requires excesses#d53276db to response_destination; the
burn refund also used an opaque comment body. Wallets now emit TokenExcesses and
the master/DeFi/wallet accept it.

F-22 (send modes): a fee that triggered a buyback emitted two SendRemainingValue
actions in one transaction, so the second one failed with exit code 37 and the
whole action phase rolled back. The buyback receipt is now paid from the
contract balance.

F-23 (liveness): Unstake settled the reward in the same call, so an empty reward
pool reverted the withdrawal and locked the principal. Rewards are capped by the
fee-funded pool.

Tests: tests/hardening_2026_09_25.test.ts; invariants added to scripts/security_check.ts.
Docs: docs/HARDENING_2026-09-25.md" 2>&1 | tail -3
echo "COMMIT=$(git rev-parse HEAD)"
git log --oneline -1

echo "=== PUSH ==="
git remote set-url origin "https://x-access-token:${TOKEN}@github.com/Alexkkkkk/QUASAR.git"
git push -u origin fix/tep74-excesses-and-send-modes-2026-09-25 --force 2>&1 | tail -3

echo "=== PR ==="
python3 - <<'PY'
import json, os, subprocess, urllib.request

token = open('/home/user/.ghtoken').read().strip()
body = open('/home/user/PR_BODY.md').read()
run = open('/tmp/run.log', encoding='utf-8', errors='replace').read().strip().splitlines()
summary = [l for l in run if l.startswith('# tests') or l.startswith('# pass') or l.startswith('# fail') or l.startswith('not ok')]
body = body.replace('{{TEST_OUTPUT}}', '```\n' + '\n'.join(summary) + '\n```')

payload = json.dumps({
    'title': 'fix(contracts): TEP-74 excesses, single remaining-value action, staking liveness (F-21/F-22/F-23)',
    'head': 'fix/tep74-excesses-and-send-modes-2026-09-25',
    'base': 'main',
    'body': body,
}).encode()

req = urllib.request.Request(
    'https://api.github.com/repos/Alexkkkkk/QUASAR/pulls',
    data=payload, method='POST',
    headers={
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'quasar-audit',
    })
try:
    with urllib.request.urlopen(req, timeout=60) as response:
        data = json.load(response)
    print('PR_URL=' + data['html_url'])
    print('PR_NUMBER=' + str(data['number']))
    print('PR_STATE=' + data['state'])
except urllib.error.HTTPError as err:
    text = err.read().decode()
    print('PR_CREATE_HTTP_ERROR=' + str(err.code))
    print(text[:800])
    if err.code == 422 and 'already exists' in text:
        req2 = urllib.request.Request(
            'https://api.github.com/repos/Alexkkkkk/QUASAR/pulls?state=open',
            headers={'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'User-Agent': 'quasar-audit'})
        with urllib.request.urlopen(req2, timeout=60) as response:
            for pr in json.load(response):
                if pr['head']['ref'] == 'fix/tep74-excesses-and-send-modes-2026-09-25':
                    print('PR_URL=' + pr['html_url'])
                    print('PR_NUMBER=' + str(pr['number']))
PY
