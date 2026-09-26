"use client";

import { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import Scene from "@/components/canvas/Scene";
import { SignalProvider } from "@/components/canvas/machine/signal";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";

/** No WebGL (or a lost context on init) degrades to the CSS backdrop. */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface SceneCanvasProps {
  scrollProgress: MotionValue<number>;
  onReady?: () => void;
}

/**
 * Fixed, full-viewport WebGL layer (the wrapper is pointer-events-none).
 * Renderer settings live here; `Scene` is purely content.
 */
export default function SceneCanvas({ scrollProgress, onReady }: SceneCanvasProps) {
  const profile = useDeviceProfile();
  if (!profile) return null;

  return (
    <CanvasBoundary>
      <Canvas
        dpr={profile.lite ? [1, 1.3] : [1, 1.75]}
        gl={{ antialias: profile.lite, powerPreference: "high-performance", stencil: false }}
        camera={{ position: [8.6, 4.9, 16.5], fov: 42, near: 0.1, far: 140 }}
        onCreated={() => {
          // Give the first frames (shader compilation) a moment before revealing.
          requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
        }}
      >
        <SignalProvider scrollProgress={scrollProgress} calm={profile.calm}>
          <Scene lite={profile.lite} />
        </SignalProvider>
      </Canvas>
    </CanvasBoundary>
  );
}
