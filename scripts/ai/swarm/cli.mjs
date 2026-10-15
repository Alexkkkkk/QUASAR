#!/usr/bin/env node
// SwarmSync CLI — single entry point for agents and CI.
//
//   learn [--dry]              aggregate lessons -> rule drafts
//   sync                       cross-agent consistency report
//   rag                        rebuild retrieval index
//   query "<text>" [--remote]  shared knowledge for prompts (optional remote repo)
//   teach '<json>'             append a lesson (validated + scanned)
//   pending                    idle gate: new material since last cycle?
//   risk "<text>" [--json]     pre-PR risk score from similar failed lessons
//   onboard                    regenerate docs/ai/knowledge/ONBOARDING.md
//   watch-issues               Ollama triage of open issues (resident loop)
//   status                     one-line swarm health
//   all                        learn + sync + rag (CI cycle)
import { learn, hasPendingWork, generateOnboarding } from './learn.mjs';
import { watchIssues } from './issues.mjs';
import { sync } from './sync.mjs';
import { buildIndex, queryContext, query, riskScore, fetchRemoteLessons } from './rag.mjs';
import { appendLesson, readLessons } from './knowledge.mjs';

const [, , cmd, ...rest] = process.argv;
const flag = (n) => rest.includes(n);

async function main() {
  switch (cmd) {
    case 'learn': {
      const report = await learn({ dryRun: flag('--dry') });
      console.log(`learn: ${report.totals.promoted} promoted, ${report.totals.held} held, ${report.totals.contradictions} conflicts, ${report.totals.pending} pending, ${report.totals.quarantined} quarantined`);
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
      let remote = null;
      const qargs = [];
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '--remote') { remote = rest[i + 1]; i++; }
        else if (rest[i] !== '--json') qargs.push(rest[i]);
      }
      const q = qargs.join(' ');
      const extra = remote ? await fetchRemoteLessons(remote) : null;
      if (flag('--json')) console.log(JSON.stringify(query(q, { extraDocs: extra }), null, 2));
      else console.log(queryContext(q, 4, extra) || '(no shared knowledge for this query)');
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
    case 'risk': {
      const q = rest.filter((a) => a !== '--json').join(' ');
      const r = riskScore(q);
      console.log(`risk: ${r.score}` + (r.reasons.length ? ` — ${r.reasons.length} similar lesson(s), ${r.reasons.filter((x) => x.failed).length} failed` : ''));
      if (flag('--json')) console.log(JSON.stringify(r, null, 2));
      break;
    }
    case 'onboard': {
      const file = await generateOnboarding();
      console.log(`onboard: wrote ${file}`);
      break;
    }
    case 'watch-issues': {
      const r = await watchIssues();
      console.log(`issues: triaged=${r.triaged}`);
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
      console.log('usage: cli.mjs [learn|sync|rag|query [--remote <url>]|teach|pending|risk [--json]|onboard|watch-issues|status|all]');
      process.exitCode = cmd ? 1 : 0;
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
