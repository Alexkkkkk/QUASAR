# SwarmSync — cross-agent learning & synchronization

All QUASAR AI agents share one brain: `docs/ai/knowledge/`. Agents write
**lessons** (what broke, what fixed it, did CI pass); the swarm aggregates
them into **rules**; every agent reads the rules before acting. Learning is
distributed — agents teach each other through the knowledge base, never by
mutating prompts or weights.

## The loop

```
agent hits a bug
   └─► writes a lesson to lessons.jsonl (validated + poison-scanned)
         └─► weekly: learn.mjs aggregates identical signatures
               ├─► seen >= 2 AND 100% green AND one solution  → rule draft
               ├─► competing solutions                        → CONFLICT (human decides)
               └─► draft PR → human review → patterns.md / pitfalls.md
                     └─► rag.mjs reindexes → every agent queries the same brain
```

## Files

| Path | Role |
| --- | --- |
| `docs/ai/knowledge/lessons.jsonl` | Append-only lesson log (one JSON per line) |
| `docs/ai/knowledge/patterns.md` | Promoted rules (human-merged only) |
| `docs/ai/knowledge/pitfalls.md` | Known failure modes (human-merged only) |
| `docs/ai/knowledge/drafts/` | Auto-generated rule drafts for the sync PR |
| `docs/ai/knowledge/state/` | Reports + RAG index (regenerated, safe to ignore in review) |
| `scripts/ai/swarm/` | Engine: schema, security, knowledge, learn, sync, rag, cli |
| `.github/workflows/_ai-swarm.yml` | Weekly learning cycle → draft PR |
| `.github/workflows/swarm-dispatch.yml` | Validates every knowledge change (push/PR gate) |

## Agent integration

Before generating a fix, an agent fetches shared knowledge:

```
node scripts/ai/swarm/cli.mjs query "bounce handling in remove liquidity"
# → inject the printed context into the LLM prompt as SHARED KNOWLEDGE
```

After CI passes, the agent records the lesson:

```
node scripts/ai/swarm/cli.mjs teach '{"agent":"ai-fix","kind":"fix","task":"...","error":{"type":"...","message":"..."},"solution":"...","evidence":{"tests":true,"pr":"ton-quasar#45"}}'
```

## Trust model (hard rules)

1. **Lessons are untrusted input.** Every line is schema-validated and scanned
   for secrets (tokens, keys, TON mnemonics) and prompt-injection. Poisoned
   lines are quarantined and fail the sync job.
2. **Nothing auto-merges.** Rules reach `patterns.md`/`pitfalls.md` only via a
   draft PR approved by a human.
3. **Only green runs teach.** A rule is promoted only if every recorded
   attempt passed CI (`passRate == 1.0`). Failing "fixes" stay in the log but
   never become rules.
4. **Conflicts don't resolve themselves.** Two agents proposing different
   fixes for the same root cause produce a `CONFLICT` entry — a human picks one.
5. **Safety brake.** The learning workflow stops after 15 iterations and files
   a `needs-human` issue, mirroring the `pr-polish` policy.
6. **No on-chain actions.** Swarm sync never touches contracts, deployments,
   or funds — same boundary as the rest of the AI surface.

## Commands

```
node scripts/ai/swarm/cli.mjs learn [--dry]   # aggregate → drafts
node scripts/ai/swarm/cli.mjs sync            # consistency/health report
node scripts/ai/swarm/cli.mjs rag             # rebuild index
node scripts/ai/swarm/cli.mjs query "<text>"  # shared knowledge for prompts
node scripts/ai/swarm/cli.mjs status          # one-line health JSON
node scripts/ai/swarm/cli.mjs all             # full cycle (CI)
```

## Signature design

The same root cause must hash identically for every agent, so error messages
are canonicalized before hashing: lowercase, strip paths, numbers, hex,
hashes and TON addresses (`EQ...`). "bounce at line 42 in QuasarMaster.tolk" and
"bounce at line 7 in QuasarCommon.tolk" → one signature → the swarm learns
once, not twice.
