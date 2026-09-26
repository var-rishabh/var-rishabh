"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import type * as THREE from "three";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { clamp, lerp } from "@/lib/utils";

interface CameraRigProps {
  children: ReactNode;
  scrollProgress: MotionValue<number>;
}

/**
 * Owns camera behavior: a slow scroll-linked dolly/rotation (driven by the
 * page's `scrollYProgress`) combined with subtle pointer parallax on the
 * scene group. Both are eased with a lerp toward the target each frame
 * rather than snapping, for the "cinematic" feel.
 */
export default function CameraRig({ children, scrollProgress }: CameraRigProps) {
  const pointer = usePointerParallax();
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const progress = clamp(scrollProgress.get(), 0, 1);

    const targetZ = lerp(6.4, 3, progress);
    const targetY = lerp(0.2, -0.9, progress);

    state.camera.position.z = lerp(state.camera.position.z, targetZ, 0.06);
    state.camera.position.y = lerp(state.camera.position.y, targetY, 0.06);
    state.camera.lookAt(0, targetY * 0.35, 0);

    if (group.current) {
      const targetRotX = pointer.current.y * 0.1;
      const targetRotY = pointer.current.x * 0.14 + progress * Math.PI * 0.5;

      group.current.rotation.x = lerp(group.current.rotation.x, targetRotX, 0.05);
      group.current.rotation.y = lerp(group.current.rotation.y, targetRotY, 0.05);
    }
  });

  return <group ref={group}>{children}</group>;
}
