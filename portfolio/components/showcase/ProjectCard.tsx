"use client";

import type { Project } from "@/data/projects";

/**
 * Single project card for the DOM-based showcase list/grid.
 * Kept as plain markup for now — motion (framer-motion) and any
 * scene-linking (hover → highlight sceneNodeId in the 3D layer) come later.
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-muted/30 p-6 backdrop-blur-sm">
      <h3 className="font-mono text-lg text-foreground">{project.title}</h3>
      <p className="mt-2 text-sm text-muted">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2 text-xs text-accent">
        {project.stack.map((tech) => (
          <li key={tech} className="rounded border border-accent/30 px-2 py-1">
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}
