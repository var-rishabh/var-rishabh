# The Machine Room — Rishabh Varshney

A cinematic, scroll-driven WebGL portfolio. The page is a futuristic
computational machine: the camera starts wide, dives into the glowing
runtime core (production experience), flies down a corridor of server racks
and data channels (real-time projects + stack), and arrives at the output
gate — "System Ready." (résumé + contact). Copy lives in `data/chapters.ts`.

Everything in 3D is **procedural** (React Three Fiber primitives, instancing
and a runtime-drawn glow texture). There are no `.gltf/.glb`, HDRI or image
assets.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Node.js ≥ 20.9
- React Three Fiber 9, drei 10 (`Environment` + `Lightformer`, `Grid`), postprocessing 3
- Framer Motion (root `useScroll`, per-chapter fades, spring UI)
- Tailwind CSS · Syne (display) · Geist Mono (UI / body)

## How it works

```
app/page.tsx              root useScroll() → scrollYProgress (0..1)
├─ canvas/SceneCanvas     fixed, pointer-events-none WebGL layer
│  └─ machine/signal      damped progress + scroll "energy", shared per frame
│     ├─ CameraRig        Catmull-Rom flight plan keyed to chapter holds
│     └─ Scene            lights, Lightformer env map, the machine parts:
│        Core · Gantries · ServerRacks · DataConduits · OutputGate
├─ hud/Hud                chapter nav, progress rail, depth telemetry
└─ chapters/*             4 sticky, cross-fading chapter sections
```

- `data/chapters.ts` holds chapter lengths and all copy. `lib/timeline.ts`
  measures the rendered sections into the scroll ranges the camera and HUD
  use, so changing copy or a chapter's `screens` keeps everything in sync.
- Scroll never re-renders React: the 3D scene reads a ref inside `useFrame`,
  and the HUD renders MotionValues directly.
- Chapter sections are content-sized with a short camera spacer on phones
  (one or two swipes per chapter); the scroll timeline is measured from the
  live layout, and URL-bar height changes are ignored to avoid jumps.
- Small / touch screens and low-end hardware get a lite profile: adaptive
  DPR driven by measured FPS (drei `PerformanceMonitor`), no
  post-processing, fewer lights, static rack drawers, no grain layer.
  `prefers-reduced-motion` slows idle animation; no WebGL → CSS backdrop.

## Getting started

```bash
cd portfolio
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (includes type-check)
npm run lint       # ESLint 9 flat config (eslint.config.mjs)
npm run type-check
```

`npm install` should finish with no peer-dependency warnings and
`found 0 vulnerabilities`. `package.json` sets `"allowScripts": { "unrs-resolver": false }`:
newer npm blocks dependency install scripts unless listed, and that one is only a
native-binding check (the binding itself ships as an optional dependency), so it is
denied rather than run.

The resume served by the output console lives at
`public/resume/rishabh-varshney-resume.pdf`.
