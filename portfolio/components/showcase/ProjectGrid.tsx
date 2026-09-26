"use client";

import { projects } from "@/data/projects";
import ProjectCard from "@/components/showcase/ProjectCard";

/**
 * Featured projects section. Section heading + responsive card grid;
 * scroll-triggered reveal lives in ProjectCard itself.
 */
export default function ProjectGrid() {
  return (
    <section id="projects" className="section-shell py-24 sm:py-32">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs text-accent">{"// FEATURED PROJECTS"}</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Systems I&apos;ve built
        </h2>
        <p className="mt-3 text-sm text-muted sm:text-base">
          A mix of applied AI/ML, backend infrastructure, and research —
          spanning intelligent tooling, streaming pipelines, and NLP.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
