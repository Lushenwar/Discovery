// The single source for the reduced-motion decision. Everything imports from here.
const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export function prefersReducedMotion(): boolean {
  return query.matches;
}

export function onReducedMotionChange(cb: (reduced: boolean) => void): () => void {
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}
