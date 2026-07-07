import { useEffect, useRef, type RefObject } from 'react';
import { ScrollTrigger } from './scrollController';

export interface ScrollProgressOptions {
  /** ScrollTrigger start/end, default: section visible range ('top bottom' → 'bottom top') */
  start?: string;
  end?: string;
  onUpdate?: (progress: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Section-local 0→1 scroll progress. Reads the Lenis-smoothed value via
 * ScrollTrigger — never window.scrollY. Returns a ref to attach to the section
 * element and a live progress ref (no React re-renders per scroll tick).
 * Options are captured on mount; callbacks are kept fresh via a ref.
 */
export function useScrollProgress<T extends HTMLElement>(
  options: ScrollProgressOptions = {},
): { ref: RefObject<T | null>; progress: RefObject<number> } {
  const ref = useRef<T>(null);
  const progress = useRef(0);
  const opts = useRef(options);
  opts.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: opts.current.start ?? 'top bottom',
      end: opts.current.end ?? 'bottom top',
      onUpdate: (self) => {
        progress.current = self.progress;
        opts.current.onUpdate?.(self.progress);
      },
      onEnter: () => opts.current.onEnter?.(),
      onLeave: () => opts.current.onLeave?.(),
      onEnterBack: () => opts.current.onEnterBack?.(),
      onLeaveBack: () => opts.current.onLeaveBack?.(),
    });
    return () => st.kill();
  }, []);

  return { ref, progress };
}
