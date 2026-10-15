// Issue watcher — the resident Ollama loop keeps an eye on /issues.
// Every cycle it picks a few untriaged issues, asks the local model to
// classify them, answers the author, labels them, and hands fixable ones
// to autopilot's fix-queue (which opens a fix PR autonomously).
import { spawnSync } from 'node:child_process';
import { llm } from './learn.mjs';
import { readState, writeState } from './knowledge.mjs';

const TRIAGE_LABEL = 'ai-triaged';
const FIX_LABEL = 'autopilot-fix';

let knownLabels;
function ensureLabels(names) {
  if (!knownLabels) {
    knownLabels = new Set(gh(['label', 'list', '--json', 'name', '--limit', '1000']).map((l) => l.name));
  }
  for (const name of new Set(names)) {
    if (knownLabels.has(name)) continue;
    gh(['label', 'create', name, '--color', 'ededed', '--description', 'Created by the resident issue watcher'], { json: false });
    knownLabels.add(name);
  }
}

function gh(args, { json = true } = {}) {
  const r = spawnSync('gh', args, {
    encoding: 'utf8',
    env: { ...process.env, GH_PROMPT: 'disabled' },
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) throw new Error(`gh ${args.join(' ')} → ${(r.stderr || '').slice(0, 300)}`);
  return json ? JSON.parse(r.stdout) : r.stdout;
}

// Parse the model's strict triage format. Returns null when unparsable —
// the issue stays unlabeled for the next cycle instead of being mislabeled.
export function parseTriage(text) {
  if (!text) return null;
  const get = (key) => {
    const m = text.match(new RegExp(`^${key}:\\s*(.+)$`, 'im'));
    return m ? m[1].trim() : null;
  };
  const category = (get('CATEGORY') || '').toLowerCase();
  if (!['bug', 'feature', 'question', 'docs', 'spam', 'duplicate'].includes(category)) return null;
  const fixable = (get('FIXABLE') || '').toLowerCase();
  if (fixable !== 'yes' && fixable !== 'no') return null;
  const labels = (get('LABELS') || '')
    .split(',').map((s) => s.trim().toLowerCase()).filter((s) => /^[a-z0-9-]{2,30}$/.test(s));
  const response = get('RESPONSE');
  if (!response) return null;
  return { category, fixable: fixable === 'yes', labels: labels.slice(0, 5), response: response.slice(0, 1000) };
}

export async function watchIssues({ limit = 3 } = {}) {
  const state = readState('issues-watch.json', { seen: [], unparsed: [] });
  const issues = gh(['issue', 'list', '--state', 'open', '--limit', '40',
    '--json', 'number,title,body,labels,author,createdAt']);
  const fresh = issues
    .filter((i) => !i.labels.some((l) => l.name === TRIAGE_LABEL))
    .filter((i) => !state.seen.includes(i.number))
    .slice(0, limit);

  if (!fresh.length) { console.log('issues: nothing new to triage'); return { triaged: 0 }; }

  let triaged = 0;
  for (const issue of fresh) {
    const prompt = [
      `Triage this GitHub issue.`,
      '',
      `Title: ${issue.title}`,
      '',
      String(issue.body || '(no body)').slice(0, 2500),
      '',
      'Reply in EXACTLY this format:',
      'CATEGORY: bug|feature|question|docs|spam|duplicate',
      'FIXABLE: yes|no   (yes = a small concrete code/doc change can fix it)',
      'LABELS: comma-separated kebab-case labels (up to 5, no spaces)',
      'RESPONSE: 1-3 sentences answering the author or explaining what happens next',
    ].join('\n');

    const out = await llm(
      'You are a strict issue triage bot. You always reply in the exact requested format, nothing else.',
      prompt, 400,
    );
    const t = parseTriage(out);

    if (!t) {
      // Do not retry forever: two unparsed passes, then leave for humans.
      const attempts = (state.unparsed.filter((n) => n === issue.number).length) + 1;
      state.unparsed.push(issue.number);
      if (attempts >= 2) state.seen.push(issue.number);
      writeState('issues-watch.json', state);
      console.log(`issues: #${issue.number} unparsed (attempt ${attempts})`);
      continue;
    }

    const labels = [TRIAGE_LABEL, t.category, ...t.labels];
    if (t.fixable) labels.push(FIX_LABEL);
    ensureLabels(labels);
    gh(['issue', 'edit', String(issue.number), '--add-label', labels.join(',')]);
    gh(['issue', 'comment', String(issue.number), '--body',
      `${t.response}\n\n— *triage by the resident Ollama agent* · category: \`${t.category}\` · fixable: ${t.fixable ? 'yes → autopilot will attempt a fix' : 'no'}`]);

    state.seen.push(issue.number);
    writeState('issues-watch.json', state);
    triaged++;
    console.log(`issues: #${issue.number} triaged as ${t.category}${t.fixable ? ' +fix' : ''}`);
  }
  return { triaged };
}
