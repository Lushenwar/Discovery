// Adapted from Magic UI HyperText (magicui.design, MIT) — trimmed to this
// site's needs: scramble-in on mount, monotone, reduced-motion aware.
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function HyperText({
  text,
  className = '',
  durationMs = 900,
}: {
  text: string;
  className?: string;
  durationMs?: number;
}) {
  // paint at full size immediately (LCP) — scramble is a transform, not a delay
  const [display, setDisplay] = useState(() =>
    prefersReducedMotion()
      ? text
      : text.replace(/[^ ]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
  );
  const raf = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const settled = Math.floor(p * text.length);
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (i < settled || ch === ' ') return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(''),
      );
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, durationMs]);

  return (
    <span className={className} aria-label={text}>
      {display || ' '}
    </span>
  );
}
