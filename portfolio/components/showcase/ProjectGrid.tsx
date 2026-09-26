"use client";

import { projects } from "@/data/projects";
import ProjectCard from "@/components/showcase/ProjectCard";

/**
 * Layout wrapper for the project showcase section. Not yet mounted into
 * app/page.tsx — wire in once the section/scroll structure is decided
 * (single-page scroll vs. route-per-section).
 */
export default function ProjectGrid() {
  return (
    <section id="projects" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}
