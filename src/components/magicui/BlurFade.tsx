// Adapted from Magic UI BlurFade (magicui.design, MIT) — Motion-based
// blur+rise entrance, instant under reduced motion.
import { motion } from 'motion/react';
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
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
