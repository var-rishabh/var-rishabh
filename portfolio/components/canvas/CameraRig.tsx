"use client";

import { ReactNode } from "react";

/**
 * Wraps scene content and will own camera behavior — scroll-driven
 * dolly/orbit, section-based camera waypoints, or drei's <OrbitControls />
 * with damping/limits for a guided (not free-roam) feel.
 *
 * Left as a pass-through for now; see components/canvas/Scene.tsx TODOs.
 */
export default function CameraRig({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
