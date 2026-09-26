"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 120, damping: 20 };

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends HTMLMotionProps<"a"> {
  children: ReactNode;
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-accent text-background border-transparent",
  secondary: "bg-white/5 text-foreground border-white/15 hover:border-white/30",
  ghost: "bg-transparent text-foreground/80 border-white/10 hover:text-foreground",
};

/**
 * Shared CTA/anchor button with spring-physics hover + tap feedback,
 * used across the hero, contact console, and project cards.
 */
export default function Button({
  children,
  variant = "primary",
  className,
  ...anchorProps
}: ButtonProps) {
  return (
    <motion.a
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...anchorProps}
    >
      {children}
    </motion.a>
  );
}
