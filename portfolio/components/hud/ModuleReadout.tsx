"use client";

import { motion } from "framer-motion";
import type { SystemModule } from "@/data/chapters";
import { revealItem, SPRING } from "@/lib/motion";

/**
 * A role or project rendered as a module readout inside the machine —
 * code, period / classification, title (+ role), a metric-led summary and
 * its stack as telemetry. Summaries clamp on short viewports so a pinned chapter
 * never overflows its screen.
 */
export default function ModuleReadout({ module }: { module: SystemModule }) {
  return (
    <motion.article
      variants={revealItem}
      whileHover={{ x: 4 }}
      transition={SPRING}
      className="panel corner-marks p-4 transition-colors duration-300 hover:border-amber/40"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-telemetry uppercase">
        <span className="text-amber">{module.code}</span>
        <span className="text-graphite">{module.kind}</span>
      </header>
      <h3 className="mt-1.5 font-display text-lg font-bold leading-tight text-chrome sm:text-xl">
        {module.title}
      </h3>
      {module.role && <p className="mt-0.5 text-telemetry uppercase text-silver/90">{module.role}</p>}
      <p className="mt-2 text-[12.5px] leading-relaxed text-silver/85 short:line-clamp-2">{module.summary}</p>
      <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-telemetry uppercase text-titanium">
        {module.stack.map((tech, i) => (
          <li key={tech} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-graphite/60">/</span>}
            {tech}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
