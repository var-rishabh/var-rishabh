import { CHAPTERS } from "@/data/chapters";

export interface HoldRange {
  start: number;
  end: number;
}

/**
 * Converts chapter lengths (in screens) into the slice of whole-page
 * `scrollYProgress` during which each chapter's panel is pinned, assuming
 * every section is exactly `screens` viewports tall. Used as the SSR /
 * first-paint default until the real layout has been measured.
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

export const DEFAULT_HOLDS = computeHoldRanges(CHAPTERS.map((chapter) => chapter.screens));

/*
 * Live timeline. Section heights differ per device (short spacers on
 * phones, content-sized panels), so the real hold ranges are measured from
 * the DOM and published here. The 3D scene reads `getHolds()` every frame;
 * React UI subscribes through `useHolds()`.
 */
let holds: HoldRange[] = DEFAULT_HOLDS;
const listeners = new Set<() => void>();

export function getHolds(): HoldRange[] {
  return holds;
}

export function subscribeHolds(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function sameHolds(a: HoldRange[], b: HoldRange[]): boolean {
  return a.length === b.length && a.every((h, i) => Math.abs(h.start - b[i].start) < 1e-4 && Math.abs(h.end - b[i].end) < 1e-4);
}

/** Measures every chapter section and republishes the hold ranges. */
export function measureHolds(viewportHeight: number) {
  const scrollable = document.documentElement.scrollHeight - viewportHeight;
  if (scrollable <= 0) return;

  const next = CHAPTERS.map((chapter) => {
    const section = document.getElementById(chapter.id);
    if (!section) return { start: 0, end: 0 };
    const top = section.getBoundingClientRect().top + window.scrollY;
    const start = Math.min(Math.max(top / scrollable, 0), 1);
    const end = Math.min(Math.max((top + section.offsetHeight - viewportHeight) / scrollable, start), 1);
    return { start, end };
  });

  if (sameHolds(holds, next)) return;
  holds = next;
  listeners.forEach((listener) => listener());
}

/** Index of the chapter that owns `progress`, split halfway between holds. */
export function chapterIndexAt(progress: number, ranges: HoldRange[] = holds): number {
  for (let i = ranges.length - 1; i > 0; i -= 1) {
    const boundary = (ranges[i - 1].end + ranges[i].start) / 2;
    if (progress >= boundary) return i;
  }
  return 0;
}
