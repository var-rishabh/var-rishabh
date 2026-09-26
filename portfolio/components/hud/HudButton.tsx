"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

interface HudButtonProps extends HTMLMotionProps<"a"> {
  children: ReactNode;
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  primary: "border-amber bg-amber text-void hover:bg-[#ffb066]",
  ghost: "border-line bg-void/40 text-chrome hover:border-amber/60 hover:text-amber",
};

/** Hard-edged mono CTA with spring hover/tap feedback. */
export default function HudButton({ children, variant = "primary", className, ...props }: HudButtonProps) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      className={cn(
        "inline-flex items-center gap-2 border px-4 py-2.5 text-telemetry uppercase transition-colors duration-200",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.a>
  );
}
