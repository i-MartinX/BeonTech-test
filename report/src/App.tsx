import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Compare } from './components/Compare';
import { TimeBars } from './components/TimeBars';
import { Scenarios } from './components/Scenarios';
import { Shots } from './components/Shots';
import { Reports } from './components/Reports';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Every move is transform/opacity (or a clip), and only runs when motion is welcome.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // First screen
        gsap.from('[data-hero-in]', {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.09,
          delay: 0.1,
        });
        gsap.from('[data-wordmark]', {
          yPercent: 14,
          opacity: 0,
          duration: 0.8,
          ease: 'power4.out',
        });

        // Signature move: the wordmark is heavy. It settles back as the first screen leaves,
        // and returns to full size as the footer arrives.
        gsap.to('[data-wordmark]', {
          scale: 0.94,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.fromTo(
          '[data-footer-mark]',
          { scale: 0.94 },
          {
            scale: 1,
            transformOrigin: 'left bottom',
            ease: 'none',
            scrollTrigger: { trigger: '#footer', start: 'top bottom', end: 'top 25%', scrub: true },
          },
        );

        // Parts of each section enter one after the other
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el.children.length ? Array.from(el.children) : el, {
            y: 28,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
        });

        // Figures count up
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const to = parseFloat(el.dataset.count ?? '0');
          const decimals = Number(el.dataset.decimals ?? 0);
          const state = { v: 0 };
          el.textContent = (0).toFixed(decimals);
          gsap.to(state, {
            v: to,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              el.textContent = state.v.toFixed(decimals);
            },
            onComplete: () => {
              el.textContent = to.toFixed(decimals);
            },
          });
        });

        // Bars draw in
        gsap.utils.toArray<HTMLElement>('[data-bar]').forEach((bar) => {
          gsap.from(bar, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: bar, start: 'top 88%', once: true },
          });
        });

        // The two giant figures rise into their frames
        gsap.from('[data-spec] .display', {
          yPercent: 30,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '#compare', start: 'top 55%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <main ref={root}>
      <Hero />
      <Stats />
      <Compare />
      <TimeBars />
      <Scenarios />
      <Shots />
      <Reports />
      <Footer />
    </main>
  );
}
