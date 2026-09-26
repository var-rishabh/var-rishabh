export interface StackGroup {
  id: string;
  title: string;
  span: "lg" | "md";
  items: string[];
}

export const stackGroups: StackGroup[] = [
  {
    id: "languages-backend",
    title: "Languages & Backend",
    span: "lg",
    items: ["Python", "TypeScript", "Node.js", "C++", "SQL", "REST", "gRPC"],
  },
  {
    id: "ai-ml-data",
    title: "AI/ML & Data",
    span: "md",
    items: ["PyTorch", "NLP Summarization", "ML Pipelines"],
  },
  {
    id: "cloud-infra",
    title: "Cloud & Infra",
    span: "md",
    items: ["Docker", "Git", "CI/CD", "Linux", "System Architecture"],
  },
];
