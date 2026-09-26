"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CHAPTERS } from "@/data/chapters";
import { revealGroup } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ChapterProps {
  index: number;
  children: ReactNode;
  /** Vertical placement of the pinned panel. */
  valign?: "center" | "end";
  /**
   * When set, the staggered reveal is driven by this flag (used by the
   * first chapter to wait for the boot curtain) instead of by visibility.
   */
  revealed?: boolean;
}

/**
 * One chapter of the scroll timeline: a section `screens × 100vh` tall
 * whose panel stays pinned (sticky) for one screen while the rest of the
 * section acts as the spacer the camera flies through. Opacity is tied to
 * the section's own scroll progress, so chapters cross-fade cleanly:
 * each fades in over the half-screen before it pins and out over the
 * half-screen after it releases.
 *
 * Panels taller than the viewport (small phones, short laptops) get a
 * negative sticky offset: they scroll until their bottom edge is visible
 * and only then pin, so nothing is ever cut off.
 */
export default function Chapter({ index, children, valign = "center", revealed }: ChapterProps) {
  const chapter = CHAPTERS[index];
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const update = () => setStickyTop(Math.min(0, window.innerHeight - panel.offsetHeight));
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const span = chapter.screens + 1;
  const pinStart = 1 / span;
  const pinEnd = chapter.screens / span;
  const fade = 0.5 / span;
  const isFirst = index === 0;
  const isLast = index === CHAPTERS.length - 1;
  const stops = [pinStart - fade, pinStart, pinEnd, pinEnd + fade];

  const opacity = useTransform(scrollYProgress, stops, [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]);
  const y = useTransform(scrollYProgress, stops, [isFirst ? 0 : 56, 0, 0, isLast ? 0 : -56]);

  const trigger =
    revealed === undefined
      ? { whileInView: "visible", viewport: { amount: 0.3 } }
      : { animate: revealed ? "visible" : "hidden" };

  return (
    <section
      id={chapter.id}
      ref={ref}
      aria-labelledby={`${chapter.id}-title`}
      className="relative"
      style={{ height: `${chapter.screens * 100}vh` }}
    >
      <div
        ref={panelRef}
        style={{ top: stickyTop }}
        className={cn(
          "sticky flex min-h-screen overflow-x-clip",
          valign === "end" ? "items-end pb-[12vh] pt-24 short:pb-16" : "items-center pb-14 pt-20",
        )}
      >
        <motion.div
          style={{ opacity, y }}
          initial="hidden"
          variants={revealGroup}
          className="section-shell flex"
          {...trigger}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
