# CLAUDE.md — Vitrine

> Codename: **Vitrine** (a glass display case). Public framing: **"the lab."**
> This is Ryan Qi's second, experimental portfolio — the one whose *entire job is to
> demonstrate frontend and creative-engineering craft*. It is deliberately separate from
> the clean, content-first main site at `ryanqiportfolio.vercel.app`. That site stays the
> recruiter/fellowship default. Vitrine is the flex.

---

## WORKFLOW: BRANCH + PR ONLY

No direct commits to `main`. Every change goes: `git checkout -b <phase>/<slug>` → commit → `gh pr create`. Keep the same discipline as Steward. A pre-commit hook (`.git/hooks/pre-commit`) rejects commits made while on `main`. One PR per phase minimum; smaller PRs within a phase are fine and encouraged for the 3D work, which is easy to break.

Before opening a PR, the working tree must run clean: `pnpm build` succeeds, `pnpm lint` passes, and the dev server renders the phase's target without console errors or WebGL context-lost warnings.

---

## CURRENT STATUS

```
╔══════════════════════════════════════════════════════════╗
║  BUILD PROGRESS                                 8/8 DONE  ║
║  ██████████████████████████  LIVE                          ║
║  Phase 0: Foundation, tooling & asset pipeline  [DONE]   ║
║  Phase 1: Scroll spine (Lenis + GSAP + orchestr) [DONE]  ║
║  Phase 2: Hero — 3D depth + cursor mechanics     [DONE]  ║
║  Phase 3: Projects — Infinite Menu + detail view [DONE]  ║
║  Phase 4: 3D showcase (revive models.js → r3f)   [DONE]  ║
║  Phase 5: Interstitials & text mechanics         [DONE]  ║
║  Phase 6: Performance, mobile fallback, a11y     [DONE]* ║
║  Phase 7: Deploy & wire to main site             [DONE]* ║
╚══════════════════════════════════════════════════════════╝
```

Phase: 7 DEPLOYED 2026-07-07 — live at https://vitrine-alpha-tan.vercel.app (Vercel project lushenwars-projects/vitrine, GitHub-connected: push to main auto-deploys). Verified: 200 OK, GLB cache headers active. Polish pass shipped (PR #10): React Bits ScrollVelocity/Magnet/ClickSpark/Noise + scroll-driven sphere & showcase rotation. *Still Ryan's: custom domain (lab.ryanqi… vs /lab), main-site cross-link (separate repo), real-device check, real project thumbs, optional own GLBs. Phase 6 note stands: Lighthouse Perf 72 vs ≥85 (structural, no-SSR); A11y 100.
Status: In progress. NOTES: (1) project thumbs are generated placeholders — replace with real screenshots; (2) FixMyFeed 'finalist' claim not on Devpost, omitted; (3) showcase models are CC0 samples flagged for replacement with Ryan's own. Update this block as each phase's exit criterion is met, exactly like Steward. Do not mark a phase DONE until its exit criterion is verified against a running dev server (or the live URL for Phase 7), not just "the code compiles."

---

## WHAT THIS FILE IS

This is the authoritative guide for building Vitrine. Every architectural decision, phase boundary, asset budget, and constraint here is binding. Do not deviate without explicit user approval. When a requested feature conflicts with the **performance budget** or the **danger zones**, stop and confirm before building — on this site, a beautiful thing that drops frames is a failure, not a feature.

---

## PRODUCT DEFINITION

Vitrine is a single-page, scroll-driven, 3D-forward portfolio experience. Its purpose is to be *itself a portfolio piece*: proof that Ryan can design and engineer a premium interactive site. The mechanics are the content. There is nothing to "bury" here — the point is the craft.

### What Vitrine IS:

* A curated, near-static showcase of a **hand-picked** set of projects (not every project — the best 5–7), presented through 3D and motion.
* A demonstration reel of specific mechanics: cursor-reactive hero, a draggable WebGL project sphere, scroll-linked 3D camera/scene transitions, and expressive typographic animation.
* A self-contained SPA. No backend, no database, no auth, no CMS. All content is compiled in from a typed content file.
* An intentional companion to the clean main site, linked both ways, clearly framed as an experiment / lab so it reads as *deliberate range* ("I can go maximal, and I chose restraint on my main site"), never as "didn't know when to stop."

