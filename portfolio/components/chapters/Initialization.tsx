"use client";

import { motion } from "framer-motion";
import Chapter from "@/components/hud/Chapter";
import HudButton from "@/components/hud/HudButton";
import { ChapterTag, Headline, Lead } from "@/components/hud/Typography";
import { CHAPTERS, CONTACT, HEADLINE_METRICS, PROFILE } from "@/data/chapters";
import { revealItem } from "@/lib/motion";

const BOOT_LOG: Array<[status: string, unit: string, state: string]> = [
  ["OK", "ui.runtime", "mounted"],
  ["OK", "component.library", "loaded"],
  ["OK", "realtime.channels", "online"],
  ["OK", "ci.pipeline", "green"],
  ["OK", "operator", "connected"],
];

function BootLog() {
  return (
    <motion.div
      variants={revealItem}
      className="panel hidden w-[22rem] p-4 text-telemetry uppercase lg:block"
      aria-label="System boot log"
    >
      <div className="flex justify-between border-b border-line pb-2 text-graphite">
        <span>boot.log</span>
        <span>tty0</span>
      </div>
      <ol className="mt-3 space-y-1.5">
        {BOOT_LOG.map(([status, unit, state]) => (
          <motion.li key={unit} variants={revealItem} className="flex items-center gap-2">
            <span className={status === "OK" ? "text-amber" : "text-titanium"}>[{status.padEnd(2)}]</span>
            <span className="text-silver">{unit}</span>
            <span aria-hidden className="flex-1 border-b border-dotted border-graphite/40" />
            <span className="text-graphite">{state}</span>
          </motion.li>
        ))}
      </ol>
      <div className="mt-3 text-silver">
        &gt; descend<span className="ml-0.5 animate-blink text-amber">_</span>
      </div>
    </motion.div>
  );
}

/**
 * Chapter 01 — the wide establishing shot of the whole machine, with
 * identity, headline metrics, status and boot telemetry.
 */
function Metrics() {
  return (
    <motion.dl variants={revealItem} className="mt-6 grid max-w-md grid-cols-3 gap-4 sm:flex sm:max-w-none sm:gap-8">
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

export default function Initialization({ ready }: { ready: boolean }) {
  return (
    <Chapter index={0} valign="end" revealed={ready}>
      <div className="flex w-full flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
        <div className="scrim max-w-4xl">
          <ChapterTag index={0} aside="SYS.BOOT" />
          <Headline as="h1" id="initialization-title" size="mega" lines={["Rishabh", "Varshney"]} className="mt-5" />
          <motion.p variants={revealItem} className="mt-5 text-lg text-chrome sm:text-2xl">
            <span className="text-amber">{"//"}</span> {PROFILE.title}{" "}
            <span className="text-silver/80">· {PROFILE.focus}</span>
          </motion.p>
          <Lead className="mt-4">
            Frontend-focused engineer shipping UI-heavy B2B SaaS — reusable component libraries,
            real-time interfaces over WebSockets and REST, and the Node.js services behind them.
            Scroll to descend through the machine.
          </Lead>
          <Metrics />
          <motion.div variants={revealItem} className="mt-7 flex flex-wrap items-center gap-3">
            <HudButton href={`#${CHAPTERS[1].id}`}>Descend ↓</HudButton>
            <HudButton href={CONTACT.resume} download variant="ghost">
              Resume ↓
            </HudButton>
          </motion.div>
          <motion.p variants={revealItem} className="mt-5 text-telemetry uppercase text-graphite">
            Status: <span className="text-amber">Available for impactful roles</span> {"//"} Loc: Gurugram / Remote
          </motion.p>
        </div>
        <BootLog />
      </div>
    </Chapter>
  );
}
