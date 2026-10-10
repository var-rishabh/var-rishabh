"use client";

import Chapter from "@/components/hud/Chapter";
import ModuleReadout from "@/components/hud/ModuleReadout";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { CURRENT_ROLE } from "@/data/chapters";

/**
 * Chapter 02 — the camera dives into the core. The core is what runs live
 * today: the cloud telephony platform at RUNO, given a chapter of its own.
 */
export default function RuntimeCore() {
  return (
    <Chapter index={1}>
      <div className="scrim w-full max-w-[38rem]">
        <ChapterTag index={1} aside="RUNTIME.CORE" />
        <Headline id="current-title" lines={["Runtime", "Core"]} className="mt-4" />
        <Lead className="mt-4">
          The live system at the heart of the machine: a cloud telephony and contact-centre CRM —
          carrier webhooks and SIP media up through the calling experience agents use every day.
        </Lead>
        <div className="mt-6 grid gap-2.5 short:mt-4">
          <ModuleReadout module={CURRENT_ROLE} />
        </div>
      </div>
    </Chapter>
  );
}
