"use client";

import Chapter from "@/components/hud/Chapter";
import ModuleReadout from "@/components/hud/ModuleReadout";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { EXPERIENCE } from "@/data/chapters";

/**
 * Chapter 02 — the camera dives into the core. The core is what runs live:
 * production roles, where interfaces and service layers are used daily.
 */
export default function RuntimeCore() {
  return (
    <Chapter index={1}>
      <div className="scrim w-full max-w-[38rem]">
        <ChapterTag index={1} aside="RUNTIME.CORE" />
        <Headline id="experience-title" lines={["Runtime", "Core"]} className="mt-4" />
        <Lead className="mt-4">
          The core of the machine is what runs in production — interfaces and service layers people
          use every day.
        </Lead>
        <div className="mt-6 grid gap-2.5 short:mt-4">
          {EXPERIENCE.map((module) => (
            <ModuleReadout key={module.code} module={module} />
          ))}
        </div>
      </div>
    </Chapter>
  );
}
