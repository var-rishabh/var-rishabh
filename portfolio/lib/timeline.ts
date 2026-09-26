import { CHAPTERS } from "@/data/chapters";

export interface HoldRange {
  start: number;
  end: number;
}

/**
 * Converts chapter lengths (in screens) into the slice of whole-page
 * `scrollYProgress` during which each chapter's panel is pinned. The page
 * is exactly sum(screens) viewports tall, so the scrollable distance is
 * that minus one viewport; chapter `i` is pinned from its own top until
 * its bottom reaches the bottom of the viewport.
 */
export function computeHoldRanges(screens: number[]): HoldRange[] {
  const scrollable = screens.reduce((sum, s) => sum + s, 0) - 1;
  let offset = 0;

  return screens.map((length) => {
    const range = { start: offset / scrollable, end: (offset + length - 1) / scrollable };
    offset += length;
    return range;
  });
}

export const HOLDS = computeHoldRanges(CHAPTERS.map((chapter) => chapter.screens));

/** Index of the chapter that owns `progress`, split halfway between holds. */
export function chapterIndexAt(progress: number): number {
  for (let i = HOLDS.length - 1; i > 0; i -= 1) {
    const boundary = (HOLDS[i - 1].end + HOLDS[i].start) / 2;
    if (progress >= boundary) return i;
  }
  return 0;
}
