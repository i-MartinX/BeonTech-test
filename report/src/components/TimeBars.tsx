import { inWords, likeForLike, scenarios, suiteLabel, suites } from '../lib/data';
import type { Suite } from '../types';

const look: Record<Suite, { bg: string; ink: string }> = {
  API: { bg: '#f7dd47', ink: '#000' },
  UI: { bg: '#000', ink: '#fff' },
  VISUAL: { bg: '#e9479f', ink: '#000' },
};

const count = (s: Suite) => scenarios.filter((x) => x.suite === s).length;
const clause: Record<Suite, string> = {
  API: `${count('API')} calls to Restful-Booker, no browser involved.`,
  UI: `${count('UI')} SauceDemo journeys in a real browser.`,
  VISUAL: `${count('VISUAL')} screenshots compared with the stored baselines.`,
};

function Bar({ tool, label }: { tool: 'playwright' | 'cypress'; label: string }) {
  const parts = suites.map((s) => ({ suite: s, ms: likeForLike.suiteMs(tool, s) }));
  const total = parts.reduce((n, p) => n + p.ms, 0);
  return (
    <div data-reveal className="mb-20 last:mb-0">
      <p className="mt-0 mb-4 text-[length:var(--step-lead)] font-semibold">
        {label} · {inWords(total)} in total
      </p>
      <div>
        <div
          data-ui
          data-bar
          className="flex min-h-[60svh] flex-col gap-[6px] md:min-h-[clamp(120px,22vh,200px)] md:flex-row"
        >
          {parts.map(({ suite, ms }) => (
            <div
              key={suite}
              className="seg p-5 md:min-w-[24%]"
              style={{
                ['--g' as string]: ms,
                background: look[suite].bg,
                color: look[suite].ink,
              }}
            >
              <span className="block text-[length:var(--step-body)] font-semibold">
                {suiteLabel[suite]}
              </span>
              <span className="block text-[length:var(--step-body)] leading-tight">
                {inWords(ms)}
              </span>
              <span className="mt-2 block text-[length:var(--step-small)] leading-snug md:hidden">
                {clause[suite]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 hidden gap-[6px] md:flex">
          {parts.map(({ suite, ms }) => (
            <p
              key={suite}
              className="seg m-0 pr-4 text-[length:var(--step-body)] leading-snug md:min-w-[24%]"
              style={{ ['--g' as string]: ms }}
            >
              {clause[suite]}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TimeBars() {
  return (
    <section id="time" className="field-blue section">
      <h2 data-reveal className="h2 mb-[clamp(48px,8vh,96px)]">
        Where the time went
      </h2>
      <Bar tool="playwright" label="Playwright on Chromium" />
      <Bar tool="cypress" label="Cypress on Electron" />
    </section>
  );
}
