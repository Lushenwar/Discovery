import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Project } from '../content/projects';
import { prefersReducedMotion } from '../lib/reducedMotion';

/**
 * Accent-themed detail panel for a selected project. Motion-driven entrance,
 * Esc / backdrop / button to close, focus moves in on open and back out on close.
 */
export function ProjectDetail({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  const reduced = prefersReducedMotion();

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-30 flex items-end justify-center md:items-center"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            aria-label="Close project details"
            onClick={onClose}
          />
          <motion.article
            className="relative m-4 w-full max-w-xl border bg-ink p-8 md:p-10"
            style={{ borderColor: project.media.accent }}
            initial={reduced ? false : { y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: 24, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 id="project-detail-title" className="font-display text-4xl tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs tracking-[0.25em] uppercase" style={{ color: project.media.accent }}>
                  {project.role} · {project.year}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-10 w-10 shrink-0 place-items-center border border-bone/30 text-bone hover:bg-bone hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone"
              >
                ×
              </button>
            </header>

            {project.award && (
              <p className="mt-4 inline-block border px-3 py-1 text-xs" style={{ borderColor: project.media.accent }}>
                🏆 {project.award}
              </p>
            )}

            <p className="mt-5 text-sm leading-relaxed text-bone/80">{project.detail}</p>

            {project.stack.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
                {project.stack.map((t) => (
                  <li key={t} className="border border-bone/20 px-2 py-0.5 text-[11px] text-bone/60">
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 flex gap-4">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-bone/40 pb-0.5 text-sm text-bone hover:border-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
