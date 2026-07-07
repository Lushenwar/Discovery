import { useEffect, useState } from 'react';

// gate on fonts only, hard-capped — the hero text is the first beat and the
// canvas streams in behind it, so nothing heavy holds first paint hostage
const MAX_WAIT_MS = 800;

/**
 * z-50 gate until fonts settle (or the cap hits). Three-free on purpose —
 * importing drei here would drag three.js back into the critical chunk.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    document.fonts.ready.then(() => setDone(true));
    const trickle = setInterval(() => setProgress((p) => Math.min(p + 9, 88)), 100);
    const cap = setTimeout(() => setDone(true), MAX_WAIT_MS);
    return () => {
      clearInterval(trickle);
      clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    setProgress(100);
    const t = setTimeout(() => setGone(true), 500); // matches the CSS fade
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink transition-opacity duration-500 ${
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
