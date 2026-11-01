import { asset } from '../lib/data';
import { CYPRESS_MARK_PATH } from './cypress-mark-path';

// Official artwork, used unmodified to identify each product.
// Pass alt="" when a text label next to the logo already names it.

export function PlaywrightLogo({ h = 40, alt = 'Playwright' }: { h?: number; alt?: string }) {
  return (
    <img
      src={asset('brand/playwright-logo.svg')}
      alt={alt}
      width={h}
      height={h}
      style={{ height: h, width: h }}
      className="block shrink-0"
    />
  );
}

/** The official Cypress wordmark is white: use it on dark or blue grounds. */
export function CypressWordmark({ h = 32, alt = 'Cypress' }: { h?: number; alt?: string }) {
  return (
    <img
      src={asset('brand/cypress-wordmark-white.svg')}
      alt={alt}
      width={Math.round(h * 2.48)}
      height={h}
      style={{ height: h, width: 'auto' }}
      className="block shrink-0"
    />
  );
}

/** The Cypress mark in the surrounding text colour: use it on light grounds. */
export function CypressMark({ h = 40, label }: { h?: number; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={h}
      height={h}
      fill="currentColor"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="block shrink-0"
    >
      <path d={CYPRESS_MARK_PATH} />
    </svg>
  );
}

export function BeonMark({ h = 40 }: { h?: number }) {
  return (
    <img
      src={asset('brand/beon-mark.svg')}
      alt="BEON.tech"
      width={h}
      height={h}
      style={{ height: h, width: 'auto' }}
      className="block shrink-0"
    />
  );
}

/** Full lockup: its lettering is dark, so it needs a light ground. */
export function BeonWordmark({ h = 56 }: { h?: number }) {
  return (
    <img
      src={asset('brand/beon-wordmark.webp')}
      alt="BEON.tech"
      width={Math.round(h * 3.09)}
      height={h}
      style={{ height: h, width: 'auto' }}
      className="block shrink-0"
    />
  );
}
