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
  /** Whether heavy 3D sections mount at all (false → static fallback). */
  mount3D: boolean;
  isTouch: boolean;
}

// ponytail: coarse heuristic tiering; refine with drei PerformanceMonitor feedback in Phase 6
export function detectQuality(): QualityProfile {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const dpr = window.devicePixelRatio ?? 1;

  let tier: QualityTier = 'high';
  if (isTouch || cores <= 4) tier = 'mid';
  if (isTouch && (cores <= 4 || dpr >= 3)) tier = 'low';

  const profiles: Record<QualityTier, Omit<QualityProfile, 'isTouch'>> = {
    high: { tier: 'high', dprCap: 2, effects: true, particleCount: 2000, mount3D: true },
    mid: { tier: 'mid', dprCap: 1.5, effects: true, particleCount: 800, mount3D: true },
    low: { tier: 'low', dprCap: 1, effects: false, particleCount: 0, mount3D: true },
  };

  return { ...profiles[tier], isTouch };
}

export const quality = /* evaluated once at boot */ detectQuality();
