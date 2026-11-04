# Resonance: Rishabh Varshney

A dark, scroll-driven WebGL portfolio. The whole site is one sculpture:
64 objects, one for every month since August 2021, coloured by where the
work happened. As you scroll they morph from section to section:

| Section | Form | Interaction |
| --- | --- | --- |
| Hero | Pendulum wave | sweep the cursor to set them swinging |
| Fields | Harp | cross the strings to pluck them (sound is opt-in) |
| Journey | 3D month grid | hover a month; hover a role to light up its months |
| Work | Card deck | hover to pull a card; the two raised cards are the freelance projects |
| Contact | Ribbon | it leans toward the cursor |

All copy lives in `data/content.ts`; the months and their colours are derived
from the role and project dates there.

## Stack

- Next.js 16 (App Router, static export) · React 19 · TypeScript · Node.js ≥ 20.9
- three.js (no React wrapper): one `InstancedMesh` for the months, one
  `LineSegments` for the threads, additive halos; no post-processing
- anime.js for the copy reveals · plain CSS · Syne (display) + Geist (text)

## How it works

```
app/page.tsx            static markup for all five sections
components/Experience   canvas + tooltip; loads lib/stage lazily, reveals, nav state
lib/stage.ts            the sculpture: five pose functions, scroll → (form, progress),
                        pointer interactions, adaptive resolution
lib/sound.ts            opt-in WebAudio harp tones
data/content.ts         every word on the page, plus the 64 months
```

- Each frame blends only two forms (the current section and the next) and
  staggers the blend along the months, so a change ripples through time.
- A form holds while its section is being read and morphs as the next section
  scrolls in, so long sections on phones never morph mid-read.
- Performance: one draw call for the months, low-poly geometry, no shadows or
  post-processing; resolution drops once if the device can't hold ~45 fps;
  touch and low-core devices start at a lower pixel ratio without antialiasing.
- `prefers-reduced-motion` freezes the pendulums and skips reveals; without
  WebGL or JavaScript the page is complete as plain text.

## Getting started

```bash
cd portfolio
npm install
npm run dev        # http://localhost:3000/var-rishabh/
npm run build      # static export to out/ (includes type-check)
npm run lint
```

`package.json` sets `"allowScripts": { "unrs-resolver": false }`: newer npm
blocks dependency install scripts unless listed, and that one is only a
native-binding check, so it is denied rather than run.

## Deployment

The site is a static export served by GitHub Pages at
https://var-rishabh.github.io/var-rishabh/, so `next.config.mjs` sets
`basePath: "/var-rishabh"`. `.github/workflows/deploy.yml` builds `portfolio/`
and publishes `portfolio/out` on every push to `main`.

Plain `<a href>` paths into `public/` (like the resume) must use
`withBasePath()` from `lib/paths.ts`.
