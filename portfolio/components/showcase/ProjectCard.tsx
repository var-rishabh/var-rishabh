"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import SpotlightCard from "@/components/ui/SpotlightCard";

const SPRING = { type: "spring" as const, stiffness: 120, damping: 20 };

/**
 * Single project card for the DOM-based showcase grid, wrapped in
 * SpotlightCard for the pointer-tracked glow + tilt.
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={SPRING}
      className="h-full"
    >
      <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
        <span className="font-mono text-xs text-accent">{project.tag}</span>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted/80">
          {project.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2 text-xs text-accent">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-accent/25 bg-accent/5 px-2.5 py-1 font-mono"
            >
              {tech}
            </li>
          ))}
        </ul>
        {project.repoHref && (
          <a
            href={project.repoHref}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-foreground/70 transition-colors hover:text-accent"
          >
            View source →
          </a>
        )}
      </SpotlightCard>
    </motion.div>
  );
}
