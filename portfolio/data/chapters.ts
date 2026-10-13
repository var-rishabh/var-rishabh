import { withBasePath } from "@/lib/paths";

/**
 * Chapter layout + copy for the Machine Room. `screens` is the desktop
 * scroll length of each chapter in viewport heights: one screen is the
 * pinned panel itself, the rest is the spacer the camera travels through
 * (phones use a much shorter spacer — see components/hud/Chapter.tsx).
 * The camera timeline and HUD are measured from the rendered layout, so
 * re-ordering or lengthening a chapter here keeps everything in sync.
 *
 * All copy comes from the latest resume (Oct 2026), the most detailed and
 * current of the uploaded documents.
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
  { id: "current", code: "02", label: "Experience · Current", shortLabel: "CURRENT", screens: 2 },
  { id: "earlier", code: "03", label: "Experience · Earlier", shortLabel: "EARLIER", screens: 2 },
  { id: "projects", code: "04", label: "Freelance Projects", shortLabel: "PROJECTS", screens: 2 },
  { id: "output", code: "05", label: "Output", shortLabel: "CONTACT", screens: 2 },
];

export interface SystemModule {
  code: string;
  title: string;
  /** Role line under the title. */
  role?: string;
  /** Fields this entry covers — shown in the readout header. */
  domain: string;
  period: string;
  location?: string;
  highlights: string[];
  stack: string[];
  link?: { href: string; label: string };
}

export const PROFILE = {
  name: "Rishabh Varshney",
  title: "Software Engineer",
  focus: "Full-Stack · Cloud · Real-time",
  location: "Hyderabad, India",
  coordinates: "HYD 17.38°N 78.48°E",
} as const;

/**
 * Every field (industry domain) the resume shows hands-on work in, and
 * where. The count drives the "Fields" metric, so adding one here updates
 * the hero automatically.
 */
export const FIELDS: Array<{ name: string; source: string }> = [
  { name: "Cloud Telephony", source: "RUNO" },
  { name: "Contact-Center CRM", source: "RUNO" },
  { name: "Applied AI", source: "RUNO · R3FACTORY" },
  { name: "E-commerce", source: "R3FACTORY" },
  { name: "HR Tech", source: "OTOMATOR" },
  { name: "IoT", source: "OTOMATOR" },
  { name: "EV Charging", source: "XEV" },
  { name: "Fintech", source: "FINACCRU" },
];

/** Headline totals used across the site (hero metrics, field map, page metadata). */
export const YEARS_SHIPPING = "5+";
export const FIELDS_WORKED = "10+";

/** Headline figures shown in chapter 01 — straight from the resume. */
export const HEADLINE_METRICS = [
  { value: YEARS_SHIPPING, label: "Years shipping" },
  { value: FIELDS_WORKED, label: "Fields worked in" },
  { value: "20k+", label: "Users on calling platform" },
  { value: "10k+", label: "Charge points online" },
] as const;

export const CURRENT_ROLE: SystemModule = {
  code: "EXP-01",
  title: "RUNO",
  role: "Software Development Engineer I",
  domain: "CLOUD TELEPHONY // CONTACT-CENTER CRM",
  period: "AUG 2024 — PRESENT",
  location: "Hyderabad",
  highlights: [
    "One webhook layer normalising Twilio, Vonage, Telnyx and Airtel call events into a single model.",
    "Single-leg, dual-leg and WebRTC browser calling for 20k+ users, from any device.",
    "In-house Asterisk server (Docker on AWS EC2) for SIP signalling and media — 3k+ concurrent calls, 100% recorded to S3.",
    "50+ features on AWS Lambda with the Serverless Framework: role-based access, PII phone-number masking and SQS-driven Gemini AI analysis of 500+ calls a day.",
    "CloudWatch and Crashlytics observability across the call pipeline — 60% faster issue resolution as first responder.",
  ],
  stack: ["Node.js", "TypeScript", "AWS Lambda", "Asterisk", "SIP", "WebRTC", "SQS", "Gemini"],
  link: { href: "https://runo.ai/", label: "runo.ai" },
};

