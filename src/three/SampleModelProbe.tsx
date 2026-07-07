import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Texture, type Group, type Mesh, type Material } from 'three';

const URL = '/models/duck.glb';

/**
 * Dev-only probe (mounted via the ?debug HUD) proving the Phase 0 exit criterion:
 * a Draco-compressed GLB loads, renders, and disposes cleanly on unmount.
 */
export function SampleModelProbe() {
  const { scene } = useGLTF(URL);

  useEffect(() => {
    return () => {
      scene.traverse((obj) => {
        const mesh = obj as Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m: Material) => {
            // material.dispose() does NOT free its texture maps — walk them explicitly
            Object.values(m).forEach((v) => {
              if (v instanceof Texture) v.dispose();
            });
            m.dispose();
          });
        }
      });
      useGLTF.clear(URL); // drop drei's cache so GPU memory actually returns
    };
  }, [scene]);

  return <primitive object={scene as Group} position={[0, -1, 0]} scale={1.2} />;
}
