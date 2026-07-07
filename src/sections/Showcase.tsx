import { useRef, useState } from 'react';
import { showcaseModels } from '../content/models';
import { useScrollProgress } from '../scroll/useScrollProgress';
import { emitSectionEvent } from '../scroll/debugBus';
import { DEBUG } from '../lib/env';

export interface ShowcaseState {
  inView: boolean;
  modelIndex: number;
  orbitEl: HTMLElement | null;
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
    onChange({ inView, modelIndex: index, orbitEl: orbitRef.current });
  };

  const { ref } = useScrollProgress<HTMLElement>({
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

  return (
    <section ref={ref} id="showcase" className="relative h-screen">
      {/* orbit capture surface — center band only, so edges still scroll on touch */}
      <div ref={orbitRef} className="absolute inset-x-0 top-[15%] bottom-[20%] cursor-grab active:cursor-grabbing touch-none" />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-8 md:p-12">
        <p className="text-[11px] tracking-[0.3em] text-bone/30 uppercase">
          03 — WebGL showcase · drag to orbit
        </p>

        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight">{model.label}</h2>
            <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-bone/50">
              {model.hudSpec} · ≤{Math.round(model.polyBudget / 1000)}K TRIS
            </p>
          </div>
          <div className="pointer-events-auto flex gap-2" role="group" aria-label="Switch model">
            <button
              type="button"
              onClick={() => switchModel(-1)}
              aria-label="Previous model"
              className="grid h-11 w-11 place-items-center border border-bone/30 hover:bg-bone hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => switchModel(1)}
              aria-label="Next model"
              className="grid h-11 w-11 place-items-center border border-bone/30 hover:bg-bone hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
