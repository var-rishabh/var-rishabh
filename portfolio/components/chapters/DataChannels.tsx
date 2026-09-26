"use client";

import Chapter from "@/components/hud/Chapter";
import ModuleReadout from "@/components/hud/ModuleReadout";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { BACKEND_MODULES } from "@/data/chapters";

/** Chapter 03 — the camera pans down the server-rack corridor. */
export default function DataChannels() {
  return (
    <Chapter index={2}>
      <div className="scrim ml-auto w-full max-w-[38rem]">
        <ChapterTag index={2} aside="DATA.CHANNELS" />
        <Headline id="throughput-title" lines={["Data", "Channels"]} className="mt-4" />
        <Lead className="mt-4">
          Backend systems built for sustained load — streams in, events out, services that stay up.
        </Lead>
        <div className="mt-6 grid gap-2.5 short:mt-4">
          {BACKEND_MODULES.map((module) => (
            <ModuleReadout key={module.code} module={module} />
          ))}
        </div>
      </div>
    </Chapter>
  );
}
