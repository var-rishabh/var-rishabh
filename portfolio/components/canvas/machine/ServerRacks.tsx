"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Matrix4, type InstancedMesh } from "three";
import { METAL, PALETTE } from "./palette";
import { useMachineSignal } from "./signal";
import { useStaticInstances } from "./instancing";

export const RACK_LAYOUT = {
  perSide: 26,
  pitch: 1.38,
  startZ: -7.2,
  innerX: 3.1,
  floorY: -1.6,
  width: 0.95,
  height: 3.4,
  depth: 1.22,
} as const;

const UNITS_PER_CABINET = 7;
const UNIT_HEIGHT = 0.36;
const UNIT_GAP = 0.05;
const LEDS_PER_UNIT = 2;
const MAX_SLIDE = 0.24;

const CABINETS = RACK_LAYOUT.perSide * 2;
const UNIT_COUNT = CABINETS * UNITS_PER_CABINET;
const LED_COUNT = UNIT_COUNT * LEDS_PER_UNIT;

function cabinetPlacement(index: number) {
  const side = index < RACK_LAYOUT.perSide ? 1 : -1;
  const slot = index % RACK_LAYOUT.perSide;
  return { side, z: RACK_LAYOUT.startZ - slot * RACK_LAYOUT.pitch };
}

/**
 * Backend infrastructure: two facing rows of server cabinets lining the
 * data-channel corridor. Every cabinet holds drawer units that slide out
 * in a travelling wave (faster while scrolling) and status LEDs that
 * blink independently — all as three InstancedMeshes, so the whole
 * corridor is a handful of draw calls.
 */
