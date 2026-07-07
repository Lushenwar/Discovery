import { useMemo } from 'react';
import { useScrollProgress } from '../scroll/useScrollProgress';
import { prefersReducedMotion } from '../lib/reducedMotion';

/**
 * Per-character scroll-opacity reveal (the Prisma reference mechanic).
 * Characters rise from low opacity to full as section progress passes their
 * index. Direct DOM writes on ScrollTrigger updates — no React state per tick.
 * Reduced motion: text renders statically, fully legible.
 */
export function CharReveal({ text, className = '' }: { text: string; className?: string }) {
  const reduced = prefersReducedMotion();

  const { ref } = useScrollProgress<HTMLParagraphElement>({
    start: 'top 80%',
    end: 'center 45%',
    onUpdate: (p) => {
      const el = ref.current;
      if (!el || reduced) return;
      const spans = el.querySelectorAll<HTMLElement>('[aria-hidden]');
      const total = spans.length;
      for (let i = 0; i < total; i++) {
        // stagger by charIndex/total mapped onto section progress, soft edge
        const t = Math.min(Math.max((p * total - i) * 0.6 + 0.15, 0.12), 1);
        spans[i].style.opacity = String(t);
      }
    },
  });

  const chars = useMemo(() => text.split(''), [text]);

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {chars.map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ opacity: reduced ? 1 : 0.12 }}>
          {ch}
        </span>
      ))}
    </p>
  );
}
