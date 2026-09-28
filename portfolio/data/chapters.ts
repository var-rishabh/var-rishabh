/**
 * Chapter layout + copy for the Machine Room. `screens` is the desktop
 * scroll length of each chapter in viewport heights: one screen is the
 * pinned panel itself, the rest is the spacer the camera travels through
 * (phones use a much shorter spacer — see components/hud/Chapter.tsx).
 * The camera timeline and HUD are measured from the rendered layout, so
 * re-ordering or lengthening a chapter here keeps everything in sync.
 *
 * All copy below comes from the resume (master_profile).
 */
export interface ChapterMeta {
  id: string;
  code: string;
  label: string;
  shortLabel: string;
  screens: number;
}

export const CHAPTERS: ChapterMeta[] = [
  { id: "initialization", code: "01", label: "Initialization", shortLabel: "INIT", screens: 2 },
  { id: "experience", code: "02", label: "Experience", shortLabel: "EXPERIENCE", screens: 2 },
  { id: "projects", code: "03", label: "Projects & Stack", shortLabel: "PROJECTS", screens: 2 },
  { id: "output", code: "04", label: "Output", shortLabel: "CONTACT", screens: 2 },
];

export interface SystemModule {
  code: string;
  title: string;
  /** Role line under the title (experience entries). */
  role?: string;
  kind: string;
  summary: string;
  stack: string[];
}

export const PROFILE = {
  name: "Rishabh Varshney",
  title: "Software Engineer",
  focus: "Frontend & Full-Stack",
  location: "Gurugram, India",
  coordinates: "GGN 28.46°N 77.03°E",
} as const;

/** Headline figures shown in chapter 01 — straight from the resume bullets. */
export const HEADLINE_METRICS = [
  { value: "3+", label: "Years shipping" },
  { value: "10k+", label: "Daily active agents" },
  { value: "15+", label: "Features to prod" },
] as const;

export const EXPERIENCE: SystemModule[] = [
  {
    code: "EXP-01",
    title: "RUNO",
    role: "Software Development Engineer I",
    kind: "AUG 2024 — PRESENT",
    summary:
      "Own key UI modules of a B2B call CRM used by 10k+ daily agents — shared component library, 15+ features shipped, 60% faster issue resolution.",
    stack: ["Component Library", "REST Contracts", "Observability", "Monitoring"],
  },
  {
    code: "EXP-02",
    title: "R3Factory",
    role: "Software Developer Intern",
    kind: "FEB 2024 — AUG 2024",
    summary:
      "React storefront on a RASA NLP service (+30% engagement); parallel ingestion worker pool (+30% throughput, 10k+ records/wk).",
    stack: ["React.js", "RASA NLP", "Worker Pools", "HTML5 / CSS3"],
  },
  {
    code: "EXP-03",
    title: "Otomator Technologies",
    role: "Full Stack Developer",
    kind: "AUG 2021 — OCT 2023",
    summary:
      "MERN HR platform saving 70+ hrs/month for 1,200+ employees; Node.js IoT service layer at 99.9% availability across 50+ connected devices.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Webhooks"],
  },
];

export const PROJECTS: SystemModule[] = [
  {
    code: "PRJ-01",
    title: "XEV Charging",
    kind: "EV CHARGING // U.S. CLIENT",
    summary:
      "Led 5 engineers shipping a production EV-charging platform — live status for 100+ charge points at 2–10ms via WebSockets and Go services.",
    stack: ["Next.js", "TypeScript", "Flutter", "Go", "AWS"],
  },
  {
    code: "PRJ-02",
    title: "Finaccru",
    kind: "ACCOUNTING // FINTECH",
    summary:
      "React review UI over OCR extraction — 500+ docs/day at 90% field accuracy, 70% faster invoice entry — plus WebSocket chat for 100+ users.",
    stack: ["React.js", "Redux", "FastAPI", "MySQL"],
  },
];

export const STACK: Array<{ group: string; items: string[] }> = [
  { group: "Frontend", items: ["React", "Next.js", "Redux", "TypeScript", "Tailwind", "Flutter"] },
  { group: "Backend", items: ["Node.js", "Express", "FastAPI", "Go", "PostgreSQL", "MongoDB"] },
  { group: "APIs", items: ["REST", "GraphQL", "WebSockets", "Webhooks"] },
  { group: "Build & Cloud", items: ["Vite", "Webpack", "GitHub Actions", "AWS", "Azure", "Docker"] },
];

export const CONTACT = {
  email: "right.rishabh@gmail.com",
  github: "https://github.com/var-rishabh",
  linkedin: "https://www.linkedin.com/in/rishabh-builds/",
  resume: "/resume/rishabh-varshney-resume.pdf",
} as const;
