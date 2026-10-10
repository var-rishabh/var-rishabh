"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";
import { DEFAULT_HOLDS, getHolds, measureHolds, subscribeHolds, type HoldRange } from "@/lib/timeline";
import { viewportHeight } from "@/lib/viewport";

/** Current chapter hold ranges; re-renders only when the layout changes. */
export function useHolds(): HoldRange[] {
  return useSyncExternalStore(subscribeHolds, getHolds, () => DEFAULT_HOLDS);
}

/**
 * Re-measures the chapter timeline whenever the page layout changes
 * (fonts loading, chapter panels resizing, rotation). Batched to one
 * measurement per animation frame.
 */
export function useTimelineSync(container: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = container.current;
    if (!node) return;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => measureHolds(viewportHeight()));
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [container]);
}
