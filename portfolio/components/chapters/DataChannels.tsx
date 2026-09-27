"use client";

import Chapter from "@/components/hud/Chapter";
import ModuleReadout from "@/components/hud/ModuleReadout";
import StackReadout from "@/components/hud/StackReadout";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { PROJECTS } from "@/data/chapters";

/**
 * Chapter 03 — the camera flies down the corridor of racks and fibre lanes:
 * real-time projects (WebSocket streams, microservices) and the toolchain.
 */
export default function DataChannels() {
  return (
    <Chapter index={2}>
      <div className="scrim ml-auto w-full max-w-[38rem]">
        <ChapterTag index={2} aside="DATA.CHANNELS" />
        <Headline id="projects-title" lines={["Data", "Channels"]} className="mt-4" />
        <Lead className="mt-4">
          Real-time products end to end — WebSocket streams, stateless microservices and the
          interfaces on top of them.
        </Lead>
        <div className="mt-6 grid gap-2.5 short:mt-4">
          {PROJECTS.map((module) => (
            <ModuleReadout key={module.code} module={module} />
          ))}
          <StackReadout />
        </div>
      </div>
    </Chapter>
  );
}
