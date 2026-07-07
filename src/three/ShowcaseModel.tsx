// Revives the old models.js intent (GLTFLoader + DRACO + environment + bloom
// + orbit) as idiomatic r3f/drei.
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';
import { Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Box3, Sphere, Vector3 } from 'three';
import type { ShowcaseModelDef } from '../content/models';
import { disposeSceneGraph } from '../lib/dispose';
import { quality } from './quality';
import { prefersReducedMotion } from '../lib/reducedMotion';

export function ShowcaseModel({
  model,
  orbitEl,
  progress,
}: {
  model: ShowcaseModelDef;
  orbitEl: HTMLElement | null;
  progress: RefObject<number> | null;
}) {
  const { scene } = useGLTF(model.file);
  const camera = useThree((s) => s.camera);
  const groupRef = useRef<Group>(null);
  const spin = useRef(0);

  // the model shifts on its own as the page scrolls through the section,
  // eased so it never binds 1:1 to raw scroll; orbit drag stays independent
  useFrame((_, delta) => {
    if (!groupRef.current || prefersReducedMotion()) return;
    const target = (progress?.current ?? 0.5) * Math.PI * 1.2;
    spin.current += (target - spin.current) * Math.min(delta * 3, 1);
    groupRef.current.rotation.y = spin.current;
  });

  // auto-fit: center on origin, normalize bounding sphere so every model
  // frames identically regardless of authored scale
  const fit = useMemo(() => {
    const sphere = new Box3().setFromObject(scene).getBoundingSphere(new Sphere());
    const scale = 1.4 / Math.max(sphere.radius, 1e-6);
    const offset = sphere.center.clone().multiplyScalar(-scale);
    return { scale, offset };
  }, [scene]);

  useEffect(() => {
    camera.position.set(...model.cameraFraming.position);
    camera.lookAt(new Vector3(...model.cameraFraming.target));
  }, [camera, model]);

  // dispose on model switch / section leave; verify with ?debug glmem
  useEffect(
    () => () => {
      disposeSceneGraph(scene);
      useGLTF.clear(model.file);
    },
    [scene, model.file],
  );

  return (
    <>
      <group ref={groupRef}>
        <group scale={fit.scale} position={fit.offset.toArray()}>
          <primitive object={scene} />
        </group>
      </group>

      {/* lightformer env — no runtime HDR downloads */}
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[2, 2, 3]} scale={[3, 3, 1]} />
        <Lightformer intensity={1.5} position={[-3, 1, -2]} scale={[2, 4, 1]} color="#8fa8d0" />
        <Lightformer intensity={0.8} position={[0, -3, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
      </Environment>

      <OrbitControls
        domElement={orbitEl ?? undefined}
        enabled={!!orbitEl}
        enableZoom={false}
        enablePan={false}
        target={new Vector3(...model.cameraFraming.target)}
        makeDefault
      />

      {quality.effects && (
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.85} mipmapBlur />
          <Vignette darkness={0.55} offset={0.3} />
        </EffectComposer>
      )}
    </>
  );
}
