import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/reducedMotion';

/**
 * Desktop-only custom cursor: dot + lagged ring, mix-blend exclusion, z-40.
 * Positioned via direct DOM writes on the shared gsap.ticker — no React state,
 * no extra RAF loop. Hidden < 1024px (CSS) and under reduced motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const tick = (_t: number, deltaMs: number) => {
      const k = Math.min((deltaMs / 1000) * 10, 1);
      lag.x += (pos.x - lag.x) * k;
      lag.y += (pos.y - lag.y) * k;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0) translate(-50%, -50%)`;
    };
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden lg:block" aria-hidden="true">
      <div
        ref={dotRef}
        className="absolute h-1.5 w-1.5 rounded-full bg-bone mix-blend-exclusion"
      />
      <div
        ref={ringRef}
        className="absolute h-8 w-8 rounded-full border border-bone/70 mix-blend-exclusion"
      />
    </div>
  );
}
