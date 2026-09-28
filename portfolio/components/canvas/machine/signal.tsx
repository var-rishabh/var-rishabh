"use client";

import { createContext, useContext, useRef, type MutableRefObject, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { MotionValue } from "framer-motion";
import { clamp } from "@/lib/utils";

/**
 * Per-frame scroll signal shared by every machine part. Read inside
 * `useFrame` via the ref (never as React state) so the scene never
 * re-renders while scrolling.
 *
 * - progress: damped whole-page scroll (0..1) — gives the camera inertia
 * - energy:   0..1, rises with scroll velocity; spins/pulses the machine
 * - motion:   time-based animation multiplier (reduced for prefers-reduced-motion)
 * - lite:     low-end / small-screen profile — parts skip non-essential per-frame work
 */
export interface MachineSignal {
  progress: number;
  energy: number;
  motion: number;
  lite: boolean;
}

const SignalContext = createContext<MutableRefObject<MachineSignal> | null>(null);
const LiteContext = createContext(false);

interface SignalProviderProps {
  scrollProgress: MotionValue<number>;
  calm: boolean;
  lite: boolean;
  children: ReactNode;
}

export function SignalProvider({ scrollProgress, calm, lite, children }: SignalProviderProps) {
  const signal = useRef<MachineSignal>({
    progress: clamp(scrollProgress.get(), 0, 1),
    energy: 0,
    motion: calm ? 0.2 : 1,
    lite,
  });

  // Negative priority: runs before every other useFrame subscriber, so all
  // parts read the same values within a frame.
  useFrame((_, delta) => {
    const s = signal.current;
    const dt = Math.min(delta, 0.1);
    // Touch scrolling already carries momentum, so the camera tracks it more tightly there.
    s.progress = MathUtils.damp(s.progress, clamp(scrollProgress.get(), 0, 1), lite ? 5 : 3.4, dt);
    const velocity = Math.min(Math.abs(scrollProgress.getVelocity()) * 5, 1);
    s.energy = MathUtils.damp(s.energy, velocity, velocity > s.energy ? 6 : 1.6, dt);
    s.motion = calm ? 0.2 : 1;
    s.lite = lite;
  }, -1);

  return (
    <SignalContext.Provider value={signal}>
      <LiteContext.Provider value={lite}>{children}</LiteContext.Provider>
    </SignalContext.Provider>
  );
}

export function useMachineSignal(): MutableRefObject<MachineSignal> {
  const signal = useContext(SignalContext);
  if (!signal) throw new Error("useMachineSignal must be used inside <SignalProvider>");
  return signal;
}

/**
 * Whether glow materials should go through tone mapping. The desktop path
 * renders HDR glow colours (> 1) into the post-processing composer, which
 * tone-maps once at the end, so those materials opt out (`false`). The lite
 * path has no composer — the renderer tone-maps instead — so they must opt
 * in (`true`) or the over-bright colours clip to flat yellow/white.
 */
export function useToneMapped(): boolean {
  return useContext(LiteContext);
}
