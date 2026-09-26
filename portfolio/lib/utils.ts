/**
 * Shared, framework-agnostic helpers. Keep this free of React/Three imports
 * so it can be unit-tested in isolation.
 */

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
