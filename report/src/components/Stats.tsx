import { browserLabel, cy, pw, scenarios } from '../lib/data';

const NB = ' ';

/** A figure written into the sentence; counted up on entry. */
function Fig({ value, unit }: { value: number; unit?: string }) {
  return (
    <span className="font-semibold text-white">
      <span data-count={value} data-decimals={0}>
        {value}
      </span>
      {unit ? `${NB}${unit}` : ''}
    </span>
  );
}

export function Stats() {
  const browsers = pw.browsers.length;
  return (
    <section id="result" className="field-blue section">
      <h2 className="sr-only">The result</h2>
      <p
        data-reveal
        className="soft m-0 text-[length:var(--step-lead)] leading-[1.2] font-normal"
        style={{ maxWidth: 'min(100%, 1100px)' }}
      >
        <span>
          Playwright passed <Fig value={pw.passed} /> of <Fig value={pw.total} /> checks in{' '}
          <Fig value={browsers} unit={browsers === 1 ? 'browser' : 'browsers'} />.{' '}
        </span>
        <span>
          Cypress passed <Fig value={cy.passed} /> of <Fig value={cy.total} /> in{' '}
          {cy.browsers.map(browserLabel).join(', ')}.{' '}
        </span>
        <span>
          Same <Fig value={scenarios.length} /> scenarios, two public sites, one run.
        </span>
      </p>
    </section>
  );
}
