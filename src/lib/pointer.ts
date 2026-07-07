// One smoothed-pointer source. Raw pointer position is normalized to -1..1
// with a dead zone at viewport center (±5% of width, min 30px) so nothing
// jitters at rest. Consumers ease toward `pointerTarget` — never bind 1:1.
export const pointerTarget = { x: 0, y: 0, active: false };

let wired = false;

export function initPointer() {
  if (wired) return;
  wired = true;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return; // touch gets auto-drift, not parallax
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dead = Math.max(w * 0.05, 30);
      const dx = e.clientX - w / 2;
      const dy = e.clientY - h / 2;
      // subtract the dead zone then renormalize — smooth ramp, no snap at the edge
      const norm = (d: number, half: number) =>
        Math.sign(d) * (Math.max(0, Math.abs(d) - dead) / Math.max(half - dead, 1));
      pointerTarget.x = norm(dx, w / 2);
      pointerTarget.y = norm(dy, h / 2);
      pointerTarget.active = true;
    },
    { passive: true },
  );

  window.addEventListener('pointerleave', () => {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
  });
}
