import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
  Group,
} from 'three';
import { quality } from './quality';
import { pointerTarget, initPointer } from '../lib/pointer';
import { prefersReducedMotion } from '../lib/reducedMotion';

initPointer();

/** Soft radial-gradient sprite texture, generated once — no asset download. */
function makeGlowTexture(stops: [string, string]): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, stops[0]);
  g.addColorStop(1, stops[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new CanvasTexture(c);
}

function ParticleField({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const pos: number[] = [];
    for (let i = 0; i < count; i++) {
      pos.push((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, -1 - Math.random() * 5);
    }
    geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  // prop-passed objects aren't auto-disposed by r3f
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.015}
        sizeAttenuation
        color="#e8e6e1"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Layered hero depth: a particle slab + glow planes at staggered z, the whole
 * group eased toward the dead-zoned pointer target. Touch devices get a slow
 * auto-drift instead; reduced motion renders the composition static.
 */
export function HeroDepth() {
  const group = useRef<Group>(null);
  const smooth = useRef({ x: 0, y: 0 });
  const reduced = prefersReducedMotion();

  const glowWarm = useMemo(() => makeGlowTexture(['rgba(232,230,225,0.28)', 'rgba(232,230,225,0)']), []);
  const glowCool = useMemo(() => makeGlowTexture(['rgba(120,140,180,0.22)', 'rgba(120,140,180,0)']), []);

  // prop-passed textures aren't auto-disposed by r3f
  useEffect(
    () => () => {
      glowWarm.dispose();
      glowCool.dispose();
    },
    [glowWarm, glowCool],
  );

  useFrame(({ clock }, delta) => {
    if (!group.current || reduced) return;

    const t = clock.elapsedTime;
    const target =
      quality.isTouch || !pointerTarget.active
        ? { x: Math.sin(t * 0.12) * 0.25, y: Math.cos(t * 0.09) * 0.18 } // gentle auto-drift
        : pointerTarget;

    // ease toward target — never 1:1 with the raw pointer (jitter trap)
    const k = Math.min(delta * 2.5, 1);
    smooth.current.x += (target.x - smooth.current.x) * k;
    smooth.current.y += (target.y - smooth.current.y) * k;

    group.current.rotation.y = smooth.current.x * 0.08;
    group.current.rotation.x = -smooth.current.y * 0.05;
    // per-child parallax factor: deeper layers move more
    group.current.children.forEach((child, i) => {
      const f = 0.15 + i * 0.12;
      child.position.x = smooth.current.x * -f;
      child.position.y = smooth.current.y * f * 0.6;
    });
  });

  return (
    <group ref={group}>
      <ParticleField count={Math.max(quality.particleCount, 200)} />
      <mesh position={[-2.2, 1.2, -4]}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial map={glowCool} transparent blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[2.6, -1.4, -3]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial map={glowWarm} transparent blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.4, 0.6, -2]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={glowCool} transparent opacity={0.6} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
