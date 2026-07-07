import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ScrollTrigger } from '../scroll/scrollController';
import { onSectionEvent, type SectionEvent } from '../scroll/debugBus';

/**
 * ?debug corner panel: smoothed page progress, section enter/leave log,
 * sample-GLB mount/dispose toggle.
 */
export function DebugHud({
  onToggleModel,
  modelMounted,
  children,
}: {
  onToggleModel: () => void;
  modelMounted: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [events, setEvents] = useState<SectionEvent[]>([]);

  useEffect(() => {
    // reads the Lenis-smoothed value through ScrollTrigger — not window.scrollY
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (progressRef.current) progressRef.current.textContent = self.progress.toFixed(4);
      },
    });
    const off = onSectionEvent((e) => setEvents((prev) => [e, ...prev].slice(0, 6)));
    return () => {
      st.kill();
      off();
    };
  }, []);

  return (
    <div className="fixed top-2 right-2 z-50 font-mono text-[11px] text-bone/80">
      <button
        className="block ml-auto px-2 py-1 bg-ink/80 border border-bone/20 hover:bg-bone/10"
        onClick={() => setOpen(!open)}
      >
        dbg
      </button>
      {open && (
        <div className="mt-1 p-2 space-y-2 bg-ink/90 border border-bone/20 min-w-52">
          <div>
            scroll <span ref={progressRef}>0.0000</span>
          </div>
          <button
            className="w-full px-2 py-1 border border-bone/30 hover:bg-bone/10 text-left"
            onClick={onToggleModel}
          >
            sample GLB: {modelMounted ? 'unmount (dispose)' : 'mount'}
          </button>
          {events.length > 0 && (
            <ul className="space-y-0.5 text-bone/50">
              {events.map((e) => (
                <li key={e.at}>
                  {e.section} · {e.event}
                </li>
              ))}
            </ul>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
