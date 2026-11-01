/**
 * Merges Playwright (JSON reporter) and Cypress (mochawesome JSON) results into one
 * normalized file, matching scenarios across tools by their [ID] prefix, e.g. "[API-01]".
 *
 * Usage: tsx scripts/merge-results.ts [outFile]
 */
import fs from 'node:fs';
import path from 'node:path';

type Status = 'passed' | 'failed' | 'skipped' | 'flaky';

interface Run {
  status: Status;
  durationMs: number;
  retries: number;
  error?: string;
}

interface ToolResult extends Run {
  /** Per-browser breakdown, when the tool ran more than one */
  browsers?: Record<string, Run>;
}

interface Scenario {
  id: string;
  suite: 'API' | 'UI';
  title: string;
  results: { playwright?: ToolResult; cypress?: ToolResult };
}

interface Summary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  /** Sum of individual test durations */
  testTimeMs: number;
  /** Wall-clock for the whole run */
  wallTimeMs: number;
  browsers: string[];
}

const root = path.resolve(__dirname, '..');
const reportsDir = path.join(root, 'reports');
const outFile = process.argv[2] ?? path.join(reportsDir, 'results.json');

const ID_RE = /^\[((API|UI)-\d+)\]\s*(.*)$/;

const readJson = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8'));

const worst = (statuses: Status[]): Status => {
  for (const s of ['failed', 'flaky', 'skipped'] as Status[]) if (statuses.includes(s)) return s;
  return 'passed';
};

const stripAnsi = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');

// ---------- Playwright ----------

interface PwSuite {
  title: string;
  specs?: { title: string; tests: PwTest[] }[];
  suites?: PwSuite[];
}
interface PwTest {
  projectName: string;
  status: 'expected' | 'unexpected' | 'flaky' | 'skipped';
  results: { status: string; duration: number; error?: { message?: string } }[];
}

function* pwSpecs(suite: PwSuite): Generator<{ title: string; tests: PwTest[] }> {
  for (const spec of suite.specs ?? []) yield spec;
  for (const child of suite.suites ?? []) yield* pwSpecs(child);
}

function loadPlaywright(scenarios: Map<string, Scenario>) {
  const file = path.join(reportsDir, 'playwright-results.json');
  if (!fs.existsSync(file)) return undefined;
  const data = readJson(file);
  const browsers = new Set<string>();

  // Playwright emits one spec entry per project (browser), so collect them per scenario ID first.
  const collected = new Map<
    string,
    { suite: 'API' | 'UI'; title: string; perProject: Record<string, Run> }
  >();

  for (const top of data.suites as PwSuite[]) {
    for (const spec of pwSpecs(top)) {
      const m = ID_RE.exec(spec.title);
      if (!m) continue;
      const [, id, suite, title] = m;
      const entry = collected.get(id) ?? { suite: suite as 'API' | 'UI', title, perProject: {} };

      for (const t of spec.tests) {
        const last = t.results[t.results.length - 1];
        const status: Status =
          t.status === 'expected'
            ? 'passed'
            : t.status === 'unexpected'
              ? 'failed'
              : t.status === 'flaky'
                ? 'flaky'
                : 'skipped';
        entry.perProject[t.projectName] = {
          status,
          durationMs: t.results.reduce((sum, r) => sum + r.duration, 0),
          retries: Math.max(0, t.results.length - 1),
          error: last?.error?.message ? stripAnsi(last.error.message).split('\n')[0] : undefined,
        };
        if (t.projectName !== 'api') browsers.add(t.projectName);
      }
      collected.set(id, entry);
    }
  }

  for (const [id, { suite, title, perProject }] of collected) {
    const runs = Object.values(perProject);
    const result: ToolResult = {
      status: worst(runs.map((r) => r.status)),
      durationMs: runs.reduce((s, r) => s + r.durationMs, 0),
      retries: runs.reduce((s, r) => s + r.retries, 0),
      error: runs.find((r) => r.error)?.error,
      browsers: suite === 'UI' ? perProject : undefined,
    };
    const entry = scenarios.get(id) ?? { id, suite, title, results: {} };
    entry.results.playwright = result;
    scenarios.set(id, entry);
  }

  return {
    version: data.config?.version as string | undefined,
    wallTimeMs: Math.round(data.stats?.duration ?? 0),
    browsers: [...browsers].sort(),
  };
}

