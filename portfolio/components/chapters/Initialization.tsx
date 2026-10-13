"use client";

import { motion } from "framer-motion";
import Chapter from "@/components/hud/Chapter";
import FieldMap from "@/components/hud/FieldMap";
import HudButton from "@/components/hud/HudButton";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { CHAPTERS, CONTACT, HEADLINE_METRICS, PROFILE } from "@/data/chapters";
import { revealItem } from "@/lib/motion";

function Metrics() {
  return (
    <motion.dl
      variants={revealItem}
      className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:max-w-none sm:flex-wrap sm:gap-x-8"
    >
      {HEADLINE_METRICS.map((metric) => (
        <div key={metric.label}>
          <dt className="sr-only">{metric.label}</dt>
          <dd className="font-display text-2xl font-bold leading-none text-chrome sm:text-3xl">{metric.value}</dd>
          <dd className="mt-1.5 text-telemetry uppercase text-graphite">{metric.label}</dd>
        </div>
      ))}
    </motion.dl>
  );
}

/**
 * Chapter 01 — the wide establishing shot of the whole machine: identity,
 * headline metrics, status and the field map of every domain shipped in.
 */
export default function Initialization({ ready }: { ready: boolean }) {
  return (
    <Chapter index={0} valign="end" revealed={ready}>
      <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-end lg:gap-10">
        <div className="scrim min-w-0 max-w-4xl flex-1">
          <ChapterTag index={0} aside="SYS.BOOT" />
          <Headline as="h1" id="initialization-title" size="mega" lines={["Rishabh", "Varshney"]} className="mt-5" />
          <motion.p variants={revealItem} className="mt-5 text-lg text-chrome sm:text-2xl">
            <span className="text-amber">{"//"}</span> {PROFILE.title}{" "}
            {PROFILE.focus.split(" · ").map((segment) => (
              <span key={segment} className="whitespace-nowrap text-silver/80">
                · {segment}{" "}
              </span>
            ))}
          </motion.p>
          <Lead className="mt-4">
            I build cloud telephony, real-time and AI-assisted systems end to end — WebRTC calling and
            SIP media servers, OCPP charger networks and data pipelines, plus the React interfaces on
            top. Scroll to descend through the machine.
          </Lead>
          <Metrics />
          <motion.div variants={revealItem} className="mt-7 flex flex-wrap items-center gap-3">
            <HudButton href={`#${CHAPTERS[1].id}`}>Descend ↓</HudButton>
            <HudButton href={CONTACT.resume} download variant="ghost">
              Resume ↓
            </HudButton>
            <HudButton href={CONTACT.github} target="_blank" rel="noreferrer noopener" variant="ghost">
              GitHub ↗
            </HudButton>
          </motion.div>
          <motion.p variants={revealItem} className="mt-5 text-telemetry uppercase text-graphite">
            Status: <span className="text-amber">Available for impactful roles</span> {"//"} Loc: Hyderabad / Remote
          </motion.p>
        </div>
        <FieldMap className="w-full max-w-md lg:w-[23rem] lg:shrink-0" />
      </div>
    </Chapter>
  );
}
