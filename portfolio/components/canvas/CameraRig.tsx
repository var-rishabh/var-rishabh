"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from "three";
import { HOLDS } from "@/lib/timeline";
import { clamp, smoothstep } from "@/lib/utils";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useMachineSignal } from "@/components/canvas/machine/signal";
import { GATE_Z } from "@/components/canvas/machine/OutputGate";

type Vec3 = [number, number, number];

interface Shot {
  at: number;
  position: Vec3;
  target: Vec3;
  /** Transition shots ease in/out; hold shots drift linearly. */
  ease?: boolean;
}

/**
 * Camera flight plan. Each chapter owns two shots (start/end of its pinned
 * hold) so the camera keeps drifting while the copy is on screen; the
 * shots in between are the "dives" — over the core and down into the
 * corridor, never through solid geometry. Target x-offsets push the
 * subject to the side opposite the chapter copy.
 */
function buildShots(): Shot[] {
  const [init, core, channels, output] = HOLDS;
  const between = (a: number, b: number) => (a + b) / 2;

  return [
    { at: init.start, position: [8.6, 4.9, 16.5], target: [-4.6, -0.6, -3] },
    { at: init.end, position: [7.3, 4.1, 14], target: [-4.1, -0.5, -3] },
    { at: between(init.end, core.start), position: [4.8, 1.9, 9.4], target: [-0.8, 0, -2], ease: true },
    { at: core.start, position: [3.1, 0.75, 6.3], target: [-1.7, 0, 0], ease: true },
    { at: core.end, position: [2.3, 0.5, 5], target: [-1.5, 0, 0] },
    { at: between(core.end, channels.start), position: [0.4, 7.2, -1.6], target: [0, 0.6, -16], ease: true },
    { at: channels.start, position: [-1.1, 1.15, -9.8], target: [1.6, 0.3, -32], ease: true },
    { at: channels.end, position: [-0.7, 0.95, -19.8], target: [1.8, 0.2, -42] },
    { at: between(channels.end, output.start), position: [0.2, 0.6, -28.5], target: [0, 0.4, -52], ease: true },
    { at: output.start, position: [1.4, 0.85, -35.2], target: [-1.9, 0.4, GATE_Z], ease: true },
    { at: output.end, position: [0.9, 0.65, -38.4], target: [-1.6, 0.4, GATE_Z] },
  ];
}

function curveParameter(shots: Shot[], progress: number): number {
  const last = shots.length - 1;
  for (let k = 0; k < last; k += 1) {
    const from = shots[k];
    const to = shots[k + 1];
    if (progress <= to.at || k === last - 1) {
      const local = clamp((progress - from.at) / Math.max(to.at - from.at, 1e-6), 0, 1);
      const eased = to.ease ? smoothstep(0, 1, local) : local;
      return (k + eased) / last;
    }
  }
  return 1;
}

function fovForAspect(aspect: number): number {
  if (aspect < 0.8) return 64;
  if (aspect < 1.25) return 52;
  return 42;
}

/**
 * Drives the camera along the flight plan from the damped scroll signal,
 * with a small pointer-parallax sway layered on top. Framing offsets
 * collapse towards centre on portrait screens where copy is full-width.
 */
export default function CameraRig() {
  const signal = useMachineSignal();
  const pointer = usePointerParallax();

  const { shots, positions, targets } = useMemo(() => {
    const plan = buildShots();
    return {
      shots: plan,
      positions: new CatmullRomCurve3(plan.map((s) => new Vector3(...s.position)), false, "centripetal"),
      targets: new CatmullRomCurve3(plan.map((s) => new Vector3(...s.target)), false, "centripetal"),
    };
  }, []);

  const sway = useRef(new Vector3());
  const position = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const camera = state.camera;
    const aspect = state.size.width / Math.max(state.size.height, 1);

    if (camera instanceof PerspectiveCamera) {
      const fov = fovForAspect(aspect);
      if (camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }

    const u = curveParameter(shots, signal.current.progress);
    positions.getPoint(u, position);
    targets.getPoint(u, target);

    const framing = smoothstep(0.8, 1.4, aspect);
    target.x *= 0.35 + framing * 0.65;

    const dt = Math.min(delta, 0.1);
    sway.current.x = MathUtils.damp(sway.current.x, pointer.current.x * 0.4, 2.5, dt);
    sway.current.y = MathUtils.damp(sway.current.y, -pointer.current.y * 0.25, 2.5, dt);

    camera.position.set(position.x + sway.current.x, position.y + sway.current.y, position.z);
    camera.lookAt(target);
  });

  return null;
}