// ---------- Cypress (mochawesome) ----------

interface MochaSuite {
  tests?: { title: string; state?: string; duration: number; err?: { message?: string } }[];
  suites?: MochaSuite[];
}

function* mochaTests(suite: MochaSuite): Generator<NonNullable<MochaSuite['tests']>[number]> {
  for (const t of suite.tests ?? []) yield t;
  for (const child of suite.suites ?? []) yield* mochaTests(child);
}

function loadCypress(scenarios: Map<string, Scenario>) {
  const dir = path.join(reportsDir, 'cypress-json');
  if (!fs.existsSync(dir)) return undefined;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  if (!files.length) return undefined;

  let start = Infinity;
  let end = 0;

  for (const f of files) {
    const data = readJson(path.join(dir, f));
    if (data.stats?.start) start = Math.min(start, Date.parse(data.stats.start));
    if (data.stats?.end) end = Math.max(end, Date.parse(data.stats.end));

    for (const root of data.results ?? []) {
      for (const test of mochaTests(root)) {
        const m = ID_RE.exec(test.title);
        if (!m) continue;
        const [, id, suite, title] = m;
        const status: Status =
          test.state === 'passed' ? 'passed' : test.state === 'failed' ? 'failed' : 'skipped';
        const entry = scenarios.get(id) ?? { id, suite: suite as 'API' | 'UI', title, results: {} };
        entry.results.cypress = {
          status,
          durationMs: test.duration ?? 0,
          retries: 0,
          error: test.err?.message ? stripAnsi(test.err.message).split('\n')[0] : undefined,
        };
        scenarios.set(id, entry);
      }
    }
  }

  const pkg = path.join(root, 'node_modules', 'cypress', 'package.json');
  return {
    version: fs.existsSync(pkg) ? (readJson(pkg).version as string) : undefined,
    wallTimeMs: end > start ? end - start : 0,
    browsers: ['electron'],
  };
}

// ---------- Merge ----------

function summarize(
  scenarios: Scenario[],
  tool: 'playwright' | 'cypress',
  meta: { wallTimeMs: number; browsers: string[] },
): Summary {
  // Playwright counts one test per browser for UI scenarios; Cypress runs once.
  const counted = scenarios.flatMap((s) => {
    const r = s.results[tool];
    if (!r) return [];
    return r.browsers ? Object.values(r.browsers) : [r];
  });
  const count = (st: Status) => counted.filter((r) => r.status === st).length;
  return {
    total: counted.length,
    passed: count('passed'),
    failed: count('failed'),
    skipped: count('skipped'),
    flaky: count('flaky'),
    testTimeMs: counted.reduce((s, r) => s + r.durationMs, 0),
    wallTimeMs: meta.wallTimeMs,
    browsers: meta.browsers,
  };
}

const scenarioMap = new Map<string, Scenario>();
const pwMeta = loadPlaywright(scenarioMap);
const cyMeta = loadCypress(scenarioMap);

const scenarios = [...scenarioMap.values()].sort((a, b) =>
  a.id.localeCompare(b.id, undefined, { numeric: true }),
);

const out = {
  generatedAt: new Date().toISOString(),
  ci: Boolean(process.env.CI),
  runUrl: process.env.GITHUB_SERVER_URL
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : undefined,
  commit: process.env.GITHUB_SHA?.slice(0, 7),
  targets: {
    ui: 'https://www.saucedemo.com',
    api: 'https://restful-booker.herokuapp.com',
  },
  tools: {
    playwright: pwMeta && { version: pwMeta.version, summary: summarize(scenarios, 'playwright', pwMeta) },
    cypress: cyMeta && { version: cyMeta.version, summary: summarize(scenarios, 'cypress', cyMeta) },
  },
  scenarios,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(out, null, 2));

const line = (name: string, t?: { summary: Summary }) =>
  t
    ? `${name.padEnd(11)} ${t.summary.passed}/${t.summary.total} passed, ${t.summary.failed} failed, ` +
      `${t.summary.flaky} flaky, wall ${(t.summary.wallTimeMs / 1000).toFixed(1)}s`
    : `${name.padEnd(11)} no results found`;
console.log(line('Playwright', out.tools.playwright));
console.log(line('Cypress', out.tools.cypress));
console.log(`Merged ${scenarios.length} scenarios -> ${path.relative(root, outFile)}`);