### What Vitrine IS NOT:

* **Not** the primary portfolio. Recruiters who want facts fast go to the clean site. Vitrine never becomes the canonical source of Ryan's project list or résumé.
* **Not** an e-commerce or fashion template. It borrows *mechanics* from the prmpt reference (cursor-scrubbed media, panel reveals, scale-on-scroll gallery) but carries **none** of its commerce shell — no price, no cart, no "add to cart," no product/SKU framing. Strip all of that.
* **Not** a content-management surface. Adding a project is a code edit to one typed file, on purpose. It is a showreel, not a database. Do not build an admin panel.
* **Not** a place for un-budgeted 3D. Every 3D element must justify its frame cost. "It looks cool" is necessary but not sufficient; it must also hold 60fps on a mid-tier laptop and degrade cleanly on a phone.

### How It Works (the visitor's journey):

1. **Land:** A preloader resolves assets, then a cursor-reactive 3D hero fades in — layered depth, parallax on pointer, Ryan's name rendered with an expressive Magic UI text effect.
2. **Descend:** A single scroll spine (Lenis) drives everything. Scroll scrubs camera moves, scene transitions, and panel reveals. No native scrolljank; no scroll *event* soup — a RAF loop reads one smoothed scroll value.
3. **Explore:** The projects section is a draggable WebGL sphere (React Bits Infinite Menu). Grabbing a face brings a project forward; selecting it opens a detail transition.
4. **Inspect:** A dedicated 3D showcase revives the dormant `models.js` viewer (GLB + bloom + orbit) as a proper react-three-fiber scene — a literal "here is real WebGL I control" moment.
5. **Exit:** Interstitial typographic moments (scroll-linked character reveals) and a closing panel with a single clear CTA back to the main site / contact.

---

## SCOPE CONSTRAINTS

### In scope (MVP):

* One route, one continuous scroll experience. `/` is the whole site.
* A curated `projects` array (5–7 entries) defined in `src/content/projects.ts`. Suggested set, to be confirmed by Ryan: **Eco-Pulse**, **LOCATR**, **BlackSwan**, **Blameless**, **Supply Match**, **Steward**. Pick the ones that photograph/model well; a project with no compelling visual asset does not earn a slot here (it can live on the main site instead).
* Three curated 3D models for the showcase. Existing GLBs in the old repo (`che.glb`, `cat_dispenser.glb`, `painterly_cottage.glb`) are *starting* assets only — replace any that don't fit the aesthetic. Prefer abstract/architectural/mechanical forms over literal ones.
* Full responsive behavior with an explicit, tested mobile fallback path (see Phase 6).

### Out of scope (do not build without approval):

* Any backend, API, database, auth, or serverless function. Vitrine is static hosting only.
* A blog, a contact form with a mailer, analytics beyond a single lightweight page-view pixel, or cookie consent machinery.
* Every commerce artifact from the prmpt reference (cart, price, checkout).
* Multi-page routing, i18n, a theme switcher. One page, one theme (dark), one language.
* Auto-generated 3D content at runtime. Models are authored/optimized ahead of time and shipped as compressed assets.

### Hard budgets (these are constraints, not goals):

* **Frame rate:** 60fps sustained on a 2021-era laptop iGPU during scroll. Never below 30fps on a mid-tier phone; if it can't hold 30, the 3D degrades to a static fallback for that section (Phase 6).
* **Initial transfer:** ≤ 2.5 MB for first meaningful paint (HTML + CSS + JS + hero assets). Heavy GLBs and section textures lazy-load on scroll approach, never up front.
* **Largest single GLB:** ≤ 1.5 MB after Draco + meshopt. If a model can't hit that, decimate it or drop it.
* **Time to interactive hero:** ≤ 2.5s on a 4G connection with the preloader covering the gap.
* **Zero** layout shift after the preloader resolves (CLS ≈ 0).

