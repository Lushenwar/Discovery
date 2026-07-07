import { useState, type ReactNode } from 'react';

/**
 * ?debug corner panel. Phase 0: sample-GLB mount/dispose toggle.
 * Phase 1 adds the scroll progress readout.
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

  return (
    <div className="fixed top-2 right-2 z-50 font-mono text-[11px] text-bone/80">
      <button
        className="block ml-auto px-2 py-1 bg-ink/80 border border-bone/20 hover:bg-bone/10"
        onClick={() => setOpen(!open)}
      >
        dbg
      </button>
      {open && (
        <div className="mt-1 p-2 space-y-2 bg-ink/90 border border-bone/20 min-w-44">
          <button
            className="w-full px-2 py-1 border border-bone/30 hover:bg-bone/10 text-left"
            onClick={onToggleModel}
          >
            sample GLB: {modelMounted ? 'unmount (dispose)' : 'mount'}
          </button>
          {children}
        </div>
      )}
    </div>
  );
}
