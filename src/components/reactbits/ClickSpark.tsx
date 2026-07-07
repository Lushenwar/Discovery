// Adapted from React Bits ClickSpark (reactbits.dev, MIT) — radiating spark
// lines on pointerdown, drawn on a fixed overlay canvas. The rAF loop runs
// only while sparks are alive; nothing idles.
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

interface Spark {
  x: number;
  y: number;
  angle: number;
  start: number;
}

const DURATION = 450;
const COUNT = 8;
const RADIUS = 26;
const LENGTH = 9;

export function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const sparks: Spark[] = [];
    let raf = 0;
    let running = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const t = (now - s.start) / DURATION;
        if (t >= 1) {
          sparks.splice(i, 1);
          continue;
        }
        const eased = 1 - Math.pow(1 - t, 3);
        const dist = eased * RADIUS;
        const len = LENGTH * (1 - eased);
        ctx.strokeStyle = `rgba(232,230,225,${1 - t})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x + Math.cos(s.angle) * dist, s.y + Math.sin(s.angle) * dist);
        ctx.lineTo(s.x + Math.cos(s.angle) * (dist + len), s.y + Math.sin(s.angle) * (dist + len));
        ctx.stroke();
      }
      if (sparks.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const onDown = (e: PointerEvent) => {
      const start = performance.now();
      for (let i = 0; i < COUNT; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (Math.PI * 2 * i) / COUNT, start });
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    window.addEventListener('pointerdown', onDown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[45]"
      aria-hidden="true"
    />
  );
}
