import { Suspense, useEffect, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, StatsGl } from '@react-three/drei';
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

/**
 * The single r3f canvas: fixed full-viewport, behind the DOM (z-0),
 * pointer-events off by default (sections opt in later).
 */
export function Scene({ children }: { children?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, quality.dprCap]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Suspense fallback={null}>{children}</Suspense>
        {DEBUG && <StatsGl className="!absolute !top-auto !bottom-2 !left-2" />}
        {DEBUG && <GlMemLogger />}
      </Canvas>
    </div>
  );
}
