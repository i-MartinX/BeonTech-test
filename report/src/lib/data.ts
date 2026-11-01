import raw from '../data/results.json';
import type { Results, Run, Scenario, Suite } from '../types';

export const results = raw as unknown as Results;
export const scenarios: Scenario[] = results.scenarios;

const empty = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  flaky: 0,
  testTimeMs: 0,
  wallTimeMs: 0,
  browsers: [] as string[],
};
export const pw = results.tools.playwright?.summary ?? empty;
export const cy = results.tools.cypress?.summary ?? empty;

export const suiteLabel: Record<Suite, string> = { API: 'API', UI: 'UI', VISUAL: 'Visual' };
export const suites: Suite[] = ['API', 'UI', 'VISUAL'];

export const browserLabel = (b: string) =>
  ({ chromium: 'Chromium', firefox: 'Firefox', webkit: 'WebKit', electron: 'Electron' })[b] ?? b;

/** Playwright's run for a scenario in one browser (API scenarios have no browser). */
export function pwRun(s: Scenario, browser: string): Run | undefined {
  const r = s.results.playwright;
  return r?.browsers?.[browser] ?? (r?.browsers ? undefined : r);
}

export const cyRun = (s: Scenario): Run | undefined => s.results.cypress;

export const seconds = (ms: number, digits = 1) => `${(ms / 1000).toFixed(digits)}s`;

/** Durations as words, for the proportional bars. */
export function inWords(ms: number) {
  const s = ms / 1000;
  if (s < 1) return 'Under 1 second';
  if (s < 90) return `${Math.round(s)} seconds`;
  return `${Math.round(s / 60)} minutes`;
}

export function median(values: number[]) {
  if (!values.length) return 0;
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

/** Like-for-like comparison: Playwright on Chromium against Cypress on Electron. */
export const likeForLike = {
  pwMedianMs: median(scenarios.map((s) => pwRun(s, 'chromium')?.durationMs ?? 0)),
  cyMedianMs: median(scenarios.map((s) => cyRun(s)?.durationMs ?? 0)),
  suiteMs(tool: 'playwright' | 'cypress', suite: Suite) {
    return scenarios
      .filter((s) => s.suite === suite)
      .reduce(
        (sum, s) =>
          sum + ((tool === 'playwright' ? pwRun(s, 'chromium') : cyRun(s))?.durationMs ?? 0),
        0,
      );
  },
};

export const dateLabel = new Date(results.generatedAt).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const asset = (rel: string) => `${import.meta.env.BASE_URL}${rel}`;
