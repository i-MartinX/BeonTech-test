import { useLayoutEffect, useRef } from 'react';

/**
 * Sets the text as large as the container's width allows (longest line spans the full width),
 * capped by a share of the viewport height so two lines never outgrow the first screen.
 */
export function FitText({
  lines,
  maxVh = 0.34,
  className = '',
  as: Tag = 'div',
}: {
  lines: string[];
  maxVh?: number;
  className?: string;
  as?: 'div' | 'h1';
}) {
  const box = useRef<HTMLDivElement & HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = '100px';
      let widest = 0;
      el.querySelectorAll<HTMLElement>('[data-line]').forEach((l) => {
        // offsetWidth is the layout width: unlike getBoundingClientRect it ignores GSAP's scale
        widest = Math.max(widest, l.offsetWidth);
      });
      if (!widest) return;
      const byWidth = (100 * el.clientWidth) / widest;
      el.style.fontSize = `${Math.floor(Math.min(byWidth, window.innerHeight * maxVh))}px`;
    };

    fit();
    // The size depends on the web font's metrics: fit again when it arrives.
    document.fonts?.load('800 100px "Plus Jakarta Sans"').then(fit, fit);
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener('loadingdone', fit);
    // Also when the text itself changes width (font swap) or the container does.
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    el.querySelectorAll('[data-line]').forEach((l) => ro.observe(l));
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener('loadingdone', fit);
    };
  }, [lines, maxVh]);

  return (
    <Tag ref={box} className={`display m-0 ${className}`} style={{ lineHeight: 1.06 }}>
      {lines.map((l, i) => (
        <span key={l}>
          {i > 0 && ' '}
          <span data-line className="block w-max whitespace-nowrap">
            {l}
          </span>
        </span>
      ))}
    </Tag>
  );
}
