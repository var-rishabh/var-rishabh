"use client";

import { motion } from "framer-motion";
import { FIELDS, FIELDS_WORKED } from "@/data/chapters";
import { revealItem } from "@/lib/motion";

/**
 * Selected fields Rishabh has shipped in, as a system readout: index, field
 * and where it came from (the header carries the overall total). Desktop shows the full table with sources;
 * phones get a compact two-column grid so the hero stays short.
 */
export default function FieldMap({ className }: { className?: string }) {
  return (
    <motion.section variants={revealItem} className={`panel corner-marks p-4 ${className ?? ""}`} aria-labelledby="field-map-title">
      <header className="flex items-baseline justify-between border-b border-line pb-2 text-telemetry uppercase">
        <h2 id="field-map-title" className="text-silver">
          field.map
        </h2>
        <span className="text-graphite">
          <span className="font-display text-base font-bold tracking-normal text-amber">{FIELDS_WORKED}</span> fields worked in
        </span>
      </header>

      <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-telemetry uppercase lg:grid-cols-1">
        {FIELDS.map((field, i) => (
          <motion.li key={field.name} variants={revealItem} className="flex items-center gap-2">
            <span className="text-amber">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-chrome">{field.name}</span>
            <span aria-hidden className="hidden flex-1 border-b border-dotted border-graphite/40 lg:block" />
            <span className="hidden text-graphite lg:inline">{field.source}</span>
          </motion.li>
        ))}
      </ol>
    </motion.section>
  );
}
