"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, transform, useScroll, useTransform } from "framer-motion";
import { CHAPTERS } from "@/data/chapters";
import { revealGroup } from "@/lib/motion";
import { isCompactViewport, viewportHeight } from "@/lib/viewport";
import { cn } from "@/lib/utils";

/** On phones a chapter only adds this much (× viewport) of camera travel. */
const COMPACT_SPACER = 0.3;
/** Panels taller than the viewport (beyond rounding) scroll-then-pin. */
const OVERFLOW_TOLERANCE_PX = 1;

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

interface Layout {
  height: number | string;
  stickyTop: number;
}

/**
 * One chapter of the scroll timeline: a section whose panel stays pinned
 * (sticky) while a spacer below it gives the camera room to fly.
 *
 * - Desktop: panel is one screen, spacer is `screens - 1` screens.
 * - Phones: the section is sized to its content plus a short spacer, so
 *   moving between chapters takes a swipe or two instead of five.
 * - Panels taller than the viewport get a negative sticky offset: they
 *   scroll until their bottom edge is visible and only then pin.
 *
 * Opacity is tied to the section's own scroll progress (stops recomputed
 * from the measured height), so chapters cross-fade over half a screen
 * before they pin and half a screen after they release.
 */
export default function Chapter({ index, children, valign = "center", revealed }: ChapterProps) {
  const chapter = CHAPTERS[index];
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ height: `${chapter.screens * 100}vh`, stickyTop: 0 });

  const span = chapter.screens + 1;
  const stops = useRef({ pinStart: 1 / span, pinEnd: chapter.screens / span, fade: 0.5 / span });

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const update = () => {
      const vh = viewportHeight();
      const panelHeight = panel.offsetHeight;
      const overflows = panelHeight > vh + OVERFLOW_TOLERANCE_PX;
      const spacer = vh * (isCompactViewport() ? COMPACT_SPACER : chapter.screens - 1);
      const height = Math.round(Math.max(panelHeight, vh) + spacer);
      const travel = height + vh;

      stops.current = { pinStart: vh / travel, pinEnd: height / travel, fade: (0.5 * vh) / travel };
      const stickyTop = overflows ? vh - panelHeight : 0;
      setLayout((prev) => (prev.height === height && prev.stickyTop === stickyTop ? prev : { height, stickyTop }));
    };

    const observer = new ResizeObserver(update);
    observer.observe(panel);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [chapter.screens]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const isFirst = index === 0;
  const isLast = index === CHAPTERS.length - 1;
  const fadeStops = () => {
    const { pinStart, pinEnd, fade } = stops.current;
    return [pinStart - fade, pinStart, pinEnd, pinEnd + fade];
  };
  const opacity = useTransform(scrollYProgress, (p) =>
    transform(p, fadeStops(), [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]),
  );
  const y = useTransform(scrollYProgress, (p) =>
    transform(p, fadeStops(), [isFirst ? 0 : 48, 0, 0, isLast ? 0 : -48]),
  );

  const trigger =
    revealed === undefined
      ? { whileInView: "visible", viewport: { amount: 0.25 } }
      : { animate: revealed ? "visible" : "hidden" };

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      aria-labelledby={`${chapter.id}-title`}
      className="relative"
      style={{ height: layout.height }}
    >
      <div
        ref={panelRef}
        style={{ top: layout.stickyTop }}
        className={cn(
          "sticky flex min-h-screen overflow-x-clip",
          valign === "end" ? "items-end pb-[12vh] pt-24 short:pb-16" : "items-center pb-14 pt-20",
        )}
      >
        <motion.div
          style={{ opacity, y }}
          initial="hidden"
          variants={revealGroup}
          className="section-shell flex will-change-transform"
          {...trigger}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
