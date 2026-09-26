export interface Project {
  id: string;
  title: string;
  tag: string;
  summary: string;
  description: string;
  stack: string[];
  href?: string;
  repoHref?: string;
}

export const projects: Project[] = [
  {
    id: "careerforge-ai",
    title: "CareerForge AI",
    tag: "AI/ML · FULL-STACK",
    summary:
      "Intelligent ATS resume alignment engine & interactive 3D portfolio workspace.",
    description:
      "An AI-driven platform that scores and rewrites resumes against target job descriptions, paired with a spatial 3D workspace for exploring career artifacts. Built end-to-end on the modern Next.js stack with Claude MCP tool orchestration.",
    stack: ["Next.js", "Three.js", "Claude MCP", "Tailwind"],
    repoHref: "https://github.com/var-rishabh",
  },
  {
    id: "streaming-pipelines",
    title: "High-Throughput Streaming & Backend Pipelines",
    tag: "BACKEND · SYSTEMS",
    summary:
      "NVR streaming and microservice pipelines with optimized, low-latency socket processing.",
    description:
      "A microservices architecture for network video recorder ingestion, handling concurrent camera streams with optimized socket-level streaming, backpressure-aware buffering, and low-latency frame processing across Node.js and Python services.",
    stack: ["Node.js", "Python", "Sockets", "Microservices"],
    repoHref: "https://github.com/var-rishabh",
  },
  {
    id: "research-summarization",
    title: "Research & AI Summarization Engine",
    tag: "RESEARCH · NLP",
    summary:
      "Transformer-based NLP pipeline for automatic text summarization, presented at ICCIMA.",
    description:
      "Research into extractive and abstractive text summarization using transformer architectures, benchmarked across multiple corpora. Findings were presented at the ICCIMA conference, contributing to applied NLP summarization techniques.",
    stack: ["PyTorch", "Transformers", "NLP", "Python"],
    repoHref: "https://github.com/var-rishabh",
  },
];
