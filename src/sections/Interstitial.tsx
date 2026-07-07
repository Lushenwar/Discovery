import { CharReveal } from '../components/CharReveal';

/**
 * Breathing room between GPU-heavy beats — text only, no 3D, lets the frame
 * budget recover. mix-blend-difference keeps it legible over whatever the
 * canvas has behind it (z-order contract).
 */
export function Interstitial({ text }: { text: string }) {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6">
      <CharReveal
        text={text}
        className="max-w-2xl text-center font-display text-2xl md:text-4xl leading-snug tracking-tight mix-blend-difference"
      />
    </section>
  );
}
