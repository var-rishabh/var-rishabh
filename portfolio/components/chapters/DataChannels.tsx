"use client";

import Chapter from "@/components/hud/Chapter";
import ModuleReadout from "@/components/hud/ModuleReadout";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { EARLIER_ROLES } from "@/data/chapters";

/**
 * Chapter 03 — the camera enters the corridor of racks and fibre lanes:
 * earlier roles built on moving data — ingestion pipelines, chat over
 * WebSockets, MQTT device messaging and webhooks.
 */
export default function DataChannels() {
  return (
    <Chapter index={2}>
      <div className="scrim ml-auto w-full max-w-[38rem]">
        <ChapterTag index={2} aside="DATA.CHANNELS" />
        <Headline id="earlier-title" lines={["Data", "Channels"]} className="mt-4" />
        <Lead className="mt-4">
          Where the pipelines started — ingestion at scale, real-time chat, and devices talking to apps
          over MQTT and webhooks.
        </Lead>
        <div className="mt-6 grid gap-2.5 short:mt-4">
          {EARLIER_ROLES.map((module) => (
            <ModuleReadout key={module.code} module={module} />
          ))}
        </div>
      </div>
    </Chapter>
  );
}
