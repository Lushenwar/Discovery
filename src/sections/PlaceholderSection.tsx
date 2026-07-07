import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollProgress } from '../scroll/useScrollProgress';
import { prefersReducedMotion } from '../lib/reducedMotion';
import { emitSectionEvent } from '../scroll/debugBus';
import { DEBUG } from '../lib/env';

/**
 * Stand-in section establishing the Phase 1 rhythm: declares its ScrollTrigger
 * via useScrollProgress and scrubs its label in. Real sections (Phases 2–5)
 * replace these one by one, keeping the same declaration pattern.
 */
export function PlaceholderSection({ id, label }: { id: string; label: string }) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const { ref } = useScrollProgress<HTMLElement>({
    onEnter: () => DEBUG && emitSectionEvent(id, 'enter'),
    onLeave: () => DEBUG && emitSectionEvent(id, 'leave'),
    onEnterBack: () => DEBUG && emitSectionEvent(id, 'enterBack'),
    onLeaveBack: () => DEBUG && emitSectionEvent(id, 'leaveBack'),
  });

  useEffect(() => {
    const section = ref.current;
    const el = labelRef.current;
    if (!section || !el) return;
    if (prefersReducedMotion()) return; // label renders statically, fully legible

    const tween = gsap.fromTo(
      el,
      { opacity: 0.1, y: 48 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top 85%', end: 'center 55%', scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={ref} id={id} className="flex h-screen items-center justify-center">
      <span ref={labelRef} className="text-xs tracking-[0.4em] text-bone/40 uppercase">
        {label}
      </span>
    </section>
  );
}
