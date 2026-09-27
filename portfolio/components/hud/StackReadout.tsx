"use client";

import { motion } from "framer-motion";
import { STACK } from "@/data/chapters";
import { revealItem } from "@/lib/motion";

/** Toolchain as a telemetry table — one line per layer of the stack. */
export default function StackReadout() {
  return (
    <motion.div variants={revealItem} className="panel p-4" aria-label="Technical stack">
      <div className="flex items-center justify-between text-telemetry uppercase">
        <span className="text-amber">SYS-STACK</span>
        <span className="text-graphite">toolchain.cfg</span>
      </div>
      <dl className="mt-3 space-y-1.5 text-[12px] leading-relaxed">
        {STACK.map(({ group, items }) => (
          <div key={group} className="grid gap-0.5 sm:grid-cols-[7.5rem_1fr] sm:gap-3">
            <dt className="text-telemetry uppercase leading-[1.9] text-graphite">{group}</dt>
            <dd className="text-silver/90">{items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
