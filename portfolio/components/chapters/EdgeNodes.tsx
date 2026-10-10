"use client";

import Chapter from "@/components/hud/Chapter";
import ModuleReadout from "@/components/hud/ModuleReadout";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { PROJECTS } from "@/data/chapters";

/**
 * Chapter 04 — deeper down the corridor, the machine's edge nodes:
 * freelance platforms shipped into the field, each linked to its site.
 */
export default function EdgeNodes() {
  return (
    <Chapter index={3}>
      <div className="scrim w-full max-w-[38rem]">
        <ChapterTag index={3} aside="EDGE.NODES" />
        <Headline id="projects-title" lines={["Edge", "Nodes"]} className="mt-4" />
        <Lead className="mt-4">
          Freelance platforms shipped into the field — an EV-charging network and an accounting
          product, each linked below.
        </Lead>
        <div className="mt-6 grid gap-2.5 short:mt-4">
          {PROJECTS.map((module) => (
            <ModuleReadout key={module.code} module={module} />
          ))}
        </div>
      </div>
    </Chapter>
  );
}
