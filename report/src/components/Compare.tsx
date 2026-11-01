import { CypressMark, PlaywrightLogo } from './Logos';
import { likeForLike, seconds } from '../lib/data';

/** Two giant figures compared, cut by the section's bottom edge. */
function Specimen({
  value,
  caption,
  logo,
}: {
  value: string;
  caption: string;
  logo: React.ReactNode;
}) {
  return (
    <div data-spec style={{ containerType: 'inline-size' }}>
      {/* Sized from the column, so the figure always fits; the bottom edge cuts it */}
      <div className="overflow-hidden" style={{ height: 'min(23cqw, 320px)' }}>
        <div
          className="display"
          style={{ fontSize: 'min(32cqw, 440px)', lineHeight: 0.8 }}
          aria-label={`${value} median per scenario`}
        >
          {value.replace(/s$/, '')}
          <span>s</span>
        </div>
      </div>
      <p className="m-0 mt-4 flex items-center gap-3 text-[length:var(--step-body)] font-semibold">
        {logo}
        {caption}
      </p>
    </div>
  );
}

export function Compare() {
  return (
    <section id="compare" className="field-light section" style={{ paddingBottom: 0 }}>
      <div
        data-reveal
        className="grid gap-x-10 gap-y-6 md:grid-cols-12"
        style={{ marginBottom: 'clamp(48px, 8vh, 120px)' }}
      >
        <h2 className="h2 md:col-span-6">Median time per scenario</h2>
        <p className="m-0 max-w-[48ch] text-[length:var(--step-body)] md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          Like for like: Playwright on Chromium against Cypress on Electron, headless, same
          scenarios, same two public sites. It is one run over the internet, so network time is
          most of what you see here. Read it as a ballpark, not a benchmark.
        </p>
      </div>
      <div data-reveal className="grid gap-x-10 gap-y-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <Specimen
            value={seconds(likeForLike.pwMedianMs)}
            caption="Playwright · Chromium · median per scenario"
            logo={<PlaywrightLogo h={44} alt="" />}
          />
        </div>
        <div className="md:col-span-6">
          <Specimen
            value={seconds(likeForLike.cyMedianMs)}
            caption="Cypress · Electron · median per scenario"
            logo={<CypressMark h={40} />}
          />
        </div>
      </div>
    </section>
  );
}
