// Adapted from Magic UI TextReveal (magicui.design, MIT) — reimplemented on
// this site's single ScrollTrigger pipeline instead of framer useScroll, so
// there is still exactly one scroll reader. Word-by-word reveal inside a
// pinned (sticky) viewport. Reduced motion: static, fully legible.
import { useMemo } from 'react';
import { useScrollProgress } from '../../scroll/useScrollProgress';
import { prefersReducedMotion } from '../../lib/reducedMotion';

export function TextReveal({ text, className = '' }: { text: string; className?: string }) {
  const reduced = prefersReducedMotion();
  const words = useMemo(() => text.split(' '), [text]);

  const { ref } = useScrollProgress<HTMLElement>({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (p) => {
      const el = ref.current;
      if (!el || reduced) return;
      const spans = el.querySelectorAll<HTMLElement>('[data-word]');
      const total = spans.length;
      spans.forEach((span, i) => {
        const t = Math.min(Math.max((p * (total + 2) - i) * 0.8, 0.1), 1);
        span.style.opacity = String(t);
      });
    },
  });

  return (
    <section ref={ref} className="relative h-[250vh]" aria-label={text}>
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <p className={className} aria-hidden="true">
          {words.map((w, i) => (
            <span key={i} data-word className="inline-block" style={{ opacity: reduced ? 1 : 0.1 }}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
