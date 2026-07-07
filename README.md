# Vitrine — "the lab"

Ryan Qi's experimental, 3D-forward portfolio. Single page, scroll-driven, deliberately maximal.
The clean, content-first portfolio lives at [ryanqiportfolio.vercel.app](https://ryanqiportfolio.vercel.app) — this site is the flex. See `claude.md` for the full build spec.

## Stack

React 19 · TypeScript · Vite 6 · Tailwind v4 · three / @react-three/fiber / drei / postprocessing · Lenis · GSAP ScrollTrigger · Motion

## Develop

```sh
pnpm install
pnpm dev          # http://localhost:5173  (append ?debug for the perf HUD)
pnpm build        # typecheck + production build
pnpm lint
```

## Asset pipeline

Source models go in `assets-src/models/*.glb` (any size); shipped models live in `public/models/` and are Draco-compressed with webp textures:

```sh
pnpm assets       # optimizes every GLB in assets-src/models → public/models, fails if any output > 1.5 MB
```

Equivalent manual command: `pnpm exec gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp --texture-size 1024`.

Section textures ship as KTX2 (Basis). Encoding requires the `toktx` binary from [KTX-Software](https://github.com/KhronosGroup/KTX-Software/releases):
`toktx --genmipmap --bcmp out.ktx2 in.png`. Draco/Basis decoders load from drei's default CDN at runtime.

## Workflow

No direct commits to `main` (a pre-commit hook enforces this). Branch per phase: `git checkout -b <phase>/<slug>`, PR via `gh pr create`. Before any PR: `pnpm build` and `pnpm lint` clean, dev server renders without console errors.
