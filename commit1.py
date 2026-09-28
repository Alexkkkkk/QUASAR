#!/usr/bin/env python3
"""Commit 1 (M-03 only): reconstruct the intermediate master/security_check state."""
import pathlib, subprocess

R = pathlib.Path('/home/user/quasar_repo')

def head(p):
    return subprocess.run(['git', 'show', f'HEAD:{p}'], capture_output=True, text=True, check=True, cwd=R).stdout

def rep(s, old, new, n=1):
    c = s.count(old)
    assert c == n, f'anchor x{c} (want {n}): {old[:70]!r}'
    return s.replace(old, new)

master = head('contracts/quasar.tact')
master = rep(master,
"""        // Auto-buyback
        if (self.buybackEnabled && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {""",
"""        // Auto-buyback. A pending swap leg owns buybackSwapPending/QueryId;
        // starting another swap here would overwrite the tracking record and
        // desync the reserve accounting when the first proceeds arrive (M-03).
        if (self.buybackEnabled && self.buybackSwapPending == 0 && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {""")
(R / 'contracts' / 'quasar.tact').write_text(master)

scheck = head('scripts/security_check.ts')
scheck = rep(scheck,
    "assertContains(common, 'message(0xd53276db) TokenExcesses', 'excesses use the TEP-74 opcode (F-21)');",
    "assertContains(master, 'self.buybackSwapPending == 0 && self.buybackPool >= self.buybackThreshold', 'a pending buyback swap cannot be overwritten by the fee path (M-03)');\n\nassertContains(common, 'message(0xd53276db) TokenExcesses', 'excesses use the TEP-74 opcode (F-21)');")
scheck = rep(scheck,
    "    'AMM price observations'\n].join(', '));",
    "    'AMM price observations',\n    'buyback swap overlap guard'\n].join(', '));")
(R / 'scripts' / 'security_check.ts').write_text(scheck)
print('STEP1_OK')
