// Adapted from React Bits Noise (reactbits.dev, MIT) — animated film grain.
// One tiny tile canvas refreshed ~8fps, stretched over the viewport at low
// opacity. Static single frame under reduced motion.
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

const TILE = 128;

export function Noise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const image = ctx.createImageData(TILE, TILE);

    const refresh = () => {
      const d = image.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    refresh();
    if (prefersReducedMotion()) return;
    const id = setInterval(refresh, 125);
    return () => clearInterval(id);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={TILE}
      height={TILE}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-[0.05] mix-blend-overlay [image-rendering:pixelated]"
    />
  );
}
