import { FitText } from './FitText';
import { BeonMark, CypressWordmark, PlaywrightLogo } from './Logos';
import { dateLabel, results, scenarios } from '../lib/data';

export function Hero() {
  const failed = scenarios.some((s) =>
    [s.results.playwright?.status, s.results.cypress?.status].includes('failed'),
  );

  return (
    <header
      id="top"
      className="field-navy relative flex flex-col justify-between gap-10 overflow-hidden px-[var(--m)] py-[var(--m)] lg:min-h-svh"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 text-[length:var(--step-small)] font-semibold">
        <div data-hero-in className="flex items-center gap-6">
          <BeonMark h={40} />
          <nav aria-label="Sections" className="flex gap-6">
            <a className="link" href="#result">
              Result
            </a>
            <a className="link" href="#scenarios">
              Scenarios
            </a>
            <a className="link" href="#pixels">
              Pixels
            </a>
          </nav>
        </div>
        <nav data-hero-in aria-label="Reports" className="flex gap-6">
          <a className="link" href="#reports">
            Native reports
          </a>
          <a className="link" href={results.runUrl ?? '#reports'}>
            GitHub run
          </a>
        </nav>
      </div>

      <div>
        <div data-wordmark>
          <FitText as="h1" lines={['Playwright', 'vs Cypress']} />
        </div>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div data-hero-in className="max-w-[36ch]">
            <p className="m-0 text-[length:var(--step-lead)] leading-snug lg:text-[length:var(--step-body)]">
              A head-to-head test report. The same {scenarios.length} scenarios (API, UI and
              screenshot checks) run on both tools.
            </p>
            <a href="#scenarios" className="btn mt-4">
              {failed ? 'See what failed' : 'See every scenario'}
            </a>
          </div>
          <div data-hero-in className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex items-center gap-6">
              <PlaywrightLogo h={72} />
              <CypressWordmark h={44} />
            </div>
            <p className="m-0 text-[length:var(--step-small)]">
              Run of {dateLabel}
              {results.commit ? ` · commit ${results.commit}` : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
