"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useSpring, useTransform, type MotionValue } from "framer-motion";
import { CHAPTERS, PROFILE } from "@/data/chapters";
import { chapterIndexAt } from "@/lib/timeline";
import { useHolds } from "@/hooks/useTimeline";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Nominal machine length in metres, only for the depth readout. */
const MACHINE_DEPTH_M = 52.4;

/**
 * Fixed heads-up display over the canvas: brand + chapter navigation on
 * top, a scroll-progress rail with chapter ticks on the right, and live
 * telemetry (depth, chapter) along the bottom edge. Scroll-linked values
 * are MotionValues rendered directly, so scrolling never re-renders the
 * HUD except when the active chapter actually changes.
 */
export default function Hud({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const holds = useHolds();
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollProgress, "change", (value) => setActive(chapterIndexAt(value)));

  const rail = useSpring(scrollProgress, { stiffness: 120, damping: 20 });
  const depth = useTransform(scrollProgress, (value) => (value * MACHINE_DEPTH_M).toFixed(1).padStart(4, "0"));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 bg-void/90 md:bg-transparent md:bg-gradient-to-b md:from-void/90 md:via-void/50 md:to-transparent">
        <div className="section-shell flex items-center justify-between py-4 sm:py-5">
          <a href={`#${CHAPTERS[0].id}`} className="group flex items-center gap-3 text-telemetry uppercase">
            <span className="grid h-8 w-8 place-items-center border border-line bg-void/60 font-display text-[13px] font-bold tracking-normal text-chrome transition-colors group-hover:border-amber/60">
              RV
            </span>
            <span className="hidden text-silver sm:block">Rishabh Varshney</span>
            <span className="hidden text-graphite md:block">{"// Machine Room"}</span>
          </a>

          <nav aria-label="Chapters">
            <ul className="flex items-center">
              {CHAPTERS.map((chapter, i) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    aria-current={active === i ? "step" : undefined}
                    aria-label={`Chapter ${chapter.code}: ${chapter.label}`}
                    className={cn(
                      "relative block px-2.5 py-2 text-telemetry uppercase transition-colors duration-200",
                      active === i ? "text-chrome" : "text-graphite hover:text-silver",
                    )}
                  >
                    <span className={active === i ? "text-amber" : undefined}>{chapter.code}</span>
                    <span className="ml-1.5 hidden lg:inline">{chapter.shortLabel}</span>
                    {active === i && (
                      <motion.span
                        layoutId="hud-active-chapter"
                        transition={SPRING}
                        className="absolute inset-x-2.5 -bottom-px h-px bg-amber"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div aria-hidden className="fixed right-5 top-1/2 z-30 hidden h-[36vh] -translate-y-1/2 md:block lg:right-8">
        <div className="relative h-full w-px bg-line">
          <motion.div className="absolute inset-0 origin-top bg-amber" style={{ scaleY: rail }} />
          {holds.map((hold, i) => (
            <span
              key={CHAPTERS[i].id}
              className={cn(
                "absolute -left-[3px] h-[7px] w-[7px] border transition-colors duration-300",
                i <= active ? "border-amber bg-amber" : "border-graphite bg-void",
              )}
              style={{ top: `calc(${hold.start * 100}% - 3px)` }}
            />
          ))}
        </div>
      </div>

      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden sm:block short:hidden">
        <div className="section-shell flex items-end justify-between pb-5 text-telemetry uppercase text-graphite">
          <div className="flex gap-6">
            <span>
              Depth <motion.span className="tabular-nums text-silver">{depth}</motion.span> m
            </span>
            <span>
              Ch <span className="text-silver">{CHAPTERS[active].code}</span>/{String(CHAPTERS.length).padStart(2, "0")}
            </span>
            <span className="hidden md:inline">{CHAPTERS[active].label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline">{PROFILE.coordinates}</span>
            <span className="text-amber">● Online</span>
          </div>
        </div>
      </div>
    </>
  );
}
