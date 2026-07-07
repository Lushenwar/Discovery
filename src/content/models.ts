// Showcase model definitions. Current three are Khronos glTF CC0 samples run
// through `pnpm assets` (Draco + webp) — starting assets per CLAUDE.md, to be
// replaced by Ryan's curated models when ready. All ≤ 1.5 MB post-pipeline.
export interface ShowcaseModelDef {
  slug: string;
  label: string;
  file: string;
  polyBudget: number; // target tris after decimation, ≤ 150k
  hudSpec: string;
  cameraFraming: { position: [number, number, number]; target: [number, number, number] };
}

export const showcaseModels: ShowcaseModelDef[] = [
  {
    slug: 'damaged-helmet',
    label: 'DAMAGED HELMET',
    file: '/models/damagedhelmet.glb',
    polyBudget: 20000,
    hudSpec: 'PBR · EMISSIVE · CC0 SAMPLE',
    cameraFraming: { position: [0, 0.2, 3.4], target: [0, 0, 0] },
  },
  {
    slug: 'lantern',
    label: 'LANTERN',
    file: '/models/lantern.glb',
    polyBudget: 30000,
    hudSpec: 'ARCH · METALWORK · CC0 SAMPLE',
    cameraFraming: { position: [0.6, 0.3, 3.2], target: [0, 0, 0] },
  },
  {
    slug: 'engine',
    label: 'TWIN-CYL ENGINE',
    file: '/models/engine.glb',
    polyBudget: 150000,
    hudSpec: 'CAD · MECHANICAL · CC0 SAMPLE',
    cameraFraming: { position: [-0.8, 0.4, 3.4], target: [0, 0, 0] },
  },
];
