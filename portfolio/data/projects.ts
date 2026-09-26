export interface Project {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  href?: string;
  repoHref?: string;
  // Optional: id of a 3D "node" in the scene this project is anchored to,
  // once the spatial layout (floating nodes / workstation panels) exists.
  sceneNodeId?: string;
}

// Placeholder — replace with real project data. Keep metrics honest;
// do not fabricate numbers (see CareerForge AI project instructions).
export const projects: Project[] = [
  {
    id: "project-1",
    title: "[Insert project title]",
    summary: "[Insert one-line project summary]",
    stack: ["Next.js", "TypeScript"],
  },
];
