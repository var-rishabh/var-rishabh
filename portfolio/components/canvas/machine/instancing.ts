"use client";

import { useLayoutEffect, type RefObject } from "react";
import { Object3D, type InstancedMesh } from "three";

export type InstanceWriter = (index: number, dummy: Object3D) => void;

const scratch = new Object3D();

/** Writes every instance matrix of `mesh` through a reusable Object3D. */
export function writeInstances(mesh: InstancedMesh, count: number, write: InstanceWriter) {
  for (let i = 0; i < count; i += 1) {
    scratch.position.set(0, 0, 0);
    scratch.rotation.set(0, 0, 0);
    scratch.scale.set(1, 1, 1);
    write(i, scratch);
    scratch.updateMatrix();
    mesh.setMatrixAt(i, scratch.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

/**
 * One-off layout for instanced meshes that never move after mount
 * (struts, cabinets, cable trays). Recomputes the bounding sphere so
 * frustum culling sees the real instance spread.
 */
export function useStaticInstances(
  ref: RefObject<InstancedMesh>,
  count: number,
  write: InstanceWriter,
) {
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    writeInstances(mesh, count, write);
    mesh.computeBoundingSphere();
    // `write` is expected to be a stable, pure layout function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, count]);
}
