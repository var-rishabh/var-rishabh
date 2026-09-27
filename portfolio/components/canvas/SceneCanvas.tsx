"use client";

import { Component, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
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

/** Resolution band per profile; PerformanceMonitor moves within it by measured FPS. */
const DPR_BAND = {
  full: { min: 1, max: 1.75, start: 1 },
  lite: { min: 0.7, max: 1.35, start: 0.5 },
} as const;

/**
 * Fixed, full-viewport WebGL layer (the wrapper is pointer-events-none).
 * Renderer settings live here; `Scene` is purely content.
 *
 * Resolution is adaptive: drei's PerformanceMonitor samples the frame rate
 * and scales the device-pixel-ratio down on slow GPUs (and back up when
 * there is headroom), so low-end phones hold a smooth frame rate instead
 * of rendering at full resolution and stuttering.
 */
export default function SceneCanvas({ scrollProgress, onReady }: SceneCanvasProps) {
  const profile = useDeviceProfile();
  const [factor, setFactor] = useState<number | null>(null);
  if (!profile) return null;

  const band = profile.lite ? DPR_BAND.lite : DPR_BAND.full;
  const deviceMax = Math.min(band.max, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
  const t = factor ?? band.start;
  const dpr = Math.max(band.min, Math.round((band.min + (deviceMax - band.min) * t) * 20) / 20);

  return (
    <CanvasBoundary>
      <Canvas
        dpr={dpr}
        gl={{ antialias: !profile.lite, powerPreference: "high-performance", stencil: false }}
        camera={{ position: [8.6, 4.9, 16.5], fov: 42, near: 0.1, far: 140 }}
        onCreated={() => {
          // Give the first frames (shader compilation) a moment before revealing.
          requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
        }}
      >
        <PerformanceMonitor
          factor={band.start}
          flipflops={4}
          onChange={({ factor: next }) => setFactor(next)}
          onFallback={() => setFactor(0)}
        />
        <SignalProvider scrollProgress={scrollProgress} calm={profile.calm} lite={profile.lite}>
          <Scene lite={profile.lite} />
        </SignalProvider>
      </Canvas>
    </CanvasBoundary>
  );
}
