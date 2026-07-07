import { useState } from 'react';
import { LenisProvider } from './scroll/LenisProvider';
import { Scene } from './three/Scene';
import { HeroDepth } from './three/HeroDepth';
import { SampleModelProbe } from './three/SampleModelProbe';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { DebugHud } from './components/DebugHud';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { ProjectDetail } from './sections/ProjectDetail';
import { PlaceholderSection } from './sections/PlaceholderSection';
import { DEBUG } from './lib/env';
import type { Project } from './content/projects';

// Remaining placeholders — replaced phase by phase.
const SECTIONS = [
  { id: 'showcase', label: 'Showcase — coming in Phase 4' },
  { id: 'interstitial', label: 'Interstitial — coming in Phase 5' },
  { id: 'outro', label: 'Outro — coming in Phase 5' },
];

export default function App() {
  const [probeMounted, setProbeMounted] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <LenisProvider>
      <Preloader />
      <Scene>
        {heroInView && <HeroDepth />}
        {DEBUG && probeMounted && <SampleModelProbe />}
      </Scene>

      <main className="relative z-10">
        <Hero onInView={setHeroInView} />
        <Projects onSelect={setSelectedProject} />
        {SECTIONS.map((s) => (
          <PlaceholderSection key={s.id} id={s.id} label={s.label} />
        ))}
      </main>

      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />

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