export default function ServerRacks() {
  const signal = useMachineSignal();
  const cabinetsRef = useRef<InstancedMesh>(null);
  const unitsRef = useRef<InstancedMesh>(null);
  const ledsRef = useRef<InstancedMesh>(null);
  const traysRef = useRef<InstancedMesh>(null);
  const blinkClock = useRef(0);

  const layout = useMemo(() => {
    const unitBase = new Float32Array(UNIT_COUNT * 4); // x(face), y, z, side
    const ledOffset = new Float32Array(LED_COUNT * 2); // dy, dz relative to unit
    const ledBase: Color[] = [];
    const palette = [
      new Color(PALETTE.blue).multiplyScalar(3.2),
      new Color(PALETTE.amber).multiplyScalar(3.4),
      new Color("#2a2f36"),
    ];

    for (let c = 0; c < CABINETS; c += 1) {
      const { side, z } = cabinetPlacement(c);
      for (let u = 0; u < UNITS_PER_CABINET; u += 1) {
        const i = c * UNITS_PER_CABINET + u;
        unitBase[i * 4] = side * (RACK_LAYOUT.innerX - 0.02);
        unitBase[i * 4 + 1] = RACK_LAYOUT.floorY + 0.38 + u * (UNIT_HEIGHT + UNIT_GAP);
        unitBase[i * 4 + 2] = z;
        unitBase[i * 4 + 3] = side;
        for (let l = 0; l < LEDS_PER_UNIT; l += 1) {
          const li = i * LEDS_PER_UNIT + l;
          ledOffset[li * 2] = 0.07;
          ledOffset[li * 2 + 1] = RACK_LAYOUT.depth * (0.36 - l * 0.09) * side;
          const roll = Math.random();
          ledBase.push(palette[roll < 0.5 ? 0 : roll < 0.72 ? 1 : 2]);
        }
      }
    }
    return { unitBase, ledOffset, ledBase, dim: palette[2] };
  }, []);

  useStaticInstances(cabinetsRef, CABINETS, (i, dummy) => {
    const { side, z } = cabinetPlacement(i);
    dummy.position.set(
      side * (RACK_LAYOUT.innerX + RACK_LAYOUT.width / 2),
      RACK_LAYOUT.floorY + RACK_LAYOUT.height / 2,
      z,
    );
  });

  useStaticInstances(traysRef, 2, (i, dummy) => {
    const side = i === 0 ? 1 : -1;
    const length = RACK_LAYOUT.perSide * RACK_LAYOUT.pitch;
    dummy.position.set(
      side * (RACK_LAYOUT.innerX + 0.45),
      RACK_LAYOUT.floorY + RACK_LAYOUT.height + 0.28,
      RACK_LAYOUT.startZ - length / 2 + RACK_LAYOUT.pitch / 2,
    );
    dummy.scale.set(1, 1, length);
  });

  useLayoutEffect(() => {
    const leds = ledsRef.current;
    if (!leds) return;
    layout.ledBase.forEach((color, i) => leds.setColorAt(i, color));
    if (leds.instanceColor) leds.instanceColor.needsUpdate = true;
  }, [layout]);

  const matrix = useMemo(() => new Matrix4(), []);

  useFrame((state, delta) => {
    const units = unitsRef.current;
    const leds = ledsRef.current;
    if (!units || !leds) return;

    const { progress, energy, motion } = signal.current;
    const t = state.clock.elapsedTime * motion;
    const { unitBase, ledOffset } = layout;

    for (let i = 0; i < UNIT_COUNT; i += 1) {
      const x = unitBase[i * 4];
      const y = unitBase[i * 4 + 1];
      const z = unitBase[i * 4 + 2];
      const side = unitBase[i * 4 + 3];
      const phase = z * 0.42 + (i % UNITS_PER_CABINET) * 0.75 + side * 1.3 - t * 1.5 - progress * 30;
      const wave = Math.max(0, Math.sin(phase));
      const slide = Math.pow(wave, 6) * MAX_SLIDE * (0.45 + energy * 0.55);
      const faceX = x - side * slide;

      units.setMatrixAt(i, matrix.makeTranslation(faceX, y, z));
      for (let l = 0; l < LEDS_PER_UNIT; l += 1) {
        const li = i * LEDS_PER_UNIT + l;
        leds.setMatrixAt(
          li,
          matrix.makeTranslation(faceX - side * 0.085, y + ledOffset[li * 2], z + ledOffset[li * 2 + 1]),
        );
      }
    }
    units.instanceMatrix.needsUpdate = true;
    leds.instanceMatrix.needsUpdate = true;

    // Blink a random handful of LEDs ~12 times a second.
    blinkClock.current += delta;
    if (blinkClock.current > 0.08 && leds.instanceColor) {
      blinkClock.current = 0;
      const flips = Math.floor(LED_COUNT * (0.03 + energy * 0.06));
      for (let f = 0; f < flips; f += 1) {
        const li = Math.floor(Math.random() * LED_COUNT);
        leds.setColorAt(li, Math.random() < 0.5 ? layout.dim : layout.ledBase[li]);
      }
      leds.instanceColor.needsUpdate = true;
    }
  });

  const corridorLength = RACK_LAYOUT.perSide * RACK_LAYOUT.pitch;

  return (
    <group>
      <instancedMesh ref={cabinetsRef} args={[undefined, undefined, CABINETS]}>
        <boxGeometry args={[RACK_LAYOUT.width, RACK_LAYOUT.height, RACK_LAYOUT.depth]} />
        <meshStandardMaterial {...METAL.graphite} />
      </instancedMesh>

      <instancedMesh ref={unitsRef} args={[undefined, undefined, UNIT_COUNT]} frustumCulled={false}>
        <boxGeometry args={[0.16, UNIT_HEIGHT * 0.86, RACK_LAYOUT.depth * 0.9]} />
        <meshStandardMaterial {...METAL.brushed} />
      </instancedMesh>

      <instancedMesh ref={ledsRef} args={[undefined, undefined, LED_COUNT]} frustumCulled={false}>
        <boxGeometry args={[0.02, 0.035, 0.08]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <instancedMesh ref={traysRef} args={[undefined, undefined, 2]}>
        <boxGeometry args={[0.72, 0.06, 1]} />
        <meshStandardMaterial {...METAL.steel} />
      </instancedMesh>

      {/* Floor plate under the corridor — catches the channel light */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, RACK_LAYOUT.floorY - 0.002, RACK_LAYOUT.startZ - corridorLength / 2 - 3]}
      >
        <planeGeometry args={[11, corridorLength + 14]} />
        <meshStandardMaterial color="#0a0b0d" metalness={0.8} roughness={0.5} />
      </mesh>
    </group>
  );
}
