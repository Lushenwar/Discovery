import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Group } from 'three';
import { disposeSceneGraph } from '../lib/dispose';

const URL = '/models/duck.glb';

/**
 * Dev-only probe (mounted via the ?debug HUD) proving the Phase 0 exit criterion:
 * a Draco-compressed GLB loads, renders, and disposes cleanly on unmount.
 */
export function SampleModelProbe() {
  const { scene } = useGLTF(URL);

  useEffect(() => {
    return () => {
      disposeSceneGraph(scene);
      useGLTF.clear(URL); // drop drei's cache so GPU memory actually returns
    };
  }, [scene]);

  return <primitive object={scene as Group} position={[0, -1, 0]} scale={1.2} />;
}
