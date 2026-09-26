"use client";

import Chapter from "@/components/hud/Chapter";
import ModuleReadout from "@/components/hud/ModuleReadout";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { AI_MODULES } from "@/data/chapters";

/** Chapter 02 — the camera dives into the glowing AI/ML core. */
export default function NeuralCore() {
  return (
    <Chapter index={1}>
      <div className="scrim w-full max-w-[38rem]">
        <ChapterTag index={1} aside="CORE.MODULE" />
        <Headline id="processing-title" lines={["Neural", "Core"]} className="mt-4" />
        <Lead className="mt-4">
          The central module: language models, tool orchestration and summarization pipelines that
          turn unstructured text into decisions.
        </Lead>
        <div className="mt-6 grid gap-2.5 short:mt-4">
          {AI_MODULES.map((module) => (
            <ModuleReadout key={module.code} module={module} />
          ))}
        </div>
      </div>
    </Chapter>
  );
}
