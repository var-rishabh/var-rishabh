"use client";

import { Environment, Grid, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import CameraRig from "@/components/canvas/CameraRig";
import Core from "@/components/canvas/machine/Core";
import DataConduits from "@/components/canvas/machine/DataConduits";
import Gantries from "@/components/canvas/machine/Gantries";
import OutputGate from "@/components/canvas/machine/OutputGate";
import ServerRacks, { RACK_LAYOUT } from "@/components/canvas/machine/ServerRacks";
import { PALETTE } from "@/components/canvas/machine/palette";

interface CorridorLight {
  z: number;
  y: number;
  color: string;
  intensity: number;
}

const CORRIDOR_LIGHTS: CorridorLight[] = [
  { z: -10, y: 2.6, color: PALETTE.blue, intensity: 18 },
  { z: -17, y: -0.9, color: PALETTE.amber, intensity: 11 },
  { z: -24, y: 2.6, color: PALETTE.blue, intensity: 18 },
  { z: -31, y: -0.9, color: PALETTE.amber, intensity: 11 },
  { z: -38, y: 2.6, color: PALETTE.blue, intensity: 18 },
];

function MachineLights({ lite }: { lite: boolean }) {
  const corridor = lite ? CORRIDOR_LIGHTS.filter((_, i) => i % 2 === 0) : CORRIDOR_LIGHTS;
  return (
    <>
      <ambientLight intensity={0.04} />
      <directionalLight position={[-6, 10, 8]} intensity={0.3} color={PALETTE.blueSoft} />
      <pointLight position={[0, 0, 0]} color={PALETTE.amber} intensity={30} distance={11} decay={2} />
      <pointLight position={[0, 4.2, 4]} color={PALETTE.blue} intensity={16} distance={12} decay={2} />
      {corridor.map((light) => (
        <pointLight
          key={light.z}
          position={[0, light.y, light.z]}
          color={light.color}
          intensity={light.intensity}
          distance={10}
          decay={2}
        />
      ))}
    </>
  );
}

/**
 * Metal only reads as metal when it has something to reflect. Instead of
 * an HDRI file, the environment map is rendered once from a few emissive
 * Lightformer strips — ceiling bar, titanium-blue and amber side strips.
 */
function MachineEnvironment({ lite }: { lite: boolean }) {
  return (
    <Environment resolution={lite ? 64 : 256} frames={1} environmentIntensity={0.55}>
      <Lightformer form="rect" intensity={1.3} color="#c9d2dc" position={[0, 9, -18]} rotation-x={Math.PI / 2} scale={[8, 60, 1]} />
      <Lightformer form="rect" intensity={2.2} color={PALETTE.blue} position={[-12, 1, -14]} rotation-y={Math.PI / 2} scale={[60, 1.2, 1]} />
      <Lightformer form="rect" intensity={1.6} color={PALETTE.amber} position={[12, -1, -10]} rotation-y={-Math.PI / 2} scale={[60, 0.8, 1]} />
      <Lightformer form="ring" intensity={1} color="#ffffff" position={[0, 2, 16]} scale={6} />
    </Environment>
  );
}

/**
 * THE MACHINE ROOM — fully procedural, no model or texture files.
 *
 *   z ≈ 0          Core (AI/ML module) in its mount
 *   z -6 … -46     Data-channel corridor: racks, fibre lanes, gantries
 *   z ≈ -49.5      Output gate
 *
 * CameraRig flies through it along the scroll timeline; every part reads
 * the shared scroll signal to rotate / slide / pulse on its own.
 */
export default function Scene({ lite }: { lite: boolean }) {
  return (
    <>
      <color attach="background" args={[PALETTE.void]} />
      <fog attach="fog" args={[PALETTE.void, 9, 44]} />

      <CameraRig />
      <MachineLights lite={lite} />
      <MachineEnvironment lite={lite} />

      <Core />
      <Gantries />
      <ServerRacks />
      <DataConduits />
      <OutputGate />

      <Grid
        position={[0, RACK_LAYOUT.floorY + 0.004, -28]}
        args={[10.5, 50]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#16181c"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#2a3038"
        fadeDistance={34}
        fadeStrength={1.4}
      />

      {!lite && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.85} luminanceSmoothing={0.2} radius={0.72} />
          <Vignette offset={0.28} darkness={0.7} />
          <ToneMapping />
        </EffectComposer>
      )}
    </>
  );
}
