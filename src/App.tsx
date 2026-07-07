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
import { Showcase, type ShowcaseState } from './sections/Showcase';
import { ShowcaseModel } from './three/ShowcaseModel';
import { Interstitial } from './sections/Interstitial';
import { TextReveal } from './components/magicui/TextReveal';
import { Outro } from './sections/Outro';
import { showcaseModels } from './content/models';
import { DEBUG } from './lib/env';
import type { Project } from './content/projects';

export default function App() {
  const [probeMounted, setProbeMounted] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showcase, setShowcase] = useState<ShowcaseState>({
    inView: false,
    modelIndex: 0,
    orbitEl: null,
  });

  return (
    <LenisProvider>
      <Preloader />
      <Scene>
        {heroInView && <HeroDepth />}
        {showcase.inView && (
          <ShowcaseModel model={showcaseModels[showcase.modelIndex]} orbitEl={showcase.orbitEl} />
        )}
        {DEBUG && probeMounted && <SampleModelProbe />}
      </Scene>

      <main className="relative z-10">
        <Hero onInView={setHeroInView} />
        <Interstitial text="One scroll value. One RAF. Sixty frames. Every mechanic on this page is hand-built and budgeted — the restraint lives on the main site; this is where the craft shows off." />
        <Projects onSelect={setSelectedProject} />
        <Showcase onChange={setShowcase} />
        <TextReveal
          text="Built to be inspected."
          className="max-w-3xl text-center font-display text-4xl md:text-6xl leading-tight tracking-tight mix-blend-difference"
        />
        <Outro />
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
