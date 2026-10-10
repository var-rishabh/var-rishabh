"use client";

import { useEffect, useRef } from "react";

export interface PointerVector {
  x: number;
  y: number;
}

/**
 * Tracks normalized pointer position (-1..1 on each axis) via a plain
 * window listener rather than React state, since the R3F canvas sits
 * behind a `pointer-events-none` layer and can't receive DOM events of
 * its own. Consumed inside `useFrame` loops for parallax.
 */
export function usePointerParallax() {
  const pointer = useRef<PointerVector>({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return pointer;
}