export const EARLIER_ROLES: SystemModule[] = [
  {
    code: "EXP-02",
    title: "R3Factory",
    role: "Software Developer Intern",
    domain: "AI E-COMMERCE",
    period: "FEB 2024 — AUG 2024",
    location: "Remote",
    highlights: [
      "Multi-threaded Python + FastAPI pipeline ingesting 10k+ records a week from 5+ sources into MongoDB — normalised, deduplicated and enriched with seller price history; +30% throughput.",
      "RASA NLP support chatbot connected to the React storefront over WebSockets — 200+ queries a day, +30% engagement.",
    ],
    stack: ["Python", "FastAPI", "MongoDB", "RASA NLP", "React", "WebSockets"],
    link: { href: "https://r3factory.com/", label: "r3factory.com" },
  },
  {
    code: "EXP-03",
    title: "Otomator Technologies",
    role: "Full Stack Developer Intern",
    domain: "HR TECH // IOT",
    period: "AUG 2021 — OCT 2023",
    location: "Remote",
    highlights: [
      "MERN attendance platform on AWS for 1,200+ employees — web and RFID biometric check-ins, daily payroll CSVs, 70+ HR hours saved a month.",
      "Node.js IoT service layer linking 50+ devices to a mobile app over MQTT pub/sub with token-secured webhooks — 99.9% availability.",
    ],
    stack: ["MongoDB", "Express", "React", "Node.js", "MQTT", "AWS"],
    link: { href: "https://otomator.com/", label: "otomator.com" },
  },
];

export const PROJECTS: SystemModule[] = [
  {
    code: "PRJ-01",
    title: "XEV Charging",
    role: "Freelance · Tech Lead",
    domain: "EV CHARGING",
    period: "DEC 2023",
    highlights: [
      "Wrote the OCPP server in Elixir for charger communication; led 5 engineers on Next.js and Flutter apps over Dockerised Go microservices on AWS.",
      "Scaled to 10k+ connected charge points, streaming live station status to 50k+ concurrent users at 2–10 ms.",
    ],
    stack: ["Elixir", "OCPP", "Go", "Next.js", "TypeScript", "AWS"],
    link: { href: "https://www.x-ev.io/", label: "x-ev.io" },
  },
  {
    code: "PRJ-02",
    title: "Finaccru",
    role: "Freelance · Full-Stack",
    domain: "FINTECH // ACCOUNTING",
    period: "FEB 2024",
    highlights: [
      "React + Redux frontend and WebSocket chat with role-based views for 100+ concurrent users; co-built the FastAPI + MySQL backend on GCP in a team of 3.",
      "OCR document review handling 500+ documents a day at 90% field-level accuracy — 70% faster invoice entry.",
    ],
    stack: ["React", "Redux", "FastAPI", "MySQL", "GCP"],
    link: { href: "https://www.finaccru.com/", label: "finaccru.com" },
  },
];

export const STACK: Array<{ group: string; items: string[] }> = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Go", "Elixir", "Dart", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Redux", "Flutter", "Tailwind", "WebRTC"] },
  { group: "Backend & Cloud", items: ["Node.js", "FastAPI", "REST", "GraphQL", "AWS Lambda", "Cognito", "SQS"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"] },
  { group: "Tooling", items: ["Docker", "Serverless", "GitHub Actions", "Asterisk", "SIP", "MQTT"] },
];

export const CONTACT = {
  email: "rishabhvar.11@gmail.com",
  github: "https://github.com/var-rishabh",
  linkedin: "https://www.linkedin.com/in/rishabh-builds/",
  // Plain <a> link into public/ — needs the basePath (see lib/paths.ts).
  resume: withBasePath("/resume/rishabh-varshney-resume.pdf"),
} as const;
