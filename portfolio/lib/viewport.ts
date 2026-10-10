/**
 * Viewport height that ignores the mobile URL bar showing / hiding.
 *
 * On phones `innerHeight` changes by ~50-100px every time the browser
 * chrome collapses mid-scroll. Recomputing sticky offsets and section
 * heights on each of those changes makes the page jump while the user is
 * swiping, so small height-only changes are ignored; width changes
 * (rotation) and large height changes always update.
 */
let cachedHeight = 0;
let cachedWidth = 0;

const URL_BAR_TOLERANCE_PX = 160;

export function viewportHeight(): number {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (!cachedHeight || width !== cachedWidth || Math.abs(height - cachedHeight) > URL_BAR_TOLERANCE_PX) {
    cachedHeight = height;
    cachedWidth = width;
  }
  return cachedHeight;
}

/** Phones / small tablets: chapters use short spacers instead of a full screen. */
export function isCompactViewport(): boolean {
  return window.matchMedia("(max-width: 768px)").matches;
}
