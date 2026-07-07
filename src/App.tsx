import { useState } from 'react';
import { LenisProvider } from './scroll/LenisProvider';
import { Scene } from './three/Scene';
import { SampleModelProbe } from './three/SampleModelProbe';
import { Preloader } from './components/Preloader';
import { DebugHud } from './components/DebugHud';
import { PlaceholderSection } from './sections/PlaceholderSection';
import { DEBUG } from './lib/env';

// The section rhythm. Real sections replace these placeholders phase by phase.
const SECTIONS = [
  { id: 'hero', label: 'Hero — coming in Phase 2' },
  { id: 'projects', label: 'Projects — coming in Phase 3' },
  { id: 'showcase', label: 'Showcase — coming in Phase 4' },
  { id: 'interstitial', label: 'Interstitial — coming in Phase 5' },
  { id: 'outro', label: 'Outro — coming in Phase 5' },
];

export default function App() {
  const [probeMounted, setProbeMounted] = useState(false);

  return (
    <LenisProvider>
      <Preloader />
      <Scene>{DEBUG && probeMounted && <SampleModelProbe />}</Scene>

      <main className="relative z-10">
        {SECTIONS.map((s) => (
          <PlaceholderSection key={s.id} id={s.id} label={s.label} />
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
