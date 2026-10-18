"use client";

import { useEffect, useState, type RefObject } from "react";
import { CHAPTERS } from "@/data/chapters";
import { viewportHeight } from "@/lib/viewport";

/** Longest distance a user travels between two stops inside a tall panel. */
const STEP_SCREENS = 0.8;

/**
 * Document offsets (px) where the page is allowed to come to rest: the top
 * of every chapter, plus intermediate stops through panels taller than the
 * viewport so none of their content is ever unreachable.
 */
function measureStops(): number[] {
  const vh = viewportHeight();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const stops: number[] = [];

  for (const chapter of CHAPTERS) {
    const section = document.getElementById(chapter.id);
    if (!section) continue;
    const top = Math.round(section.getBoundingClientRect().top + window.scrollY);
    const overflow = Math.round(Number(section.dataset.overflow) || 0);

    stops.push(top);
    // Walk down a tall panel in <= STEP_SCREENS strides, ending exactly on
    // the offset where its bottom edge becomes visible.
    const strides = Math.ceil(overflow / (vh * STEP_SCREENS));
    for (let i = 1; i <= strides; i += 1) stops.push(top + Math.round((overflow * i) / strides));
  }

  return stops.map((stop) => Math.min(stop, Math.max(max, 0)));
}

/**
 * Invisible CSS scroll-snap targets (see `.snap-stop` in globals.css). The
 * page uses native `scroll-snap-type: y mandatory` with
 * `scroll-snap-stop: always`, so a wheel flick, trackpad fling or swipe
 * advances exactly one stop and always settles on a full chapter panel
 * instead of the empty cross-fade between two of them.
 */
export default function SnapStops({ container }: { container: RefObject<HTMLElement | null> }) {
  const [stops, setStops] = useState<number[]>([0]);

  useEffect(() => {
    const node = container.current;
    if (!node) return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = measureStops();
        setStops((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    measure();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [container]);

  return (
    <div className="snap-stops" aria-hidden>
      {stops.map((top, i) => (
        <span key={i} className="snap-stop" style={{ top }} />
      ))}
    </div>
  );
}
