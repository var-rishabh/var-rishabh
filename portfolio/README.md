# Interactive 3D Portfolio — Scaffold

Next.js App Router project for the 3D interactive developer portfolio. Lives
entirely inside `/portfolio` to keep the repo root untouched (the root
`README.md` is off-limits per project guardrails).

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** for UI chrome
- **@react-three/fiber** + **@react-three/drei** for the 3D scene
- **zustand** for lightweight scene/UI state
- **framer-motion** for DOM-layer transitions

## Structure

```
portfolio/
├── app/                  # App Router routes, layout, global styles
├── components/
│   ├── canvas/           # R3F <Canvas> mount, camera rig, scene content
│   ├── ui/               # DOM overlay: nav, loader, HUD chrome
│   └── showcase/         # Project cards/grid (DOM-based)
├── data/                 # Static content (projects.ts, etc.)
├── hooks/                # Shared React hooks (device/perf checks)
├── lib/                  # Framework-agnostic helpers
├── types/                # Shared TypeScript types
└── public/
    ├── models/           # Draco-compressed .glb/.gltf assets
    └── textures/         # Texture maps
```

## Status

Scaffolding only — no 3D scene content yet. `components/canvas/Scene.tsx`
and `CameraRig.tsx` are intentional stubs; see the TODO comments in each
file for the next steps once the visual theme (terminal HUD / floating
neural nodes / interactive workstation) is chosen.

## Getting started

```bash
cd portfolio
npm install
npm run dev
```
