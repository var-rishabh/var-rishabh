"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Group, type InstancedMesh, type Mesh, type MeshStandardMaterial } from "three";
import { getHolds } from "@/lib/timeline";
import { windowed } from "@/lib/utils";
import { METAL, PALETTE } from "./palette";
import { useMachineSignal } from "./signal";
import { useStaticInstances } from "./instancing";

const LATTICE_NODES = 46;
const LATTICE_RADIUS = 1.42;
const LINK_DISTANCE = 0.72;

const FRAME_RADIUS = 4.4;
const STRUTS = 8;

interface RingSpec {
  radius: number;
  tube: number;
  ticks: number;
  tilt: [number, number, number];
  speed: [number, number];
}

const RINGS: RingSpec[] = [
  { radius: 1.82, tube: 0.034, ticks: 0, tilt: [0.4, 0, 0], speed: [0.34, 0.12] },
  { radius: 2.16, tube: 0.05, ticks: 40, tilt: [Math.PI / 2, 0.3, 0], speed: [-0.16, 0.26] },
  { radius: 2.52, tube: 0.026, ticks: 0, tilt: [0.9, 0.5, 0.2], speed: [0.12, -0.2] },
];

function fibonacciSphere(count: number, radius: number): Vector3[] {
  const points: Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(new Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return points;
}

/**
 * The runtime core: a glowing heart wrapped in torus-knot signal paths,
 * a synapse lattice, three gimbal rings, a wireframe containment shell and
 * the circular mount that bolts it into the machine. As the camera dives
 * in (chapter 02) the rings unfold outward and the heart runs hotter.
 */
export default function Core() {
  const signal = useMachineSignal();

  const heartMaterial = useRef<MeshStandardMaterial>(null);
  const knotA = useRef<Mesh>(null);
  const knotB = useRef<Mesh>(null);
  const lattice = useRef<Group>(null);
  const shell = useRef<Mesh>(null);
  const mount = useRef<Group>(null);
  const rings = useRef<Array<Group | null>>([]);

  const nodesRef = useRef<InstancedMesh>(null);
  const ticksRef = useRef<InstancedMesh>(null);
  const strutsRef = useRef<InstancedMesh>(null);
  const clampsRef = useRef<InstancedMesh>(null);

  const { nodes, links } = useMemo(() => {
    const points = fibonacciSphere(LATTICE_NODES, LATTICE_RADIUS);
    const segments: number[] = [];
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        if (points[i].distanceTo(points[j]) < LINK_DISTANCE) {
          segments.push(...points[i].toArray(), ...points[j].toArray());
        }
      }
    }
    return { nodes: points, links: new Float32Array(segments) };
  }, []);

  useStaticInstances(nodesRef, LATTICE_NODES, (i, dummy) => {
    dummy.position.copy(nodes[i]);
    dummy.scale.setScalar(i % 5 === 0 ? 1.6 : 1);
  });

  const tickCount = RINGS[1].ticks;
  useStaticInstances(ticksRef, tickCount, (i, dummy) => {
    const angle = (i / tickCount) * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * RINGS[1].radius, Math.sin(angle) * RINGS[1].radius, 0);
    dummy.rotation.z = angle;
    dummy.scale.set(i % 4 === 0 ? 2.2 : 1, 1, 1);
  });

  useStaticInstances(strutsRef, STRUTS, (i, dummy) => {
    const angle = (i / STRUTS) * Math.PI * 2 + Math.PI / STRUTS;
    const mid = (3.15 + FRAME_RADIUS) / 2;
    dummy.position.set(Math.cos(angle) * mid, Math.sin(angle) * mid, 0);
    dummy.rotation.z = angle - Math.PI / 2;
  });

  useStaticInstances(clampsRef, 4, (i, dummy) => {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    dummy.position.set(Math.cos(angle) * FRAME_RADIUS, Math.sin(angle) * FRAME_RADIUS, 0);
    dummy.rotation.z = angle;
  });

  useFrame((state, delta) => {
    const { progress, energy, motion } = signal.current;
    const t = state.clock.elapsedTime * motion;
    const spin = delta * motion * (0.22 + energy * 1.8);
    const core = getHolds()[1];
    const focus = windowed(progress, core.start, core.end, 0.12);

    if (heartMaterial.current) {
      heartMaterial.current.emissiveIntensity = 1.5 + Math.sin(t * 2.1) * 0.35 + focus * 0.7 + energy * 1.2;
    }
    if (knotA.current) {
      knotA.current.rotation.x += spin * 0.55;
      knotA.current.rotation.y += spin;
    }
    if (knotB.current) {
      knotB.current.rotation.y -= spin * 0.7;
      knotB.current.rotation.z += spin * 0.35;
      knotB.current.scale.setScalar(1 + focus * 0.12);
    }
    if (lattice.current) {
      lattice.current.rotation.y -= spin * 0.3;
      lattice.current.rotation.x = Math.sin(t * 0.2) * 0.25;
      lattice.current.scale.setScalar(1 + focus * 0.1 + Math.sin(t * 1.4) * 0.015);
    }
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const spec = RINGS[i];
      const scrollTurn = progress * Math.PI * (2 + i);
      ring.rotation.x = spec.tilt[0] + t * spec.speed[0] + scrollTurn * 0.5;
      ring.rotation.y = spec.tilt[1] + t * spec.speed[1] + scrollTurn * 0.3;
      ring.rotation.z = spec.tilt[2];
      ring.scale.setScalar(1 + focus * 0.16 * (i + 1));
    });
    if (shell.current) {
      shell.current.rotation.y += spin * 0.12;
      shell.current.rotation.x += spin * 0.05;
      shell.current.scale.setScalar(1 + focus * 0.14);
    }
    if (mount.current) {
      mount.current.rotation.z = progress * Math.PI * 0.5 + t * 0.02;
    }
  });

  return (
    <group>
      {/* Heart */}
      <mesh>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          ref={heartMaterial}
          color="#1a0d03"
          emissive={PALETTE.amber}
          emissiveIntensity={1.5}
          flatShading
          toneMapped={false}
        />
      </mesh>
      <mesh scale={0.3}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={PALETTE.amberHot} toneMapped={false} />
      </mesh>

      {/* Neural paths */}
      <mesh ref={knotA}>
        <torusKnotGeometry args={[0.9, 0.07, 256, 20, 2, 3]} />
        <meshStandardMaterial {...METAL.titanium} />
      </mesh>
      <mesh ref={knotB}>
        <torusKnotGeometry args={[1.12, 0.011, 320, 6, 3, 7]} />
        <meshStandardMaterial
          color="#0a1220"
          emissive={PALETTE.blue}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      {/* Synapse lattice */}
      <group ref={lattice}>
        <instancedMesh ref={nodesRef} args={[undefined, undefined, LATTICE_NODES]}>
          <octahedronGeometry args={[0.045, 0]} />
          <meshStandardMaterial color="#0a1220" emissive={PALETTE.blueSoft} emissiveIntensity={1.8} toneMapped={false} />
        </instancedMesh>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={links} count={links.length / 3} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color={PALETTE.blue} transparent opacity={0.32} toneMapped={false} />
        </lineSegments>
      </group>

      {/* Gimbal rings */}
      {RINGS.map((spec, i) => (
        <group
          key={spec.radius}
          ref={(node) => {
            rings.current[i] = node;
          }}
        >
          <mesh>
            <torusGeometry args={[spec.radius, spec.tube, 12, 160]} />
            <meshStandardMaterial {...(i === 1 ? METAL.brushed : METAL.titanium)} />
          </mesh>
          {spec.ticks > 0 && (
            <instancedMesh ref={ticksRef} args={[undefined, undefined, spec.ticks]}>
              <boxGeometry args={[0.035, 0.16, 0.12]} />
              <meshStandardMaterial {...METAL.steel} emissive={PALETTE.amber} emissiveIntensity={0.25} />
            </instancedMesh>
          )}
        </group>
      ))}

      {/* Containment shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[3.05, 1]} />
        <meshStandardMaterial {...METAL.steel} wireframe transparent opacity={0.42} />
      </mesh>

      {/* Mount: frame ring, radial struts, clamps, spine into the channels */}
      <group ref={mount}>
        <mesh>
          <torusGeometry args={[FRAME_RADIUS, 0.13, 16, 96]} />
          <meshStandardMaterial {...METAL.graphite} />
        </mesh>
        <mesh>
          <torusGeometry args={[FRAME_RADIUS - 0.26, 0.018, 8, 128]} />
          <meshStandardMaterial color="#1a0d03" emissive={PALETTE.amber} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <instancedMesh ref={strutsRef} args={[undefined, undefined, STRUTS]}>
          <cylinderGeometry args={[0.05, 0.05, FRAME_RADIUS - 3.15, 8]} />
          <meshStandardMaterial {...METAL.titanium} />
        </instancedMesh>
        <instancedMesh ref={clampsRef} args={[undefined, undefined, 4]}>
          <boxGeometry args={[0.7, 0.42, 0.6]} />
          <meshStandardMaterial {...METAL.steel} />
        </instancedMesh>
      </group>
      <mesh position={[0, 0, -4.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.46, 3.2, 20]} />
        <meshStandardMaterial {...METAL.graphite} />
      </mesh>
    </group>
  );
}
