// ?debug only: lets sections report enter/leave events to the HUD without prop drilling.
export interface SectionEvent {
  section: string;
  event: 'enter' | 'leave' | 'enterBack' | 'leaveBack';
  at: number;
}

const listeners = new Set<(e: SectionEvent) => void>();

export function emitSectionEvent(section: string, event: SectionEvent['event']) {
  const e = { section, event, at: performance.now() };
  listeners.forEach((l) => l(e));
}

export function onSectionEvent(cb: (e: SectionEvent) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
