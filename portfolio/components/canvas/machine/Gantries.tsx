"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Object3D, type InstancedMesh } from "three";
import { METAL, PALETTE } from "./palette";
import { useMachineSignal, useToneMapped } from "./signal";

const RING_COUNT = 11;
const FIRST_Z = -6.4;
const SPACING = 4;
const INRADIUS = 5.3;
const SIDES = 8;
const CENTER_Y = 0.4;

const SIDE_LENGTH = 2 * INRADIUS * Math.tan(Math.PI / SIDES);
const SEGMENTS = RING_COUNT * SIDES;

/**
 * Structural gantries: octagonal frames spaced down the corridor that
 * counter-rotate as the camera flies through, like the bore of a turbine.
 * Every other ring carries an amber strip light on its inner face.
 */
export default function Gantries() {
  const signal = useMachineSignal();
  const toneMapped = useToneMapped();
  const framesRef = useRef<InstancedMesh>(null);
  const stripsRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const stripGlow = useMemo(() => new Color(PALETTE.amber).multiplyScalar(3), []);

  const lit = useMemo(() => Array.from({ length: RING_COUNT }, (_, r) => r % 2 === 0), []);
  const stripCount = lit.filter(Boolean).length * 2;

  useFrame((state) => {
    const frames = framesRef.current;
    const strips = stripsRef.current;
    if (!frames || !strips) return;
    const { progress, energy, motion } = signal.current;
    const t = state.clock.elapsedTime * motion;

    let strip = 0;
    for (let r = 0; r < RING_COUNT; r += 1) {
      const direction = r % 2 === 0 ? 1 : -1;
      const spin = direction * (progress * Math.PI * 0.9 + t * (0.03 + energy * 0.05)) + r * 0.21;
      const z = FIRST_Z - r * SPACING;

      for (let s = 0; s < SIDES; s += 1) {
        const angle = spin + (s / SIDES) * Math.PI * 2;
        dummy.position.set(Math.cos(angle) * INRADIUS, CENTER_Y + Math.sin(angle) * INRADIUS, z);
        dummy.rotation.set(0, 0, angle + Math.PI / 2);
        dummy.updateMatrix();
        frames.setMatrixAt(r * SIDES + s, dummy.matrix);

        // Strip lights sit on two opposite inner faces of the lit rings.
        if (lit[r] && (s === 1 || s === 5)) {
          const inner = INRADIUS - 0.2;
          dummy.position.set(Math.cos(angle) * inner, CENTER_Y + Math.sin(angle) * inner, z);
          dummy.updateMatrix();
          strips.setMatrixAt(strip, dummy.matrix);
          strip += 1;
        }
      }
    }
    frames.instanceMatrix.needsUpdate = true;
    strips.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={framesRef} args={[undefined, undefined, SEGMENTS]} frustumCulled={false}>
        <boxGeometry args={[SIDE_LENGTH + 0.3, 0.34, 0.5]} />
        <meshStandardMaterial {...METAL.steel} />
      </instancedMesh>
      <instancedMesh ref={stripsRef} args={[undefined, undefined, stripCount]} frustumCulled={false}>
        <boxGeometry args={[SIDE_LENGTH * 0.7, 0.03, 0.06]} />
        <meshBasicMaterial color={stripGlow} toneMapped={toneMapped} />
      </instancedMesh>
    </group>
  );
}
