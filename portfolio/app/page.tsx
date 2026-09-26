"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useScroll } from "framer-motion";
import Hud from "@/components/hud/Hud";
import BootCurtain from "@/components/hud/BootCurtain";
import Initialization from "@/components/chapters/Initialization";
import NeuralCore from "@/components/chapters/NeuralCore";
import DataChannels from "@/components/chapters/DataChannels";
import SystemOutput from "@/components/chapters/SystemOutput";

// three.js never runs on the server: the canvas is client-only.
const SceneCanvas = dynamic(() => import("@/components/canvas/SceneCanvas"), { ssr: false });

/** Upper bound on the boot curtain, e.g. when WebGL is unavailable. */
const BOOT_TIMEOUT_MS = 2800;

/**
 * THE MACHINE ROOM. One root `scrollYProgress` (0..1 over the whole page)
 * drives everything: the fixed WebGL camera flight, the HUD telemetry and
 * — via each chapter's own sub-range — the overlay cross-fades. The page
 * height is simply the stack of chapter sections (2 × 100vh each).
 */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const timeout = setTimeout(markReady, BOOT_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [markReady]);

  return (
    <>
      <div className="canvas-layer" aria-hidden>
        <SceneCanvas scrollProgress={scrollYProgress} onReady={markReady} />
      </div>
      <div className="screen-vignette" aria-hidden />

      <Hud scrollProgress={scrollYProgress} />

      <main className="relative z-10">
        <Initialization ready={ready} />
        <NeuralCore />
        <DataChannels />
        <SystemOutput />
      </main>

      <div className="film-grain" aria-hidden />
      <BootCurtain ready={ready} />
    </>
  );
}
