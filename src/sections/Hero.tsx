import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollProgress } from '../scroll/useScrollProgress';
import { emitSectionEvent } from '../scroll/debugBus';
import { prefersReducedMotion } from '../lib/reducedMotion';
import { HyperText } from '../components/magicui/HyperText';
import { BlurFade } from '../components/magicui/BlurFade';
import { quality } from '../three/quality';
import { DEBUG } from '../lib/env';

export function Hero({ onInView }: { onInView: (visible: boolean) => void }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const { ref } = useScrollProgress<HTMLElement>({
    onEnter: () => {
      onInView(true);
      if (DEBUG) emitSectionEvent('hero', 'enter');
    },
    onLeave: () => {
      onInView(false);
      if (DEBUG) emitSectionEvent('hero', 'leave');
    },
    onEnterBack: () => {
      onInView(true);
      if (DEBUG) emitSectionEvent('hero', 'enterBack');
    },
  });

  // scrubbed exit: name/subhead rise and dim as the hero scrolls away
  useEffect(() => {
    const section = ref.current;
    const content = contentRef.current;
    if (!section || !content || prefersReducedMotion()) return;
    const tween = gsap.to(content, {
      y: -80,
      opacity: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom 35%', scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* declared static fallback: CSS ambience whenever HeroDepth won't render */}
      {!quality.hero3D && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 30% 30%, rgba(120,140,180,0.12), transparent), radial-gradient(ellipse 60% 45% at 70% 70%, rgba(232,230,225,0.07), transparent)',
          }}
        />
      )}
      <div ref={contentRef} className="flex flex-col items-center">
        <h1 className="font-display text-[clamp(3rem,12vw,9rem)] leading-none tracking-tight">
          <HyperText text="RYAN QI" />
        </h1>
        <BlurFade delay={0.15}>
          <p className="mt-6 text-sm tracking-[0.35em] text-bone/60 uppercase">
            The lab — experiments in 3D &amp; motion
          </p>
        </BlurFade>
      </div>
      <BlurFade delay={0.3} className="absolute bottom-10">
        <span className="text-[11px] tracking-[0.3em] text-bone/55 uppercase">Scroll</span>
      </BlurFade>
    </section>
  );
}
