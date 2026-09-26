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
 */
export interface MachineSignal {
  progress: number;
  energy: number;
  motion: number;
}

const SignalContext = createContext<MutableRefObject<MachineSignal> | null>(null);

interface SignalProviderProps {
  scrollProgress: MotionValue<number>;
  calm: boolean;
  children: ReactNode;
}

export function SignalProvider({ scrollProgress, calm, children }: SignalProviderProps) {
  const signal = useRef<MachineSignal>({
    progress: clamp(scrollProgress.get(), 0, 1),
    energy: 0,
    motion: calm ? 0.2 : 1,
  });

  // Negative priority: runs before every other useFrame subscriber, so all
  // parts read the same values within a frame.
  useFrame((_, delta) => {
    const s = signal.current;
    const dt = Math.min(delta, 0.1);
    s.progress = MathUtils.damp(s.progress, clamp(scrollProgress.get(), 0, 1), 3.4, dt);
    const velocity = Math.min(Math.abs(scrollProgress.getVelocity()) * 5, 1);
    s.energy = MathUtils.damp(s.energy, velocity, velocity > s.energy ? 6 : 1.6, dt);
    s.motion = calm ? 0.2 : 1;
  }, -1);

  return <SignalContext.Provider value={signal}>{children}</SignalContext.Provider>;
}

export function useMachineSignal(): MutableRefObject<MachineSignal> {
  const signal = useContext(SignalContext);
  if (!signal) throw new Error("useMachineSignal must be used inside <SignalProvider>");
  return signal;
}
