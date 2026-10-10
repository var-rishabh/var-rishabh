"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Color, Matrix4, TubeGeometry, Vector3, type InstancedMesh } from "three";
import { METAL, PALETTE } from "./palette";
import { useMachineSignal, useToneMapped } from "./signal";
import { useStaticInstances } from "./instancing";
import { RACK_LAYOUT } from "./ServerRacks";
import { seededRandom } from "@/lib/utils";

const LANE_START_Z = -9.2;
const LANE_END_Z = -47.5;
const LANE_LENGTH = LANE_START_Z - LANE_END_Z;
const PACKETS_PER_LANE = 14;

const OVERHEAD_Y = RACK_LAYOUT.floorY + RACK_LAYOUT.height + 0.4;
const FLOOR_Y = RACK_LAYOUT.floorY + 0.05;

interface Lane {
  x: number;
  y: number;
  color: string;
}

/** Fibre lanes: two in the floor channel (blue), two riding the cable trays (amber). */
const LANES: Lane[] = [
  { x: 1.32, y: FLOOR_Y, color: PALETTE.blue },
  { x: -1.32, y: FLOOR_Y, color: PALETTE.blue },
  { x: 3.55, y: OVERHEAD_Y, color: PALETTE.amber },
  { x: -3.55, y: OVERHEAD_Y, color: PALETTE.amber },
];

/** Dark sheathed cables running alongside each lane. */
const SHEATH_OFFSETS = [-0.2, 0.2];
const SHEATHS = LANES.length * SHEATH_OFFSETS.length;
const PACKETS = LANES.length * PACKETS_PER_LANE;

/**
 * Data pipelines: the core's spine splits into four trunk cables that
 * become straight fibre lanes down the corridor to the output gate.
 * Packets (instanced, emissive) stream along each lane; their speed is
 * integrated per-frame so scroll-velocity boosts never make them jump.
 */
export default function DataConduits() {
  const signal = useMachineSignal();
  const toneMapped = useToneMapped();
  const sheathsRef = useRef<InstancedMesh>(null);
  const fibresRef = useRef<InstancedMesh>(null);
  const packetsRef = useRef<InstancedMesh>(null);
  const travel = useRef(0);

  const trunks = useMemo(
    () =>
      LANES.map((lane) => {
        const sx = Math.sign(lane.x);
        const sy = Math.sign(lane.y);
        const curve = new CatmullRomCurve3([
          new Vector3(sx * 0.18, sy * 0.18, -6.1),
          new Vector3(sx * 0.7, sy * 0.55, -6.9),
          new Vector3(lane.x * 0.85, lane.y * 0.92, -8.2),
          new Vector3(lane.x, lane.y, LANE_START_Z),
        ]);
        const sheathCurve = new CatmullRomCurve3(curve.points.map((p) => p.clone().add(new Vector3(0, 0.1, 0))));
        return {
          glow: new Color(lane.color).multiplyScalar(2.2),
          fibre: new TubeGeometry(curve, 48, 0.018, 6, false),
          sheath: new TubeGeometry(sheathCurve, 48, 0.06, 8, false),
        };
      }),
    [],
  );

  const packetPhase = useMemo(() => {
    const random = seededRandom(7);
    return Float32Array.from({ length: PACKETS }, () => random());
  }, []);

  useStaticInstances(sheathsRef, SHEATHS, (i, dummy) => {
    const lane = LANES[Math.floor(i / SHEATH_OFFSETS.length)];
    const offset = SHEATH_OFFSETS[i % SHEATH_OFFSETS.length];
    dummy.position.set(lane.x + offset, lane.y + 0.02, LANE_START_Z - LANE_LENGTH / 2);
    dummy.rotation.x = Math.PI / 2;
  });

  useStaticInstances(fibresRef, LANES.length, (i, dummy) => {
    dummy.position.set(LANES[i].x, LANES[i].y, LANE_START_Z - LANE_LENGTH / 2);
    dummy.rotation.x = Math.PI / 2;
  });

  useLayoutEffect(() => {
    const fibres = fibresRef.current;
    const packets = packetsRef.current;
    if (!fibres || !packets) return;
    const color = new Color();
    LANES.forEach((lane, i) => fibres.setColorAt(i, color.set(lane.color).multiplyScalar(2.2)));
    for (let p = 0; p < PACKETS; p += 1) {
      const lane = LANES[Math.floor(p / PACKETS_PER_LANE)];
      packets.setColorAt(p, color.set(lane.color).multiplyScalar(p % 3 === 0 ? 7 : 4));
    }
    if (fibres.instanceColor) fibres.instanceColor.needsUpdate = true;
    if (packets.instanceColor) packets.instanceColor.needsUpdate = true;
  }, []);

  const matrix = useMemo(() => new Matrix4(), []);

  useFrame((_, delta) => {
    const packets = packetsRef.current;
    if (!packets) return;
    const { energy, motion } = signal.current;
    travel.current += Math.min(delta, 0.1) * (5 + energy * 16) * motion;

    for (let p = 0; p < PACKETS; p += 1) {
      const lane = LANES[Math.floor(p / PACKETS_PER_LANE)];
      const along = (packetPhase[p] * LANE_LENGTH + travel.current * (0.8 + packetPhase[p] * 0.4)) % LANE_LENGTH;
      packets.setMatrixAt(p, matrix.makeTranslation(lane.x, lane.y + 0.01, LANE_START_Z - along));
    }
    packets.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {trunks.map((trunk) => (
        <group key={trunk.fibre.uuid}>
          <mesh geometry={trunk.sheath}>
            <meshStandardMaterial {...METAL.graphite} />
          </mesh>
          <mesh geometry={trunk.fibre}>
            <meshBasicMaterial color={trunk.glow} toneMapped={toneMapped} />
          </mesh>
        </group>
      ))}

      <instancedMesh ref={sheathsRef} args={[undefined, undefined, SHEATHS]}>
        <cylinderGeometry args={[0.055, 0.055, LANE_LENGTH, 10]} />
        <meshStandardMaterial {...METAL.graphite} />
      </instancedMesh>

      <instancedMesh ref={fibresRef} args={[undefined, undefined, LANES.length]}>
        <cylinderGeometry args={[0.014, 0.014, LANE_LENGTH, 6]} />
        <meshBasicMaterial toneMapped={toneMapped} />
      </instancedMesh>

      <instancedMesh ref={packetsRef} args={[undefined, undefined, PACKETS]} frustumCulled={false}>
        <boxGeometry args={[0.05, 0.05, 0.6]} />
        <meshBasicMaterial toneMapped={toneMapped} />
      </instancedMesh>
    </group>
  );
}
