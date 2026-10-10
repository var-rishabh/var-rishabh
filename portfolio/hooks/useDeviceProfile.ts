"use client";

import { useEffect, useState } from "react";

export interface DeviceProfile {
  /**
   * Small / touch-first screens or low-end hardware (≤4 cores or ≤4GB RAM):
   * adaptive lower DPR, no post-processing, fewer lights, static rack units.
   */
  lite: boolean;
  /** prefers-reduced-motion: idle machine animation is slowed right down. */
  calm: boolean;
}

/**
 * Resolves once on the client (null during SSR / first paint) so the WebGL
 * renderer is created with the right settings instead of being rebuilt.
 */
export function useDeviceProfile(): DeviceProfile | null {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);

  useEffect(() => {
    const liteQuery = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const calmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowEnd = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    const update = () => setProfile({ lite: liteQuery.matches || lowEnd, calm: calmQuery.matches });

    update();
    liteQuery.addEventListener("change", update);
    calmQuery.addEventListener("change", update);
    return () => {
      liteQuery.removeEventListener("change", update);
      calmQuery.removeEventListener("change", update);
    };
  }, []);

  return profile;
}
