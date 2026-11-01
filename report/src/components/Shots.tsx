import { useEffect, useRef } from 'react';
import { CypressWordmark, PlaywrightLogo } from './Logos';
import { asset, scenarios } from '../lib/data';

export function Shots() {
  const clip = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // Keep the loop still for people who ask for less motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) clip.current?.pause();
  }, []);
  const visual = scenarios.filter((s) => s.suite === 'VISUAL' && s.shots);
  return (
    <section id="pixels" className="field-blue section">
      <div data-reveal className="grid gap-x-10 gap-y-6 md:grid-cols-12">
        <h2 className="h2 md:col-span-6">Pixel checks, headless</h2>
        <p className="m-0 max-w-[48ch] text-[length:var(--step-body)] md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          Each scenario takes a screenshot at 1280 × 720 and compares it with a stored baseline. A
          difference of more than 1% of the pixels fails the run. Playwright has this built in;
          Cypress needed a small pixelmatch task. These are the baselines both tools compare
          against.
        </p>
      </div>

      <figure data-reveal className="m-0 mt-[clamp(56px,9vh,120px)]">
        <video
          ref={clip}
          src={asset('checkout-demo.webm')}
          poster={asset('shots/pw-order-complete.png')}
          width={960}
          height={540}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Playwright running the checkout scenario headless"
          className="block h-auto w-full"
        />
        <figcaption className="mt-3 text-[length:var(--step-small)]">
          The checkout scenario as Playwright runs it, recorded headless.
        </figcaption>
      </figure>

      <div className="mt-[clamp(56px,9vh,120px)] grid gap-[clamp(56px,9vh,120px)]">
        {visual.map((s) => (
          <article key={s.id} data-reveal>
            <h3 className="m-0 mb-4 text-[length:var(--step-lead)] leading-snug font-semibold">
              {s.title.replace(' matches the baseline', '')}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {(['playwright', 'cypress'] as const).map((tool) => {
                const src = s.shots?.[tool];
                const run = s.results[tool];
                return (
                  <figure key={tool} className="m-0">
                    {src && (
                      <img
                        src={asset(src)}
                        alt={`${tool === 'playwright' ? 'Playwright' : 'Cypress'} baseline: ${s.title}`}
                        width={1280}
                        height={720}
                        loading="lazy"
                        className="block h-auto w-full"
                      />
                    )}
                    <figcaption className="mt-3 flex items-center gap-3 text-[length:var(--step-small)]">
                      {tool === 'playwright' ? (
                        <PlaywrightLogo h={28} alt="" />
                      ) : (
                        <CypressWordmark h={20} alt="" />
                      )}
                      <span>
                        {tool === 'playwright' ? 'Playwright · Chromium' : 'Cypress · Electron'} ·{' '}
                        {run?.status ?? 'not run'}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
