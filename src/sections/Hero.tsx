import { useScrollProgress } from '../scroll/useScrollProgress';
import { emitSectionEvent } from '../scroll/debugBus';
import { HyperText } from '../components/magicui/HyperText';
import { BlurFade } from '../components/magicui/BlurFade';
import { DEBUG } from '../lib/env';

export function Hero({ onInView }: { onInView: (visible: boolean) => void }) {
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

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
    >
      <h1 className="font-display text-[clamp(3rem,12vw,9rem)] leading-none tracking-tight">
        <HyperText text="RYAN QI" />
      </h1>
      <BlurFade delay={0.15}>
        <p className="mt-6 text-sm tracking-[0.35em] text-bone/60 uppercase">
          The lab — experiments in 3D &amp; motion
        </p>
      </BlurFade>
      <BlurFade delay={0.3} className="absolute bottom-10">
        <span className="text-[11px] tracking-[0.3em] text-bone/30 uppercase">Scroll</span>
      </BlurFade>
    </section>
  );
}
