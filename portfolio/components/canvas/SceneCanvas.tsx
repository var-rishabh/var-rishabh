"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { MotionValue } from "framer-motion";
import CameraRig from "@/components/canvas/CameraRig";
import Scene from "@/components/canvas/Scene";
import Loader from "@/components/ui/Loader";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SceneCanvasProps {
  scrollProgress: MotionValue<number>;
}

/**
 * Top-level R3F canvas mount. Keeps renderer/DPR/perf concerns here so
 * `Scene` can stay purely about content (geometry, lights, shaders).
 * Skips the full WebGL scene on narrow viewports in favor of the static
 * gradient background already painted by globals.css, since a full
 * particle + bloom scene isn't worth the battery/perf cost on mobile.
 */
export default function SceneCanvas({ scrollProgress }: SceneCanvasProps) {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 6.4], fov: 45 }}
    >
      <Suspense fallback={<Loader />}>
        <CameraRig scrollProgress={scrollProgress}>
          <Scene />
        </CameraRig>
      </Suspense>
    </Canvas>
  );
}
