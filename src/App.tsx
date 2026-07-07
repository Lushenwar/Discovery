import { useState } from 'react';
import { LenisProvider } from './scroll/LenisProvider';
import { Scene } from './three/Scene';
import { SampleModelProbe } from './three/SampleModelProbe';
import { Preloader } from './components/Preloader';
import { DebugHud } from './components/DebugHud';
import { DEBUG } from './lib/env';

// Placeholder scroll length so Lenis has something to smooth. Real sections land in Phase 1+.
const PLACEHOLDER_SECTIONS = ['HERO', 'PROJECTS', 'SHOWCASE', 'OUTRO'];

export default function App() {
  const [probeMounted, setProbeMounted] = useState(false);

  return (
    <LenisProvider>
      <Preloader />
      <Scene>{DEBUG && probeMounted && <SampleModelProbe />}</Scene>

      <main className="relative z-10">
        {PLACEHOLDER_SECTIONS.map((label) => (
          <section key={label} className="flex h-screen items-center justify-center">
            <span className="text-xs tracking-[0.4em] text-bone/30 uppercase">{label} — coming in later phases</span>
          </section>
        ))}
      </main>

      {DEBUG && (
        <DebugHud
          modelMounted={probeMounted}
          onToggleModel={() => setProbeMounted((m) => !m)}
        />
      )}
    </LenisProvider>
  );
}
