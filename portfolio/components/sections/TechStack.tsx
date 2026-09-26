"use client";

import { motion } from "framer-motion";
import { stackGroups } from "@/data/stack";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 120, damping: 20 };

/**
 * Core technical stack, laid out as a bento grid — the "Languages &
 * Backend" group spans two columns on larger screens since it holds the
 * most items, the other two groups sit side by side beneath it.
 */
export default function TechStack() {
  return (
    <section id="stack" className="section-shell py-24 sm:py-32">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-xs text-accent">{"// CORE STACK"}</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Tools of the trade
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {stackGroups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...SPRING, delay: index * 0.08 }}
            className={cn(group.span === "lg" && "sm:col-span-2")}
          >
            <SpotlightCard className="h-full p-6 sm:p-7">
              <h3 className="font-mono text-sm text-accent">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {group.items.map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ scale: 1.06, y: -2 }}
                    transition={SPRING}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-foreground/90"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
