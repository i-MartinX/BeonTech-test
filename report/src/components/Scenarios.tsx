import { useMemo, useState } from 'react';
import { CypressMark, PlaywrightLogo } from './Logos';
import { browserLabel, cyRun, pw, pwRun, scenarios, seconds, suiteLabel, suites } from '../lib/data';
import type { Run } from '../types';

const dot = (bad: boolean) => (bad ? 'var(--red)' : 'var(--green-deep)');

const Time = ({ tool, run }: { tool: string; run?: Run }) => (
  <span
    className={run?.status === 'failed' ? 'font-semibold' : 'soft'}
    style={run?.status === 'failed' ? { color: 'var(--red-text)' } : undefined}
  >
    {tool} {run ? (run.status === 'failed' ? 'failed' : seconds(run.durationMs)) : 'n/a'}
  </span>
);

export function Scenarios() {
  const browsers = pw.browsers.length ? pw.browsers : ['chromium'];
  const [browser, setBrowser] = useState(browsers[0]);
  const [onlyFailed, setOnlyFailed] = useState(false);

  const rows = useMemo(
    () =>
      scenarios.map((s) => {
        const p = pwRun(s, browser);
        const c = cyRun(s);
        const bad = p?.status === 'failed' || c?.status === 'failed';
        return { s, p, c, bad };
      }),
    [browser],
  );

  const inBrowser = rows.filter((r) => r.p);
  const passed = inBrowser.filter((r) => r.p!.status === 'passed').length;

  return (
    <section id="scenarios" className="field-light section">
      <h2 data-reveal className="h2 mb-[clamp(40px,6vh,80px)] max-w-[14ch] lg:max-w-none">
        Every scenario, both tools
      </h2>

      <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-3">
          <div className="lg:max-w-[520px]">
            {suites.map((suite) => {
              const group = rows.filter(({ s, bad }) => s.suite === suite && (!onlyFailed || bad));
              if (!group.length) return null;
              return (
                <div key={suite} data-reveal className="mb-10 last:mb-0">
                  <h3 className="soft m-0 mb-2 text-[length:var(--step-small)] font-semibold">
                    {suiteLabel[suite]}
                  </h3>
                  <ul className="m-0 list-none p-0">
                    {group.map(({ s, p, c, bad }) => (
                      <li
                        key={s.id}
                        className="flex items-start justify-between gap-4 py-[9px] transition-colors hover:bg-[var(--surface)]"
                      >
                        <span className="flex min-w-0 items-start gap-2 text-[length:var(--step-body)] leading-snug">
                          <span
                            role="img"
                            aria-label={bad ? 'A tool failed' : 'Both tools passed'}
                            className="mt-[0.4em] inline-block h-4 w-4 shrink-0 rounded-full"
                            style={{ background: dot(bad) }}
                          />
                          <span>{s.title}</span>
                        </span>
                        <span className="shrink-0 pt-[3px] text-right text-[length:var(--step-small)] leading-snug">
                          <Time tool="Playwright" run={p} />
                          <br />
                          <Time tool="Cypress" run={c} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {onlyFailed && !rows.some((r) => r.bad) && (
              <p className="soft m-0">Nothing failed in this run.</p>
            )}
          </div>
        </div>

        <aside
          data-reveal
          className="grid gap-x-10 gap-y-10 max-lg:order-first max-lg:mt-4 md:max-lg:grid-cols-2 lg:sticky lg:top-8 lg:col-span-4 lg:col-start-9 lg:block lg:self-start"
        >
          <div>
          <p
            className="display m-0 mb-4"
            style={{ fontSize: 'clamp(96px, 11vw, 190px)', lineHeight: 1.05 }}
            aria-live="polite"
          >
            {passed}/{inBrowser.length}
          </p>
          <p className="soft m-0 flex max-w-[34ch] items-start gap-3">
            <PlaywrightLogo h={36} alt="" />
            <span>
              Playwright checks passed on {browserLabel(browser)}. Switch browser to see its own
              results and timings in the list.
            </span>
          </p>
          </div>

          <div className="lg:mt-10">
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-3 p-0 text-[length:var(--step-body)] font-semibold">
              Playwright browser
            </legend>
            <div className="flex flex-wrap gap-2">
              {browsers.map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={browser === b}
                  onClick={() => setBrowser(b)}
                  className="btn"
                  style={
                    browser === b
                      ? { background: 'var(--blue)', color: '#fff' }
                      : { background: '#e2e5ec', color: 'var(--navy)' }
                  }
                >
                  {browserLabel(b)}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-6 flex cursor-pointer items-center gap-3 text-[length:var(--step-body)]">
            <input
              type="checkbox"
              checked={onlyFailed}
              onChange={(e) => setOnlyFailed(e.target.checked)}
              className="h-5 w-5 accent-[var(--blue)]"
            />
            Show failures only
          </label>

          <p className="soft m-0 mt-8 flex items-center gap-3 text-[length:var(--step-small)]">
            <CypressMark h={28} />
            Cypress runs once, on Electron, so its times don't change with the switch.
          </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
