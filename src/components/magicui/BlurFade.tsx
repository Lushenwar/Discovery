// Adapted from Magic UI BlurFade (magicui.design, MIT) — reimplemented as a
// CSS keyframe animation so the hero's first paint doesn't need the motion
// library. Instant under reduced motion.
import type { ReactNode } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

export function BlurFade({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div className={`blur-fade ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
