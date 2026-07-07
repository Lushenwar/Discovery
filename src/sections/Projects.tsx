import { lazy, Suspense, useMemo, useState } from 'react';
import { projects, type Project } from '../content/projects';
import { placeholderThumb } from '../lib/thumbs';
import { useScrollProgress } from '../scroll/useScrollProgress';
import { emitSectionEvent } from '../scroll/debugBus';
import { quality } from '../three/quality';
import { DEBUG } from '../lib/env';
import type { MenuItem } from '../components/InfiniteMenu';

// heavy OGL-style WebGL bundle stays out of the initial chunk
const InfiniteMenu = lazy(() => import('../components/InfiniteMenu'));

/**
 * Projects section: draggable WebGL sphere (mounted on approach, unmounted when
 * well past) + a semantic list fallback so the content is fully usable with a
 * keyboard or without WebGL. Selecting either path opens ProjectDetail.
 */
export function Projects({ onSelect }: { onSelect: (p: Project) => void }) {
  const [nearView, setNearView] = useState(false);

  // pre-roll: mount ~half a viewport before entry, unmount ~1 viewport after exit
  // (150% not 200% — the 80vh interstitial above would put 200% inside the initial view)
  const { ref } = useScrollProgress<HTMLElement>({
    start: 'top 150%',
    end: 'bottom -100%',
    onEnter: () => {
      setNearView(true);
      if (DEBUG) emitSectionEvent('projects', 'enter');
    },
    onLeave: () => {
      setNearView(false);
      if (DEBUG) emitSectionEvent('projects', 'leave');
    },
    onEnterBack: () => setNearView(true),
    onLeaveBack: () => setNearView(false),
  });

  const items: MenuItem[] = useMemo(
    () =>
      projects.map((p) => ({
        slug: p.slug,
        image: placeholderThumb(p),
        link: p.links[0]?.href ?? '',
        title: p.title,
        description: p.blurb,
      })),
    [],
  );

  const handleMenuSelect = (item: MenuItem) => {
    const project = projects.find((p) => p.slug === item.slug);
    if (project) onSelect(project);
  };

  return (
    <section ref={ref} id="projects" className="relative">
      {/* declared static fallback: no WebGL → the list below is the section */}
      {quality.mount3D ? (
        <div className="relative h-screen">
          {nearView && (
            <Suspense fallback={null}>
              <InfiniteMenu items={items} onSelect={handleMenuSelect} />
            </Suspense>
          )}
          <p className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.3em] text-bone/55 uppercase">
            Selected work — drag the sphere
          </p>
        </div>
      ) : (
        <p className="pt-24 pb-4 text-center text-[11px] tracking-[0.3em] text-bone/55 uppercase">
          Selected work
        </p>
      )}

      {/* Accessible path: same projects, same links, no WebGL or pointer required */}
      <nav aria-label="Projects list" className="mx-auto max-w-3xl px-6 pb-24">
        <ul className="divide-y divide-bone/10 border-y border-bone/10">
          {projects.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => onSelect(p)}
                className="group flex w-full items-baseline justify-between gap-4 py-4 text-left hover:bg-bone/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone"
              >
                <span className="font-display text-xl tracking-tight group-hover:translate-x-1 transition-transform">
                  {p.title}
                </span>
                <span className="shrink-0 text-xs text-bone/60">
                  {p.award ? `🏆 ${p.award}` : p.year}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
