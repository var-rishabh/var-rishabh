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

/** Hermite ease between `edge0` and `edge1`, clamped to 0..1. */
export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** 1 inside [start, end], easing to 0 over `feather` on either side. */
export function windowed(value: number, start: number, end: number, feather: number): number {
  return smoothstep(start - feather, start, value) * (1 - smoothstep(end, end + feather, value));
}
