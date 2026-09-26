"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

const TILT_SPRING = { stiffness: 120, damping: 20 };
const GLOW_SPRING = { stiffness: 200, damping: 26 };
const TILT_RANGE_DEG = 8;

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * Interactive card that tracks the pointer to render a radial spotlight
 * glow and a subtle 3D tilt, both driven by spring physics rather than
 * instant snapping.
 */
export default function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(94, 234, 212, 0.16)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glowX = useSpring(pointerX, GLOW_SPRING);
  const glowY = useSpring(pointerY, GLOW_SPRING);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);

  const background = useMotionTemplate`radial-gradient(280px circle at ${glowX}px ${glowY}px, ${spotlightColor}, transparent 72%)`;

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pointerX.set(x);
    pointerY.set(y);

    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    rawRotateY.set(normalizedX * TILT_RANGE_DEG);
    rawRotateX.set(-normalizedY * TILT_RANGE_DEG);
  }

  function handleMouseLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/60 transition-colors duration-300 hover:border-white/20",
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
