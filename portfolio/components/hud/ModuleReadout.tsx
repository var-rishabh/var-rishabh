"use client";

import { motion } from "framer-motion";
import type { SystemModule } from "@/data/chapters";
import { revealItem, SPRING } from "@/lib/motion";

/**
 * A role or project rendered as a module readout inside the machine:
 * code + field tag + period, title (with a live link for shipped
 * projects), role, metric-led highlight lines and the stack as telemetry.
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
        <span className="flex flex-wrap items-center gap-x-2">
          <span className="text-amber">{module.code}</span>
          <span aria-hidden className="text-graphite/60">{"//"}</span>
          <span className="text-titanium">{module.domain}</span>
        </span>
        <span className="text-graphite">{module.period}</span>
      </header>

      <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-lg font-bold leading-tight text-chrome sm:text-xl">{module.title}</h3>
        {module.link && (
          <a
            href={module.link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-telemetry uppercase text-amber underline-offset-4 transition-colors hover:text-chrome hover:underline"
          >
            {module.link.label} ↗
          </a>
        )}
      </div>
      {module.role && (
        <p className="mt-0.5 text-telemetry uppercase text-silver/90">
          {module.role}
          {module.location && <span className="text-graphite"> · {module.location}</span>}
        </p>
      )}

      <ul className="mt-2.5 space-y-1.5 text-[12.5px] leading-relaxed text-silver/85">
        {module.highlights.map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden className="select-none text-amber">›</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-telemetry uppercase text-titanium" aria-label="Stack">
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
