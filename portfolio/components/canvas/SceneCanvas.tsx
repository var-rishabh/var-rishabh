"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CameraRig from "@/components/canvas/CameraRig";
import Scene from "@/components/canvas/Scene";

/**
 * Top-level R3F canvas mount. Keeps renderer/DPR/perf concerns here so
 * `Scene` can stay purely about content (geometry, lights, shaders).
 *
 * TODO(3d-theme): finalize dpr cap + frameloop strategy once scene
 * complexity (draw calls, shader cost) is known. Currently capped
 * conservatively for mobile fallback.
 */
export default function SceneCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <Suspense fallback={null}>
        <CameraRig>
          <Scene />
        </CameraRig>
      </Suspense>
    </Canvas>
  );
}
