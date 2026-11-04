import { withBasePath } from "@/lib/paths";

/** All copy comes from the latest resume (Oct 2026). */

/** Company keys double as CSS colour tokens: --c-runo, --c-r3, … */
export type Company = "runo" | "r3" | "oto" | "xev" | "fin";

export interface Work {
  company: Company;
  name: string;
  role: string;
  period: string;
  /** Inclusive [year, month0] range, drives the 3D months. `to: null` = present. */
  from: [number, number];
  to: [number, number] | null;
  location?: string;
  link: { href: string; label: string };
  highlights: string[];
  stack: string;
}

export const PROFILE = {
  name: "Rishabh Varshney",
  title: "Software Engineer",
  location: "Hyderabad, India",
};

export const METRICS = [
  { value: "5+", label: "years shipping" },
  { value: "10+", label: "fields worked in" },
  { value: "20k+", label: "users on the calling platform" },
  { value: "10k+", label: "charge points online" },
];

export const FIELDS = [
  { name: "Cloud telephony", source: "Runo" },
  { name: "Contact-centre CRM", source: "Runo" },
  { name: "Applied AI", source: "Runo, R3Factory" },
  { name: "E-commerce", source: "R3Factory" },
  { name: "HR tech", source: "Otomator" },
  { name: "IoT", source: "Otomator" },
  { name: "EV charging", source: "XEV" },
  { name: "Fintech", source: "Finaccru" },
];

export const ROLES: Work[] = [
  {
    company: "runo",
    name: "Runo",
    role: "Software Development Engineer I",
    period: "Aug 2024 to now",
    from: [2024, 7],
    to: null,
    location: "Hyderabad",
    link: { href: "https://runo.ai/", label: "runo.ai" },
    highlights: [
      "One webhook layer normalising Twilio, Vonage, Telnyx and Airtel call events into a single model.",
      "Single-leg, dual-leg and WebRTC browser calling for 20k+ users, from any device.",
      "In-house Asterisk server (Docker on AWS EC2) for SIP signalling and media: 3k+ concurrent calls, all recorded to S3.",
      "50+ features on AWS Lambda with the Serverless Framework, including role-based access, PII phone-number masking and SQS-driven Gemini analysis of 500+ calls a day.",
      "CloudWatch and Crashlytics observability across the call pipeline: 60% faster issue resolution as first responder.",
    ],
    stack: "Node.js, TypeScript, AWS Lambda, Asterisk, SIP, WebRTC, SQS, Gemini",
  },
  {
    company: "r3",
    name: "R3Factory",
    role: "Software Developer Intern",
    period: "Feb 2024 to Aug 2024",
    from: [2024, 1],
    to: [2024, 7],
    location: "Remote",
    link: { href: "https://r3factory.com/", label: "r3factory.com" },
    highlights: [
      "Multi-threaded Python and FastAPI pipeline ingesting 10k+ records a week from 5+ sources into MongoDB, enriched with seller price history: 30% more throughput.",
      "RASA NLP support chatbot on the React storefront over WebSockets: 200+ queries a day, 30% more engagement.",
    ],
    stack: "Python, FastAPI, MongoDB, RASA NLP, React, WebSockets",
  },
  {
    company: "oto",
    name: "Otomator Technologies",
    role: "Full Stack Developer Intern",
    period: "Aug 2021 to Oct 2023",
    from: [2021, 7],
    to: [2023, 9],
    location: "Remote",
    link: { href: "https://otomator.com/", label: "otomator.com" },
    highlights: [
      "MERN attendance platform on AWS for 1,200+ employees, with web and RFID biometric check-ins and daily payroll CSVs: 70+ HR hours saved a month.",
      "Node.js IoT service layer linking 50+ devices to a mobile app over MQTT pub/sub with token-secured webhooks: 99.9% availability.",
    ],
    stack: "MongoDB, Express, React, Node.js, MQTT, AWS",
  },
];

export const PROJECTS: Work[] = [
  {
    company: "xev",
    name: "XEV Charging",
    role: "Freelance tech lead",
    period: "Dec 2023",
    from: [2023, 11],
    to: [2023, 11],
    link: { href: "https://www.x-ev.io/", label: "x-ev.io" },
    highlights: [
      "Wrote the OCPP server in Elixir for charger communication, and led 5 engineers on Next.js and Flutter apps over Dockerised Go microservices on AWS.",
      "Scaled to 10k+ connected charge points, streaming live station status to 50k+ concurrent users at 2 to 10 ms.",
    ],
    stack: "Elixir, OCPP, Go, Next.js, TypeScript, AWS",
  },
  {
    company: "fin",
    name: "Finaccru",
    role: "Freelance full-stack",
    period: "Feb 2024",
    from: [2024, 1],
    to: [2024, 1],
    link: { href: "https://www.finaccru.com/", label: "finaccru.com" },
    highlights: [
      "React and Redux frontend with WebSocket chat and role-based views for 100+ concurrent users; co-built the FastAPI and MySQL backend on GCP in a team of 3.",
      "OCR document review handling 500+ documents a day at 90% field-level accuracy: 70% faster invoice entry.",
    ],
    stack: "React, Redux, FastAPI, MySQL, GCP",
  },
];

export const STACK = [
  { group: "Languages", items: "TypeScript, JavaScript, Python, Go, Elixir, Dart, SQL" },
  { group: "Frontend", items: "React, Next.js, Redux, Flutter, Tailwind, WebRTC" },
  { group: "Backend and cloud", items: "Node.js, FastAPI, REST, GraphQL, AWS Lambda, Cognito, SQS" },
  { group: "Data", items: "PostgreSQL, MongoDB, MySQL, Redis" },
  { group: "Tooling", items: "Docker, Serverless, GitHub Actions, Asterisk, SIP, MQTT" },
];

export const CONTACT = {
  email: "rishabhvar.11@gmail.com",
  github: "https://github.com/var-rishabh",
  linkedin: "https://www.linkedin.com/in/rishabh-builds/",
  // Plain <a> into public/ needs the basePath (see lib/paths.ts).
  resume: withBasePath("/resume/rishabh-varshney-resume.pdf"),
};

const FIRST: [number, number] = [2021, 7];
export const NOW: [number, number] = [2026, 10];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const index = ([y, m]: [number, number]) => y * 12 + m;

/**
 * One entry per month from Aug 2021 to now: the 64 objects of the 3D scene.
 * Projects are listed last so a one-month freelance job wins over the role
 * running alongside it (Finaccru in Feb 2024), otherwise it would never show.
 */
export const MONTHS = Array.from({ length: index(NOW) - index(FIRST) + 1 }, (_, i) => {
  const k = index(FIRST) + i;
  const work = [...ROLES, ...PROJECTS].filter((w) => index(w.from) <= k && k <= index(w.to ?? NOW)).pop();
  return {
    year: Math.floor(k / 12),
    month: k % 12,
    label: `${MONTH_NAMES[k % 12]} ${Math.floor(k / 12)}`,
    company: work?.company ?? null,
    name: work?.name ?? null,
  };
});
