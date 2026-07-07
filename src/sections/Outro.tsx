import { Magnet } from '../components/reactbits/Magnet';

const MAIN_SITE = 'https://ryanqiportfolio.vercel.app';

/**
 * Closing panel: frames Vitrine as the deliberate experiment and routes
 * back to the clean site — one clear CTA, per the two-site relationship.
 */
export function Outro() {
  return (
    <section id="outro" className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center">
      <p className="max-w-md text-sm leading-relaxed text-bone/60">
        Vitrine is the lab — an experiment in 3D, motion, and creative engineering,
        built to be inspected. For the facts-fast version — projects, résumé, contact —
        head back to the main site.
      </p>

      <Magnet strength={0.3}>
        <a
          href={MAIN_SITE}
          className="group block border border-bone/40 px-8 py-4 font-display text-lg tracking-tight transition-colors hover:bg-bone hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-bone"
        >
          ryanqiportfolio.vercel.app
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
        </a>
      </Magnet>

      <footer className="mt-16 flex gap-6 text-[11px] tracking-[0.25em] text-bone/55 uppercase">
        <span>Ryan Qi</span>
        <span>·</span>
        <span>Vitrine — the lab</span>
      </footer>
    </section>
  );
}
