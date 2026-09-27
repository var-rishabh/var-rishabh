"use client";

import { motion } from "framer-motion";
import { CHAPTERS } from "@/data/chapters";
import { revealItem, revealLine } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** `[02] EXPERIENCE ──── RUNTIME.CORE` — chapter metadata rule. */
export function ChapterTag({ index, aside }: { index: number; aside: string }) {
  const chapter = CHAPTERS[index];
  return (
    <motion.div
      variants={revealItem}
      className="flex items-center gap-3 text-telemetry uppercase text-graphite"
    >
      <span className="text-amber">[{chapter.code}]</span>
      <span className="text-silver">{chapter.label}</span>
      <span aria-hidden className="hidden h-px w-16 bg-line sm:block" />
      <span className="hidden sm:inline">{aside}</span>
    </motion.div>
  );
}

interface HeadlineProps {
  id: string;
  lines: string[];
  as?: "h1" | "h2";
  size?: "mega" | "giga";
  className?: string;
}

/** Brutalist display headline; each line rises out of its own mask. */
export function Headline({ id, lines, as: Tag = "h2", size = "giga", className }: HeadlineProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-display font-extrabold uppercase text-chrome",
        size === "mega" ? "text-mega" : "text-giga",
        className,
      )}
    >
      {lines.map((line) => (
        <span key={line} className="block overflow-y-clip pb-[0.04em]">
          <motion.span className="block" variants={revealLine}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.p
      variants={revealItem}
      className={cn("max-w-xl text-[13px] leading-relaxed text-silver/85 short:hidden", className)}
    >
      {children}
    </motion.p>
  );
}
