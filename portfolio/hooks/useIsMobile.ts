"use client";

import { useEffect, useState } from "react";

/**
 * Basic viewport-width check for the graceful mobile fallback (lighter
 * scene, reduced particle counts, or a static hero image instead of the
 * full R3F canvas). Swap for a more robust device/GPU-tier check once
 * the real scene's perf budget is known.
 */
export function useIsMobile(breakpointPx = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpointPx]);

  return isMobile;
}
