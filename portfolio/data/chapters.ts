/**
 * Chapter layout + copy for the Machine Room. `screens` is the scroll
 * length of each chapter in viewport heights: one screen of it is the
 * pinned panel itself, the rest is the 100vh spacer the camera travels
 * through. The 3D camera timeline and the HUD both derive their stops
 * from this list (see lib/timeline.ts), so re-ordering or lengthening a
 * chapter here keeps the whole experience in sync.
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
  { id: "processing", code: "02", label: "AI/ML Processing", shortLabel: "CORE", screens: 2 },
  { id: "throughput", code: "03", label: "Throughput & Backend", shortLabel: "CHANNELS", screens: 2 },
  { id: "output", code: "04", label: "Output", shortLabel: "OUTPUT", screens: 2 },
];

export interface SystemModule {
  code: string;
  title: string;
  kind: string;
  summary: string;
  stack: string[];
}

export const AI_MODULES: SystemModule[] = [
  {
    code: "MOD-02.A",
    title: "CareerForge AI",
    kind: "AI ECOSYSTEM // FULL-STACK",
    summary:
      "Reads resumes the way an ATS does, aligns them to target roles and rewrites them — LLM tool orchestration over Claude MCP inside an interactive 3D workspace.",
    stack: ["Next.js", "Claude MCP", "LLMs", "Three.js", "Tailwind"],
  },
  {
    code: "MOD-02.B",
    title: "Text Summarization — ICCIMA",
    kind: "RESEARCH // NLP",
    summary:
      "Research into text summarization algorithms — extractive and abstractive approaches to condensing long-form documents, presented at ICCIMA.",
    stack: ["Python", "PyTorch", "Transformers", "NLP"],
  },
];

export const BACKEND_MODULES: SystemModule[] = [
  {
    code: "MOD-03.A",
    title: "NVR Streaming",
    kind: "STREAMING // REALTIME",
    summary:
      "Network video recorder streaming — concurrent camera feeds ingested and served over tuned socket pipelines, built for low latency.",
    stack: ["Node.js", "Python", "Sockets", "Video Streams"],
  },
  {
    code: "MOD-03.B",
    title: "Twilio Integrations",
    kind: "COMMUNICATIONS // EVENTS",
    summary:
      "Programmable SMS and voice wired into backend workflows — event-driven notifications and verification over webhooks.",
    stack: ["Twilio", "Node.js", "Webhooks", "REST"],
  },
  {
    code: "MOD-03.C",
    title: "Washee Backend",
    kind: "MICROSERVICES // PLATFORM",
    summary:
      "The service layer behind the Washee platform — independently deployable microservices with clean API boundaries.",
    stack: ["Node.js", "Microservices", "REST APIs", "Docker"],
  },
];

export const CONTACT = {
  email: "right.rishabh@gmail.com",
  github: "https://github.com/var-rishabh",
  linkedin: "https://www.linkedin.com/in/rishabh-builds/",
  resume: "/resume/rishabh-varshney-resume.pdf",
} as const;
