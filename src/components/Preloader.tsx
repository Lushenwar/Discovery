import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

/**
 * z-50 gate over everything until three.js loaders settle.
 * Fades out once progress hits 100 and holds a short minimum so it never flashes.
 */
export function Preloader() {
  const { progress, active } = useProgress();
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // key off `active`, not progress — with zero queued assets progress stays 0
    if (active) return;
    const t = setTimeout(() => setDone(true), 400); // min dwell, avoids a 1-frame flash
    return () => clearTimeout(t);
  }, [active, progress]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 700); // matches the CSS fade
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink transition-opacity duration-700 ${
        done ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={done}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs tracking-[0.3em] text-bone/60 uppercase">Vitrine</span>
        <div className="h-px w-40 bg-bone/20 overflow-hidden">
          <div
            className="h-full bg-bone transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
