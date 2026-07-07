import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor, Preload, StatsGl } from '@react-three/drei';
import { quality } from './quality';
import { DEBUG } from '../lib/env';

/** ?debug only: logs GPU resource counts so leaks are visible in the console. */
function GlMemLogger() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const id = setInterval(() => {
      const mem = JSON.stringify(gl.info.memory);
      console.log('[glmem]', mem);
      document.documentElement.dataset.glmem = mem; // readable from extension isolated world
    }, 1000);
    return () => clearInterval(id);
  }, [gl]);
  return null;
}

/** Marks the canvas dead if the WebGL context is lost and not restored. */
function ContextLossGuard({ onLost }: { onLost: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    const handler = (e: Event) => {
      e.preventDefault();
      console.warn('[vitrine] WebGL context lost — falling back to DOM-only');
      onLost();
    };
    el.addEventListener('webglcontextlost', handler);
    return () => el.removeEventListener('webglcontextlost', handler);
  }, [gl, onLost]);
  return null;
}

/**
 * The single r3f canvas: fixed full-viewport, behind the DOM (z-0),
 * pointer-events off by default (sections opt in via their own overlays).
 * Skipped entirely when WebGL2 is unavailable; degrades DPR under load;
 * unmounts itself on unrecovered context loss (the DOM stands alone).
 */
export function Scene({ children }: { children?: ReactNode }) {
  const [dprMax, setDprMax] = useState(quality.dprCap);
  const [dead, setDead] = useState(false);

  if (!quality.mount3D || dead) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, dprMax]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <PerformanceMonitor
          onDecline={() => setDprMax(1)}
          onIncline={() => setDprMax(quality.dprCap)}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />
          <Suspense fallback={null}>{children}</Suspense>
          <Preload all />
        </PerformanceMonitor>
        <ContextLossGuard onLost={() => setDead(true)} />
        {DEBUG && <StatsGl className="!absolute !top-auto !bottom-2 !left-2" />}
        {DEBUG && <GlMemLogger />}
      </Canvas>
    </div>
  );
}
