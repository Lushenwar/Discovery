// The single source for the reduced-motion decision. Everything imports from here.
const query = window.matchMedia('(prefers-reduced-motion: reduce)');

// ?reduce forces the reduced path so it can be exercised without flipping OS settings
const forced = new URLSearchParams(window.location.search).has('reduce');

export function prefersReducedMotion(): boolean {
  return forced || query.matches;
}

export function onReducedMotionChange(cb: (reduced: boolean) => void): () => void {
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}
