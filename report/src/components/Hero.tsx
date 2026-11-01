import { FitText } from './FitText';
import { dateLabel, results, scenarios } from '../lib/data';

export function Hero() {
  const failed = scenarios.some((s) =>
    [s.results.playwright?.status, s.results.cypress?.status].includes('failed'),
  );

  return (
    <header
      id="top"
      className="field-blue relative flex flex-col justify-between gap-10 lg:min-h-svh overflow-hidden px-[var(--m)] py-[var(--m)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-3 text-[length:var(--step-small)] font-semibold">
        <nav data-hero-in aria-label="Sections" className="flex gap-6">
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
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div data-hero-in className="max-w-[36ch]">
            <p className="m-0 text-[length:var(--step-lead)] leading-snug lg:text-[length:var(--step-body)]">
              A head-to-head test report. The same {scenarios.length} scenarios (API, UI and
              screenshot checks) run on both tools.
            </p>
            <a href="#scenarios" className="btn mt-4">
              {failed ? 'See what failed' : 'See every scenario'}
            </a>
          </div>
          <p data-hero-in className="m-0 text-[length:var(--step-small)]">
            Run of {dateLabel}
            {results.commit ? ` · commit ${results.commit}` : ''}
          </p>
        </div>
      </div>
    </header>
  );
}
