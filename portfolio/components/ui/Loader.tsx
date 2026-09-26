"use client";

import { Html, useProgress } from "@react-three/drei";

/**
 * Asset-loading indicator, driven by drei's useProgress (tracks R3F's
 * Suspense-based loaders — GLTF/Draco/texture loads). Rendered via <Html/>
 * so it can live inside the <Canvas /> tree while behaving like DOM.
 *
 * Mobile fallback note: once real 3D assets exist, pair this with a
 * `prefers-reduced-motion` / low-end-device check to skip straight to a
 * static/lightweight fallback instead of loading the full scene.
 */
export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="font-mono text-xs text-muted animate-pulse-slow">
        {Math.round(progress)}%
      </div>
    </Html>
  );
}
