/**
 * Shared, framework-agnostic helpers. Keep this free of React/Three imports
 * so it can be unit-tested in isolation.
 */

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Small deterministic PRNG (mulberry32). Used for procedural layout so the
 * machine looks identical on every render / reload and stays pure — no
 * Math.random() during render.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hermite ease between `edge0` and `edge1`, clamped to 0..1. */
export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** 1 inside [start, end], easing to 0 over `feather` on either side. */
export function windowed(value: number, start: number, end: number, feather: number): number {
  return smoothstep(start - feather, start, value) * (1 - smoothstep(end, end + feather, value));
}
