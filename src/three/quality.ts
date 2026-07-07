// One quality decision for the whole app. No component hardcodes its own tier logic.
export type QualityTier = 'low' | 'mid' | 'high';

export interface QualityProfile {
  tier: QualityTier;
  /** DPR ceiling for every canvas. Never exceed 2. */
  dprCap: number;
  /** Whether postprocessing passes (bloom, vignette) run at all. */
  effects: boolean;
  /** Particle budget for ambient fields. */
  particleCount: number;
  /** Whether 3D sections mount at all (false → declared static fallbacks). */
  mount3D: boolean;
  /** Hero depth field: desktop-only. Touch devices get the CSS ambience and
   * load three.js only when a 3D section approaches — keeps mobile TTI clean. */
  hero3D: boolean;
  isTouch: boolean;
}

function webgl2Available(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

export function detectQuality(): QualityProfile {
  // maxTouchPoints catches emulated/mobile environments where pointer:coarse doesn't
  const isTouch =
    window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const cores = navigator.hardwareConcurrency ?? 4;
  const dpr = window.devicePixelRatio ?? 1;

  let tier: QualityTier = 'high';
  if (isTouch || cores <= 4) tier = 'mid';
  if (isTouch && (cores <= 4 || dpr >= 3)) tier = 'low';

  const profiles: Record<QualityTier, Omit<QualityProfile, 'isTouch' | 'mount3D' | 'hero3D'>> = {
    high: { tier: 'high', dprCap: 2, effects: true, particleCount: 2000 },
    mid: { tier: 'mid', dprCap: 1.5, effects: true, particleCount: 800 },
    low: { tier: 'low', dprCap: 1, effects: false, particleCount: 300 },
  };

  // no WebGL2 → every 3D section swaps to its static fallback; DOM must stand alone
  const mount3D = webgl2Available();

  return { ...profiles[tier], isTouch, mount3D, hero3D: mount3D && !isTouch };
}

export const quality = /* evaluated once at boot */ detectQuality();
