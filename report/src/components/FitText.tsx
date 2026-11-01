import { useLayoutEffect, useRef } from 'react';

/**
 * Sets the text as large as the container's width allows (longest line spans the full width),
 * capped by a share of the viewport height so two lines never outgrow the first screen.
 */
export function FitText({
  lines,
  maxVh = 0.36,
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
        widest = Math.max(widest, l.getBoundingClientRect().width);
      });
      if (!widest) return;
      const byWidth = (100 * el.clientWidth) / widest;
      el.style.fontSize = `${Math.floor(Math.min(byWidth, window.innerHeight * maxVh))}px`;
    };

    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lines, maxVh]);

  return (
    <Tag ref={box} className={`display m-0 ${className}`}>
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
