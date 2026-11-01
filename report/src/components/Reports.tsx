import { results } from '../lib/data';

const rows = [
  {
    tool: 'Playwright',
    inside: 'Every test in every browser, with traces and screenshots for failures.',
    label: 'Open the HTML report',
    href: './native/playwright/index.html',
  },
  {
    tool: 'Cypress',
    inside: 'Every spec with its test steps and errors, as a mochawesome report.',
    label: 'Open the HTML report',
    href: './native/cypress/index.html',
  },
  {
    tool: 'GitHub Actions',
    inside: 'The workflow run that produced this page, with artifacts to download.',
    label: results.runUrl ? 'Open the run' : 'Available once run in CI',
    href: results.runUrl,
  },
  {
    tool: 'Raw data',
    inside: 'The merged results this page is built from.',
    label: 'Open results.json',
    href: './results.json',
  },
];

export function Reports() {
  return (
    <section id="reports" className="field-blue section">
      <h2 data-reveal className="h2" style={{ maxWidth: '8ch' }}>
        Native reports
      </h2>
      <div data-reveal className="mt-[clamp(40px,6vh,72px)]">
        <table className="w-full border-collapse text-left text-[length:var(--step-body)] max-md:block">
          <thead className="sr-only">
            <tr>
              <th>Source</th>
              <th>What is inside</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {rows.map((r, i) => (
              <tr
                key={r.tool}
                className="max-md:block max-md:py-3"
                style={i % 2 ? undefined : { background: '#1220a6' }}
              >
                <th scope="row" className="py-[14px] pr-4 pl-4 font-semibold max-md:block max-md:py-0 md:w-[22%]">
                  {r.tool}
                </th>
                <td className="py-[14px] pr-4 max-md:block max-md:py-1 max-md:pl-4">{r.inside}</td>
                <td className="py-[14px] pr-4 text-right md:whitespace-nowrap max-md:block max-md:py-0 max-md:pl-4 max-md:text-left">
                  {r.href ? (
                    <a className="link font-semibold" href={r.href}>
                      {r.label}
                    </a>
                  ) : (
                    <span className="soft">{r.label}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
