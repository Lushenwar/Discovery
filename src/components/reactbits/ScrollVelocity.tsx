// Adapted from React Bits ScrollVelocity (reactbits.dev, MIT) — reimplemented
// on the shared gsap.ticker + Lenis velocity so there's still one scroll
// reader. A drifting marquee that accelerates and skews with scroll speed.
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLenis } from '../../scroll/LenisProvider';
import { prefersReducedMotion } from '../../lib/reducedMotion';

export function ScrollVelocity({ text, className = '' }: { text: string; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    const tick = (_t: number, deltaMs: number) => {
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      const v = lenis?.velocity ?? 0;
      // constant drift + scroll-velocity boost, direction follows the scroll
      const speed = 40 + Math.min(Math.abs(v) * 25, 700);
      x -= (deltaMs / 1000) * speed * (v < 0 ? -1 : 1);
      x = ((x % half) + half) % half; // wrap into [0, half)
      const skew = Math.max(-10, Math.min(10, v * 0.4));
      track.style.transform = `translate3d(${-x}px, 0, 0) skewX(${skew}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [lenis, reduced]);

  const copy = `${text} — `;

  return (
    <div className={`overflow-hidden py-10 select-none ${className}`}>
      <span className="sr-only">{text}</span>
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform" aria-hidden="true">
        {(reduced ? [copy] : [copy, copy, copy, copy, copy, copy]).map((c, i) => (
          <span
            key={i}
            className="shrink-0 font-display text-4xl md:text-6xl tracking-tight text-bone/15 uppercase"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