---

## TECH STACK

Locked. Do not substitute without approval — these choices are load-bearing for the mechanics.

* **React 19 + TypeScript**, **Vite 6**, **Tailwind CSS v4** (`@tailwindcss/vite`). SPA only, no SSR (this sidesteps every WebGL/hydration hazard).
* **3D:** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`. Draco + meshopt decoders for GLB; KTX2 for textures.
* **Project sphere:** React Bits **Infinite Menu** (copy-in component; it renders its own WebGL context via **OGL**). Owned in-repo, customized — not an npm dependency.
* **Text mechanics:** **Magic UI** components (copy-in; Tailwind + Motion). Specific components assigned per section below.
* **Scroll:** **Lenis** for smooth scroll; **GSAP 3.15 + ScrollTrigger** for scrubbed timelines. Lenis is the single scroll source of truth and drives ScrollTrigger.
* **Component motion:** **Motion** (`motion/react`) for entrance/exit and micro-interactions that aren't scroll-scrubbed.
* **Fonts:** a tight geometric/grotesque pairing consistent with the Apple-adjacent aesthetic of the main site — e.g. **Inter Tight** (500/600) for UI + a single expressive display cut for the hero. Load via `<link>` with `display=swap`; subset if possible.
* **Package manager:** pnpm. **Node:** ≥ 20.
* **Hosting:** Vercel (static). Deploy target `vitrine` project, custom domain `lab.ryanqi…` (or `/lab` reverse-proxied — confirm with Ryan).

---

## SYSTEM ARCHITECTURE

Two WebGL contexts coexist deliberately (the r3f canvas and the Infinite Menu's OGL canvas). They must never both be actively rendering off-screen — pause whichever is out of view (see danger zones). One scroll value flows to everything.

```
                          ┌────────────────────────────────────────┐
                          │              <App> (SPA)                │
                          │   Preloader · Sections · Cursor · Nav   │
                          └───────────────────┬────────────────────┘
                                              │
                    ┌─────────────────────────┼──────────────────────────┐
                    │                         │                          │
          ┌─────────▼─────────┐   ┌───────────▼───────────┐   ┌──────────▼──────────┐
          │   Lenis (smooth   │──>│   ScrollController     │──>│  Scene orchestrator │
          │   scroll = 1 SoT) │   │  (GSAP ScrollTrigger,  │   │  (drives r3f camera │
          │                   │   │   RAF, one scroll val) │   │   + section reveal) │
          └───────────────────┘   └───────────┬───────────┘   └──────────┬──────────┘
                                              │                          │
                              ┌───────────────┴───────┐        ┌─────────▼──────────┐
                              │  DOM sections (Tailwind│        │  <Canvas> (r3f)    │
                              │  + Magic UI text fx)   │        │  Hero depth · 3D   │
                              └───────────────────────┘        │  showcase · post   │
                                                               └────────────────────┘
                              ┌────────────────────────────────────────────────────┐
                              │  <InfiniteMenu> (OGL canvas, projects sphere)        │
                              │  mounted only while Projects section is near view    │
                              └────────────────────────────────────────────────────┘

  Content: src/content/*.ts  (typed, compiled in — the single source of truth for what shows)
  Assets:  /public/models/*.glb (draco), /public/tex/*.ktx2, /public/media/*
```

### Layering rules

* **One RAF loop.** Lenis's `raf` drives `gsap.ticker`, which drives `ScrollTrigger.update()`. Do not start a second independent `requestAnimationFrame` scroll reader. The r3f render loop is its own thing (managed by `<Canvas>`), but it reads the *smoothed* scroll value, never `window.scrollY` directly.
* **Mount-on-approach.** Heavy sections (3D showcase, Infinite Menu) mount when their trigger enters a pre-roll zone (~1 viewport before) and unmount / freeze when well past. Never keep every WebGL scene alive for the whole page.
* **Secrets:** none. There is no server. Nothing sensitive exists in this project. (If a page-view pixel is added, it uses no PII.)

---

## THE CORE CONTENT & ASSET CONTRACT

For Steward the contract was the SQL schema. Here it is the **content model** and the **asset budget**. The UI, the sphere, and the 3D scenes all speak these shapes. Changing a field that a component reads means changing it here first.

### `src/content/projects.ts`

```ts
export type ProjectTag = 'ml' | 'agents' | 'fullstack' | 'systems' | 'infra' | 'award';

export interface Project {
  slug: string;              // stable id, used for the sphere face + detail anchor
  title: string;             // "Eco-Pulse"
  role: string;              // "Design + ML"  — Ryan's actual contribution, be honest
  blurb: string;             // ≤ 140 chars, one punchy line
  detail: string;            // 2–4 sentences for the detail view; plain, no buzzwords
  stack: string[];           // ["React", "Python", "K-Means", ...]
  year: number;
  tags: ProjectTag[];        // drives colour accent / filter, not required for MVP
  award?: string;            // "1st place — GenAI Genesis" (only if real)
  links: { label: string; href: string }[];  // live demo, repo, devpost — real links only
  media: {
    thumb: string;           // sphere face texture (square, ≤ 512px, ktx2 or webp)
    hero?: string;           // detail-view image/video (lazy)
    model?: string;          // optional GLB slug if this project has a 3D asset
    accent: `#${string}`;    // hex accent for this project's detail theme
  };
}

export const projects: Project[];  // 5–7 entries, curated
```

**Honesty rule (non-negotiable):** `role`, `award`, and `detail` describe what actually happened. No inflated claims, no fabricated metrics, no invented awards. This is a hiring surface; a single embellishment that a reviewer catches is worse than a modest truth. If a number isn't real and verifiable, it doesn't appear.

### `src/content/models.ts`

```ts
export interface ShowcaseModel {
  slug: string;
  label: string;             // HUD label, e.g. "PAINTERLY COTTAGE"
  file: string;              // "/models/painterly_cottage.glb"  (draco-compressed)
  polyBudget: number;        // target tris after decimation, ≤ 150k
  hudSpec: string;           // flavour text, e.g. "ARCH · HANDPAINT · NPR"
  cameraFraming: { position: [number,number,number]; target: [number,number,number] };
}
```

### Asset budget table (enforced)

| Asset class          | Format             | Budget                              |
|----------------------|--------------------|-------------------------------------|
| Showcase GLB (each)  | glTF + Draco/meshopt | ≤ 1.5 MB, ≤ 150k tris             |
| Section textures     | KTX2 (Basis)       | ≤ 512 KB each; power-of-two dims    |
| Sphere face thumbs   | WebP or KTX2       | ≤ 60 KB each, ≤ 512×512             |
| Hero media           | mp4 (h.264) / webp | ≤ 1.5 MB, lazy after first paint    |
| Total initial JS     | minified + gzip    | ≤ 900 KB (code-split the 3D routes) |
| Total first paint    | all above          | ≤ 2.5 MB                            |

If any asset blows its budget, the fix is optimization (Draco level up, decimate, re-encode), not raising the budget.

### Scene / z-order contract

* `z-0` r3f canvas (fixed, `inset-0`, `pointer-events-none` except the showcase section which opts into orbit controls).
* `z-10` DOM content sections (Tailwind), `mix-blend-mode: difference` or `exclusion` on overlay text so it survives light/dark backdrops (borrowed from the prmpt reference — keep this trick, it's good).
* `z-20` fixed UI (nav, section labels).
* `z-30` Infinite Menu canvas while active.
* `z-40` custom cursor (desktop only, `mix-blend-mode: exclusion`, `pointer-events-none`).
* `z-50` preloader (covers everything until assets resolve).

---

## REPOSITORY STRUCTURE

```
vitrine/
├── README.md
├── CLAUDE.md                      # this file
├── index.html
├── vite.config.ts                # @vitejs/plugin-react + @tailwindcss/vite
├── package.json
│
├── public/
│   ├── models/                   # *.glb, draco-compressed
│   ├── tex/                      # *.ktx2 section textures
│   ├── media/                    # hero mp4/webp, project heroes
│   └── draco/  meshopt/          # decoder wasm (or load from drei CDN)
│
└── src/
    ├── main.tsx
    ├── App.tsx                   # section composition + <Canvas> mount
    ├── index.css                 # @import "tailwindcss"; global tokens
    │
    ├── content/
    │   ├── projects.ts           # the curated project set (source of truth)
    │   └── models.ts             # showcase model definitions
    │
    ├── scroll/
    │   ├── LenisProvider.tsx      # smooth scroll, exposes smoothed value via context
    │   ├── useScrollProgress.ts   # section-local progress hook (reads Lenis, not scrollY)
    │   └── scrollController.ts     # GSAP ScrollTrigger setup, RAF wiring
    │
    ├── three/
    │   ├── Scene.tsx              # top-level r3f scene, AdaptiveDpr, PerformanceMonitor
    │   ├── HeroDepth.tsx          # layered parallax / depth hero
    │   ├── ShowcaseModel.tsx      # revived models.js: GLTF + bloom + orbit
    │   ├── postprocessing.tsx     # EffectComposer: bloom, vignette (budget-gated)
    │   └── quality.ts             # tier detection → sets DPR, effects, particle counts
    │
    ├── sections/
    │   ├── Hero.tsx
    │   ├── Projects.tsx           # wraps <InfiniteMenu>, handles select → detail
    │   ├── ProjectDetail.tsx      # transition-in panel per project
    │   ├── Showcase.tsx           # 3D model viewer section
    │   ├── Interstitial.tsx       # scroll-linked text reveal moments
    │   └── Outro.tsx              # closing panel + CTA back to main site
    │
    ├── components/
    │   ├── InfiniteMenu.tsx       # React Bits (copied in, customized) — OGL sphere
    │   ├── Preloader.tsx          # asset gate + progress
    │   ├── Cursor.tsx             # desktop custom cursor
    │   ├── Nav.tsx
    │   └── magicui/               # copied-in Magic UI text components
    │       ├── TextReveal.tsx
    │       ├── BlurFade.tsx
    │       ├── AnimatedGradientText.tsx
    │       └── HyperText.tsx
    │
    └── lib/
        ├── media.ts              # lazy asset loaders, KTX2/GLTF helpers
        ├── reducedMotion.ts      # single source for the reduced-motion decision
        └── env.ts                # feature flags (e.g. ?debug for perf HUD)
```

---

## IMPLEMENTATION PHASES

Each phase ends with a verifiable exit criterion. Do not advance until it's met against a running dev server.

---

### PHASE 0: FOUNDATION, TOOLING & ASSET PIPELINE

**Exit criterion:** `pnpm dev` serves a blank dark page with the preloader, Lenis smooth scroll active, Tailwind v4 working, the r3f `<Canvas>` mounting an empty scene at a solid 60fps, and the Draco/KTX2 decoders confirmed loading. One sample GLB loads, renders, and disposes cleanly when unmounted (verify: no WebGL context warnings, memory returns to baseline).

* Scaffold Vite + React 19 + TS + Tailwind v4. Wire `@tailwindcss/vite`.
* Install and configure `three`, r3f, drei, postprocessing, `lenis`, `gsap`, `motion`.
* Stand up `LenisProvider` and confirm `gsap.ticker` → `ScrollTrigger.update()` wiring (no second RAF).
* Build the asset pipeline: a `pnpm assets` script (or documented gltf-transform commands) that Draco+meshopt-compresses GLBs and encodes KTX2 textures. Document it in README.
* `quality.ts` stub: detect a rough device tier (DPR, `hardwareConcurrency`, touch) → returns a quality profile the whole app reads.

### PHASE 1: SCROLL SPINE

**Exit criterion:** Scrolling drives a single smoothed progress value that a debug HUD prints (`?debug`). ScrollTrigger sections fire enter/leave at the right offsets. `prefers-reduced-motion` is honored globally: with it on, Lenis falls back to native scroll and scrub animations snap instead of tween. No jank, no double-scroll, no scroll-event soup.

* `useScrollProgress` returns section-local 0→1 progress from Lenis, never from `window.scrollY`.
* Establish the section rhythm and total scroll length; sections declare their pin/scrub via ScrollTrigger.
* Reduced-motion path implemented and tested here, not bolted on later.

### PHASE 2: HERO — 3D DEPTH + CURSOR MECHANICS

**Exit criterion:** The hero renders layered depth that parallaxes on pointer (desktop) and device-tilt or gentle auto-drift (mobile). Ryan's name animates in with a Magic UI effect. On desktop, a custom `mix-blend-exclusion` cursor tracks the pointer. Borrowed from the prmpt reference: pointer position drives a media/scene response with a **dead zone** near center (±5% of width, min 30px) so it doesn't jitter at rest. Holds 60fps.

* `HeroDepth.tsx`: 3–5 parallax layers (image planes or a light particle field) offset by smoothed pointer, eased — never 1:1 with raw pointer (that's the prmpt jitter trap).
* Name via Magic UI **AnimatedGradientText** or **HyperText** (pick one, not both). Subhead via **BlurFade**, staggered entrance (logo 0s, subhead +0.15s) echoing the reference timing.
* `Cursor.tsx`: fixed, `pointer-events-none`, `z-40`, `mix-blend-mode: exclusion`, hidden < 1024px. Position via direct DOM writes in the RAF loop, not React state.
* **Critical (from prmpt):** if any media is scrubbed by pointer, only update `currentTime`/uniform when the previous seek/frame has settled; guard against thrashing.

### PHASE 3: PROJECTS — INFINITE MENU + DETAIL

**Exit criterion:** A draggable WebGL sphere shows one face per curated project (thumb texture + title). Dragging spins it with inertia; releasing settles on the front face. Selecting a face opens a `ProjectDetail` transition (accent theme, blurb, stack, real links). Keyboard users get an accessible list fallback of the same projects (the sphere is enhancement, not the only path). The OGL canvas mounts on approach and unmounts/freezes when the section leaves view.

* Copy React Bits **Infinite Menu** into `components/InfiniteMenu.tsx`; feed it from `projects.ts`. Customize typography/materials to the aesthetic; strip demo content.
* `ProjectDetail.tsx`: transition driven by Motion; per-project `accent`. Links open real demos/repos/devposts — no dead `#`.
* **A11y:** below the sphere (or via a toggle), render the same projects as a semantic list with the same links, so the section is fully usable without WebGL or a pointer.
* **Perf:** confirm the OGL context is not rendering while the r3f hero/showcase is on screen. One active heavy context at a time.

### PHASE 4: 3D SHOWCASE (revive models.js → r3f)

**Exit criterion:** A dedicated section renders a real GLB with lighting, environment, and a budget-gated bloom pass, with orbit controls (drag to rotate) that only capture pointer while the section is in view. A HUD shows the model label/spec (the `models.js` flavour, cleaned up). Switching between the three curated models is smooth and leak-free. This is the "here is real WebGL I authored and control" beat.

* Port the intent of the old `models.js` (GLTFLoader, DRACO, RGBELoader/Environment, UnrealBloomPass) into idiomatic r3f/drei: `useGLTF` with draco, `<Environment>`, `<Bloom>` from `@react-three/postprocessing`, `<OrbitControls>` gated by section visibility.
* Replace any starting GLB that clashes with the aesthetic. Re-optimize all three to budget (≤150k tris, ≤1.5MB).
* Bloom/effects are **quality-gated**: off or reduced on low tier (`quality.ts`).
* Dispose geometries/materials/textures on unmount; verify baseline memory returns.

### PHASE 5: INTERSTITIALS & TEXT MECHANICS

**Exit criterion:** Between the big beats, scroll-linked typographic moments read in as the user scrolls — a paragraph whose characters rise from low opacity to full based on scroll position (the Prisma reference mechanic), and at least one Magic UI **TextReveal** headline. All text remains legible against whatever 3D sits behind it (blend mode or scrim). Reduced-motion shows the text statically, fully legible.

* Implement the per-character scroll-opacity reveal as a reusable component; stagger by `charIndex / total` mapped onto section progress.
* Keep these lightweight — no 3D here; they're breathing room between GPU-heavy sections and help the frame budget recover.

### PHASE 6: PERFORMANCE, MOBILE FALLBACK & A11Y

**Exit criterion:** On a mid-tier phone the site holds ≥30fps or, where it can't, that section swaps to a static high-quality fallback (poster image / CSS) with no broken layout. `PerformanceMonitor` (drei) adapts DPR down under load. All interactive elements are keyboard-reachable with visible focus. `prefers-reduced-motion` disables scrubbing everywhere. Lighthouse: Performance ≥ 85 mobile, Accessibility ≥ 95. No console errors, no context-lost.

* `quality.ts` finalized: tiers set DPR cap (≤2), particle counts, effect passes, and the mount/skip decision for each 3D section.
* Every 3D section has a declared static fallback. The site must be *coherent and navigable* with WebGL disabled entirely.
* Focus states, skip-to-content link, alt text on all media, semantic headings. The sphere's list fallback (Phase 3) counts here.
* Add `AdaptiveDpr`, `AdaptiveEvents`, and `<Preload all />` only for the current section's assets.

### PHASE 7: DEPLOY & WIRE TO MAIN SITE

**Exit criterion:** Live on Vercel at the chosen URL. The **main** site links to Vitrine as a project ("Interactive portfolio experiment" / a subtle `/lab` link), and Vitrine links back to the main site and to contact. Framing copy on Vitrine makes clear it's a lab/experiment. Verified on real desktop + real phone, not just devtools emulation.

* Static deploy, correct caching headers for hashed assets and GLBs.
* Add the cross-links both directions. Confirm the framing line is present so the two-site relationship is legible.
* Final pass on OG/meta tags and a share image so a shared link previews well.

---

## DANGER ZONES — TRAPS TO AVOID

1. **The performance cliff.** This is the whole risk. Uncompressed GLBs, uncapped DPR on retina, both WebGL contexts rendering at once, or a bloom pass on an iGPU will tank the frame rate — and a janky "flex" site actively hurts, worse than no site. Every phase is frame-budget-gated. Profile before merging.

2. **Two WebGL contexts fighting.** The r3f canvas and the Infinite Menu's OGL canvas must never both actively render off-screen. Mount-on-approach, freeze/unmount on leave. Only one heavy context renders at a time.

3. **Scroll-jack sickness.** Over-hijacking scroll (locking, snapping hard, long pins) makes people nauseous and trapped. Keep scrub subtle, never fully seize the wheel, always honor `prefers-reduced-motion`, and make sure the page can be traversed at a normal reading pace.

4. **Memory leaks in Three.** Not disposing geometries, materials, textures, and render targets on unmount leaks GPU memory until the tab crashes. Every scene disposes on unmount; verify memory returns to baseline when a section leaves. drei's `useGLTF.preload`/cache helps but doesn't absolve disposal.

5. **Content burial — even here.** The reason this is a *separate* site is so the main one stays fast. But don't re-create the problem inside Vitrine: the projects must still be reachable and readable (hence the keyboard/list fallback). Mechanics serve the work; they don't hide it.

6. **The prmpt commerce shell.** Borrow the *mechanics* (cursor-scrubbed media, panel reveal, scale-on-scroll, blend-mode overlays). Bring **none** of the fashion/commerce content — no price, no cart, no product framing. If any of that appears, it's a bug.

7. **3D for its own sake.** A spinning model that says nothing about Ryan is filler. Each 3D beat earns its place by demonstrating a specific, hireable skill (shader work, scene management, interaction design). If a section is only "look, it's 3D," cut it.

8. **Dishonest content.** This is a hiring surface. No fabricated metrics, inflated roles, or invented awards in `projects.ts`. Real links only; no dead `#` demos. A caught embellishment costs more than a modest truth.

9. **Raw pointer / raw scroll binding.** Never bind camera, parallax, or media directly to the unsmoothed pointer or `window.scrollY`. Always ease. 1:1 binding is the source of the jitter the dead-zone logic exists to prevent.

10. **Blank-canvas loading.** Never show an empty black canvas while GLBs stream in. The preloader gates first paint; sections show a poster/skeleton until their assets resolve. No "is it broken?" moments.

11. **Reduced-motion as an afterthought.** It's implemented in Phase 1 and honored in every subsequent phase, not retrofitted at the end. Someone with vestibular sensitivity must get a calm, legible, fully-navigable site.

---

## ENGINEERING GUIDELINES

* **One scroll source of truth.** Lenis → `gsap.ticker` → `ScrollTrigger.update()`. Section progress comes from a hook that reads Lenis. No component reads `window.scrollY`, and there is exactly one RAF scroll reader.
* **One quality decision.** `quality.ts` decides DPR, effect passes, particle counts, and per-section mount/skip. No component hardcodes its own tier logic.
* **One reduced-motion decision.** `lib/reducedMotion.ts` is the only place the preference is read; everything imports from it.
* **Mount heavy things late, dispose early.** Approach-mount, leave-dispose, for every 3D section and the sphere. Assume the page will be open for an hour — it must not leak.
* **Budget over beauty at the margin.** When an effect can't hold the frame budget on a target device, it degrades — it does not stay and drop frames.
* **Component restraint.** React Bits' own guidance: no more than 2–3 heavy animated components active per viewport. Respect it.
* **Curated, not managed.** Adding a project is a typed edit to `projects.ts`. No CMS, no admin. Keep the maintenance surface near zero so this stays a fun artifact, not a chore that rots.
* **Own your copied components.** Infinite Menu and the Magic UI pieces are copied in and customized. Note their source and version in a comment so future-you can diff upstream fixes.
* **Structured error/empty states.** A failed asset load shows a graceful fallback, not a blank frame or a thrown error. WebGL context loss is caught and recovered (or falls back to static).

---

## NOTES FOR THE BUILDING AGENT (Fable) — 3D & AUTONOMY DIRECTIVES

This build leans on high-capability, high-autonomy execution. Operate accordingly:

* **Own whole phases end to end.** Plan the phase, implement across the many files it touches, run the dev server, and *verify the exit criterion yourself* before reporting done. Don't hand back half a phase for the user to wire up.
* **Self-verify visually and numerically.** After each 3D phase, run the dev server, inspect the rendered result, and check the frame budget (drei `PerformanceMonitor`, the `?debug` HUD, or a scripted FPS probe). "It compiles" is not "it works." A phase is done when it looks right *and* holds its frame budget.
* **Author real GLSL when needed.** Custom shaders (depth parallax, dissolve transitions, dust/particle fields) are in scope. Write and reason about the vertex/fragment stages directly; don't reach for a heavy library when a small shader is cleaner and cheaper.
* **Reason about the render pipeline.** Draw calls, overdraw, texture memory, render-target count, DPR — make these tradeoffs explicitly and note them in PR descriptions. Optimize assets (Draco level, decimation, KTX2) as a first-class task, not an afterthought.
* **Prototype, measure, keep or cut.** For each 3D beat, stand up the cheapest version that proves the idea, measure it on the target budget, and only then invest in polish. If it can't hit budget, cut it and say so — a cut section is a better outcome than a janky one.
* **Placeholder honestly.** Where a final asset (a project thumb, a bespoke model) isn't ready, use an obvious labeled placeholder and flag it in the PR, so nothing fake ships as if it were real.
* **Keep the two-site relationship intact.** Every decision remembers that the clean main site is the default and Vitrine is the deliberate flex. Don't add "helpful" recruiter-facing content here that duplicates the main site — that's not this site's job.

Update the **CURRENT STATUS** box as each phase's exit criterion is verified. Same discipline as Steward.