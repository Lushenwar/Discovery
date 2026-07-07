import { lazy, Suspense, useEffect, useState } from 'react';
import { LenisProvider } from './scroll/LenisProvider';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { DebugHud } from './components/DebugHud';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Showcase, type ShowcaseState } from './sections/Showcase';
import { Interstitial } from './sections/Interstitial';
import { TextReveal } from './components/magicui/TextReveal';
import { ScrollVelocity } from './components/reactbits/ScrollVelocity';
import { ClickSpark } from './components/reactbits/ClickSpark';
import { Noise } from './components/reactbits/Noise';
import { Outro } from './sections/Outro';
import { quality } from './three/quality';
import { DEBUG } from './lib/env';
import type { Project } from './content/projects';

// the entire three.js stack loads after first paint, never blocking it
const ThreeLayer = lazy(() => import('./three/ThreeLayer'));
// motion lib rides along only when a detail panel first opens
const ProjectDetail = lazy(() =>
  import('./sections/ProjectDetail').then((m) => ({ default: m.ProjectDetail })),
);

export default function App() {
  const [probeMounted, setProbeMounted] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // once the detail chunk has loaded, keep it mounted so exit animations play
  const [detailLoaded, setDetailLoaded] = useState(false);
  const openProject = (p: Project) => {
    setDetailLoaded(true);
    setSelectedProject(p);
  };
  const [showcase, setShowcase] = useState<ShowcaseState>({
    inView: false,
    modelIndex: 0,
    orbitEl: null,
    progress: null,
  });

  // three.js loads after first paint: desktop at idle, touch only when a 3D
  // section actually approaches — mobile TTI never pays the three parse cost
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (!quality.mount3D) return;
    const go = () => setIdle(true);
    if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 1500 });
    else setTimeout(go, 300);
  }, []);
  const want3D = quality.mount3D && idle && (quality.hero3D || showcase.inView);

  return (
    <LenisProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Preloader />
      {want3D && (
        <Suspense fallback={null}>
          <ThreeLayer
            heroInView={quality.hero3D && heroInView}
            showcase={showcase}
            probeMounted={probeMounted}
          />
        </Suspense>
      )}

      <main id="main" className="relative z-10">
        <Hero onInView={setHeroInView} />
        <Interstitial text="One scroll value. One RAF. Sixty frames. Every mechanic on this page is hand-built and budgeted — the restraint lives on the main site; this is where the craft shows off." />
        <Projects onSelect={openProject} />
        <ScrollVelocity text="Real WebGL — hand-built — sixty frames" />
        <Showcase onChange={setShowcase} />
        <TextReveal
          text="Built to be inspected."
          className="max-w-3xl text-center font-display text-4xl md:text-6xl leading-tight tracking-tight mix-blend-difference"
        />
        <Outro />
      </main>

      {detailLoaded && (
        <Suspense fallback={null}>
          <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
        </Suspense>
      )}

      <Noise />
      <ClickSpark />
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
