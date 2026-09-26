"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Octahedron, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type * as THREE from "three";

const PARTICLE_COUNT = 700;

function ParticleField() {
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.018;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#5eead4"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

function Core() {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.16;
    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.09;
      shellRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group>
      <Icosahedron ref={coreRef} args={[0.9, 1]}>
        <meshStandardMaterial
          color="#5eead4"
          emissive="#5eead4"
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.65}
        />
      </Icosahedron>
      <Icosahedron ref={shellRef} args={[1.55, 0]}>
        <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.35} />
      </Icosahedron>
    </group>
  );
}

function Satellites() {
  return (
    <>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <Octahedron args={[0.22, 0]} position={[2.6, 1.1, -1]}>
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} />
        </Octahedron>
      </Float>
      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.6}>
        <Octahedron args={[0.14, 0]} position={[-2.2, -0.8, 0.6]}>
          <meshStandardMaterial color="#5eead4" emissive="#5eead4" emissiveIntensity={0.5} />
        </Octahedron>
      </Float>
      <Float speed={0.9} rotationIntensity={0.5} floatIntensity={1}>
        <Octahedron args={[0.1, 0]} position={[1.4, -1.6, 1.2]}>
          <meshStandardMaterial color="#e9ecf3" emissive="#e9ecf3" emissiveIntensity={0.3} />
        </Octahedron>
      </Float>
    </>
  );
}

/**
 * Floating 3D core: an emissive icosahedron wrapped in a wireframe shell,
 * a handful of drifting satellite nodes, and a soft particle field —
 * bloomed for the "cinematic" glow. Rotation here is autonomous (clock
 * driven); scroll/pointer-linked motion lives in CameraRig.
 */
export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={22} color="#5eead4" />
      <pointLight position={[-4, -3, -2]} intensity={14} color="#a78bfa" />
      <Core />
      <Satellites />
      <ParticleField />
      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </>
  );
}
