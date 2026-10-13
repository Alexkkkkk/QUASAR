#!/usr/bin/env node
// SwarmSync CLI — single entry point for agents and CI.
//
//   node scripts/ai/swarm/cli.mjs learn [--dry]     aggregate lessons -> rule drafts
//   node scripts/ai/swarm/cli.mjs sync              cross-agent consistency report
//   node scripts/ai/swarm/cli.mjs rag               rebuild retrieval index
//   node scripts/ai/swarm/cli.mjs query "<text>"    fetch shared knowledge for a prompt
//   node scripts/ai/swarm/cli.mjs teach '<json>'    append a lesson (validated + scanned)
//   node scripts/ai/swarm/cli.mjs pending           idle gate: new material since last cycle?
//   node scripts/ai/swarm/cli.mjs status            one-line swarm health
//   node scripts/ai/swarm/cli.mjs all               learn + sync + rag (CI cycle)
import { learn, hasPendingWork } from './learn.mjs';
import { sync } from './sync.mjs';
import { buildIndex, queryContext, query } from './rag.mjs';
import { appendLesson, readLessons } from './knowledge.mjs';

const [, , cmd, ...rest] = process.argv;
const flag = (n) => rest.includes(n);

async function main() {
  switch (cmd) {
    case 'learn': {
      const report = await learn({ dryRun: flag('--dry') });
      console.log(`learn: ${report.totals.promoted} promoted, ${report.totals.contradictions} conflicts, ${report.totals.pending} pending, ${report.totals.quarantined} quarantined`);
      if (report.totals.structuralErrors > 0) {
        console.error('structural errors:', report.structural.slice(0, 5));
        process.exitCode = 1;
      }
      break;
    }
    case 'sync': {
      const r = sync();
      console.log(`sync: health ${r.health}/100, ${r.conflicts.length} conflicts, ${r.stale.length} stale, pass rate ${(r.passRate * 100).toFixed(1)}%`);
      if (r.quarantine.length > 0) { console.error('quarantined lines present — do not ignore'); process.exitCode = 1; }
      break;
    }
    case 'rag': {
      const idx = buildIndex();
      console.log(`rag: indexed ${idx.docs} docs`);
      break;
    }
    case 'query': {
      const q = rest.filter((a) => a !== '--json').join(' ');
      if (flag('--json')) console.log(JSON.stringify(query(q), null, 2));
      else console.log(queryContext(q) || '(no shared knowledge for this query)');
      break;
    }
    case 'teach': {
      const raw = rest.join(' ');
      const lesson = appendLesson(JSON.parse(raw));
      console.log(`teach: recorded ${lesson.id}`);
      break;
    }
    case 'pending': {
      const p = await hasPendingWork();
      console.log(p ? 'pending: new material since last cycle'
                    : 'idle: nothing new since last cycle');
      if (!p) process.exitCode = 2;   // 2 = «пропустить тяжёлый цикл»
      break;
    }
    case 'status': {
      const { lessons } = readLessons();
      const r = sync();
      console.log(JSON.stringify({ lessons: lessons.length, health: r.health, passRate: r.passRate, conflicts: r.conflicts.length }, null, 2));
      break;
    }
    case 'all': {
      const l = await learn();
      const s = sync();
      const idx = buildIndex();
      console.log(`cycle: promoted=${l.totals.promoted} conflicts=${s.conflicts.length} health=${s.health}/100 docs=${idx.docs}`);
      if (s.quarantine.length > 0) process.exitCode = 1;
      break;
    }
    default:
      console.log('usage: cli.mjs [learn|sync|rag|query|teach|pending|status|all]');
      process.exitCode = cmd ? 1 : 0;
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
