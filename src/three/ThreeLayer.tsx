// Lazy entry for everything that touches three.js. Keeping this behind one
// dynamic import keeps the ~357KB-gzip three chunk off the critical path —
// the DOM paints first, the canvas streams in behind it.
import { Scene } from './Scene';
import { HeroDepth } from './HeroDepth';
import { ShowcaseModel } from './ShowcaseModel';
import { SampleModelProbe } from './SampleModelProbe';
import { showcaseModels } from '../content/models';
import { DEBUG } from '../lib/env';
import type { ShowcaseState } from '../sections/Showcase';

export default function ThreeLayer({
  heroInView,
  showcase,
  probeMounted,
}: {
  heroInView: boolean;
  showcase: ShowcaseState;
  probeMounted: boolean;
}) {
  return (
    <Scene>
      {heroInView && <HeroDepth />}
      {showcase.inView && (
        <ShowcaseModel
          model={showcaseModels[showcase.modelIndex]}
          orbitEl={showcase.orbitEl}
          progress={showcase.progress}
        />
      )}
      {DEBUG && probeMounted && <SampleModelProbe />}
    </Scene>
  );
}
