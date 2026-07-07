import { useState } from 'react';
import { LenisProvider } from './scroll/LenisProvider';
import { Scene } from './three/Scene';
import { HeroDepth } from './three/HeroDepth';
import { SampleModelProbe } from './three/SampleModelProbe';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { DebugHud } from './components/DebugHud';
import { Hero } from './sections/Hero';
import { PlaceholderSection } from './sections/PlaceholderSection';
import { DEBUG } from './lib/env';

// Remaining placeholders — replaced phase by phase.
const SECTIONS = [
  { id: 'projects', label: 'Projects — coming in Phase 3' },
  { id: 'showcase', label: 'Showcase — coming in Phase 4' },
  { id: 'interstitial', label: 'Interstitial — coming in Phase 5' },
  { id: 'outro', label: 'Outro — coming in Phase 5' },
];

export default function App() {
  const [probeMounted, setProbeMounted] = useState(false);
  const [heroInView, setHeroInView] = useState(true);

  return (
    <LenisProvider>
      <Preloader />
      <Scene>
        {heroInView && <HeroDepth />}
        {DEBUG && probeMounted && <SampleModelProbe />}
      </Scene>

      <main className="relative z-10">
        <Hero onInView={setHeroInView} />
        {SECTIONS.map((s) => (
          <PlaceholderSection key={s.id} id={s.id} label={s.label} />
        ))}
      </main>

      <Cursor />

      {DEBUG && (
        <DebugHud
          modelMounted={probeMounted}
          onToggleModel={() => setProbeMounted((m) => !m)}
        />
      )}
    </LenisProvider>
  );
}
