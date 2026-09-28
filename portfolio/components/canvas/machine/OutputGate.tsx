"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  SRGBColorSpace,
  type Group,
  type InstancedMesh,
  type MeshBasicMaterial,
  type PointLight,
} from "three";
import { getHolds } from "@/lib/timeline";
import { smoothstep } from "@/lib/utils";
import { METAL, PALETTE } from "./palette";
import { useMachineSignal, useToneMapped } from "./signal";
import { useStaticInstances } from "./instancing";

export const GATE_Z = -49.5;
const GATE_Y = 0.4;
const CROWN_BLOCKS = 32;
const CROWN_RADIUS = 3.75;
const BLADES = 6;

/** Procedural radial falloff — the only "texture" in the scene, drawn at runtime. */
function createGlowTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,236,210,1)");
    gradient.addColorStop(0.18, "rgba(255,170,90,0.85)");
    gradient.addColorStop(0.5, "rgba(255,120,40,0.22)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/**
 * The output port at the far end of the machine. An iris of blades opens
 * as the camera arrives in chapter 04, the segmented crown spins up and
 * the light behind the aperture comes to full intensity — "System Ready".
 */
export default function OutputGate() {
  const signal = useMachineSignal();
  const toneMapped = useToneMapped();
  const crown = useRef<Group>(null);
  const blades = useRef<Array<Group | null>>([]);
  const light = useRef<PointLight>(null);
  const glow = useRef<MeshBasicMaterial>(null);
  const crownRef = useRef<InstancedMesh>(null);

  const glowTexture = useMemo(() => createGlowTexture(), []);
  useEffect(() => () => glowTexture.dispose(), [glowTexture]);
  const ringGlow = useMemo(() => new Color(PALETTE.amber).multiplyScalar(4), []);

  useStaticInstances(crownRef, CROWN_BLOCKS, (i, dummy) => {
    const angle = (i / CROWN_BLOCKS) * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * CROWN_RADIUS, Math.sin(angle) * CROWN_RADIUS, 0);
    dummy.rotation.z = angle;
    dummy.scale.set(1, i % 4 === 0 ? 1.5 : 1, 1);
  });

  useFrame((state, delta) => {
    const { progress, energy, motion } = signal.current;
    const t = state.clock.elapsedTime * motion;
    const output = getHolds()[3];
    const ready = smoothstep(output.start - 0.12, output.start + 0.02, progress);

    if (crown.current) {
      crown.current.rotation.z += delta * motion * (0.05 + ready * 0.25 + energy * 0.4);
    }
    blades.current.forEach((blade, i) => {
      if (!blade) return;
      const angle = (i / BLADES) * Math.PI * 2 + t * 0.04;
      const radius = 1.05 + ready * 1.95;
      blade.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -0.12);
      blade.rotation.z = angle + Math.PI / 2 + (1 - ready) * 0.42;
      blade.scale.set(1 - ready * 0.6, 1 - ready * 0.72, 1);
    });
    if (light.current) light.current.intensity = 6 + ready * 34;
    if (glow.current) glow.current.opacity = 0.25 + ready * 0.75 + Math.sin(t * 1.7) * 0.04;
  });

  return (
    <group position={[0, GATE_Y, GATE_Z]}>
      <mesh>
        <torusGeometry args={[3.1, 0.16, 20, 128]} />
        <meshStandardMaterial {...METAL.titanium} />
      </mesh>
      <mesh>
        <torusGeometry args={[2.82, 0.028, 8, 128]} />
        <meshBasicMaterial color={ringGlow} toneMapped={toneMapped} />
      </mesh>

      <group ref={crown}>
        <instancedMesh ref={crownRef} args={[undefined, undefined, CROWN_BLOCKS]}>
          <boxGeometry args={[0.3, 0.46, 0.62]} />
          <meshStandardMaterial {...METAL.steel} />
        </instancedMesh>
      </group>

      {Array.from({ length: BLADES }, (_, i) => (
        <group
          key={i}
          ref={(node) => {
            blades.current[i] = node;
          }}
        >
          <mesh>
            <boxGeometry args={[2.5, 0.95, 0.04]} />
            <meshStandardMaterial {...METAL.graphite} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0, -1.6]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          ref={glow}
          map={glowTexture}
          color={PALETTE.amberHot}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={toneMapped}
          fog={false}
        />
      </mesh>
      <pointLight ref={light} position={[0, 0, 2]} color={PALETTE.amber} intensity={6} distance={16} decay={2} />
    </group>
  );
}
