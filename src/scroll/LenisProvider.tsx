import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { wireScroll } from './scrollController';
import { prefersReducedMotion } from '../lib/reducedMotion';

// null = native scroll (reduced motion). Components must handle both.
const LenisContext = createContext<Lenis | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // native scroll; ScrollTrigger still works off window

    const instance = new Lenis({ autoRaf: false });
    const unwire = wireScroll(instance);
    setLenis(instance);

    return () => {
      unwire();
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
