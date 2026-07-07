import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires the one-and-only RAF chain: gsap.ticker drives lenis.raf, lenis's
 * scroll event drives ScrollTrigger.update. No other scroll readers exist.
 * Returns a teardown function.
 */
export function wireScroll(lenis: Lenis): () => void {
  const onScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onScroll);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.off('scroll', onScroll);
    gsap.ticker.remove(tick);
  };
}

export { ScrollTrigger };
