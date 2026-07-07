import { useRef, useState, type RefObject } from 'react';
import { showcaseModels } from '../content/models';
import { useScrollProgress } from '../scroll/useScrollProgress';
import { emitSectionEvent } from '../scroll/debugBus';
import { quality } from '../three/quality';
import { Magnet } from '../components/reactbits/Magnet';
import { DEBUG } from '../lib/env';

export interface ShowcaseState {
  inView: boolean;
  modelIndex: number;
  orbitEl: HTMLElement | null;
  /** live section progress (0→1) so the model shifts on its own with scroll */
  progress: RefObject<number> | null;
}

/**
 * DOM half of the 3D showcase: HUD label/spec, model switcher, and the orbit
 * capture surface. The r3f half (ShowcaseModel) renders in the shared Scene,
 * driven by the state this section reports up.
 */
export function Showcase({ onChange }: { onChange: (s: ShowcaseState) => void }) {
  const [modelIndex, setModelIndex] = useState(0);
  const inViewRef = useRef(false);
  const orbitRef = useRef<HTMLDivElement>(null);

  const report = (inView: boolean, index = modelIndex) => {
    inViewRef.current = inView;
    onChange({ inView, modelIndex: index, orbitEl: orbitRef.current, progress });
  };

  const { ref, progress } = useScrollProgress<HTMLElement>({
    start: 'top 150%',
    end: 'bottom -50%',
    onEnter: () => {
      report(true);
      if (DEBUG) emitSectionEvent('showcase', 'enter');
    },
    onLeave: () => {
      report(false);
      if (DEBUG) emitSectionEvent('showcase', 'leave');
    },
    onEnterBack: () => report(true),
    onLeaveBack: () => report(false),
  });

  const model = showcaseModels[modelIndex];
  const switchModel = (dir: 1 | -1) => {
    const next = (modelIndex + dir + showcaseModels.length) % showcaseModels.length;
    setModelIndex(next);
    report(inViewRef.current, next);
  };

  // declared static fallback: no WebGL → typographic spec panel, no broken layout
  if (!quality.mount3D) {
    return (
      <section id="showcase" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[11px] tracking-[0.3em] text-bone/55 uppercase">03 — WebGL showcase</p>
        <h2 className="font-display text-3xl tracking-tight">Interactive 3D lives here</h2>
        <p className="max-w-sm text-sm text-bone/60">
          Your browser has WebGL disabled, so the model viewer is skipped. Everything else works.
        </p>
      </section>
    );
  }

  return (
    <section ref={ref} id="showcase" className="relative h-screen">
      {/* orbit capture surface — center band only, so edges still scroll on touch */}
      <div ref={orbitRef} className="absolute inset-x-0 top-[15%] bottom-[20%] cursor-grab active:cursor-grabbing touch-none" />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-8 md:p-12">
        <p className="text-[11px] tracking-[0.3em] text-bone/55 uppercase">
          03 — WebGL showcase · drag to orbit
        </p>

        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight">{model.label}</h2>
            <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-bone/60">
              {model.hudSpec} · ≤{Math.round(model.polyBudget / 1000)}K TRIS
            </p>
          </div>
          <div className="pointer-events-auto flex gap-2" role="group" aria-label="Switch model">
            <Magnet strength={0.4}>
              <button
                type="button"
                onClick={() => switchModel(-1)}
                aria-label="Previous model"
                className="grid h-11 w-11 place-items-center border border-bone/30 hover:bg-bone hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone"
              >
                ‹
              </button>
            </Magnet>
            <Magnet strength={0.4}>
              <button
                type="button"
                onClick={() => switchModel(1)}
                aria-label="Next model"
                className="grid h-11 w-11 place-items-center border border-bone/30 hover:bg-bone hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone"
              >
                ›
              </button>
            </Magnet>
          </div>
        </div>
      </div>
    </section>
  );
}
