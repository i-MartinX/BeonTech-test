import { FitText } from './FitText';
import { dateLabel, results } from '../lib/data';

export function Footer() {
  return (
    <footer
      id="footer"
      className="field-black relative flex min-h-[90svh] flex-col justify-between overflow-hidden px-[var(--m)] pt-[clamp(72px,10vw,160px)]"
    >
      <div className="grid gap-x-10 gap-y-12 md:grid-cols-12">
        <ul className="m-0 flex list-none flex-col gap-3 p-0 md:col-span-5">
          {[
            ['Playwright report', './native/playwright/index.html'],
            ['Cypress report', './native/cypress/index.html'],
            ['GitHub run', results.runUrl ?? '#reports'],
          ].map(([label, href]) => (
            <li key={label}>
              <a
                className="link text-[length:var(--step-lead)] font-semibold"
                style={{ color: 'var(--green)' }}
                href={href}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="grid gap-6 text-[length:var(--step-small)] sm:grid-cols-2 md:col-span-6 md:col-start-7">
          <p className="m-0">
            UI tests run against {results.targets.ui.replace('https://', '')}.
            <br />
            API tests run against {results.targets.api.replace('https://', '')}.
          </p>
          <p className="m-0">
            Generated {dateLabel}
            {results.commit ? ` from commit ${results.commit}` : ''}.
            <br />
            <a className="link font-semibold" href="#top">
              Back to top
            </a>
          </p>
        </div>
      </div>

      <div data-footer-mark className="pt-24" style={{ marginBottom: '-0.04em' }}>
        <FitText lines={['Playwright', 'vs Cypress']} maxVh={0.3} />
      </div>
    </footer>
  );
}
