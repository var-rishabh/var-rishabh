/**
 * The site is served under a basePath (GitHub Pages project site at
 * /var-rishabh). next/link and next/image add it automatically; plain
 * <a href>, <img src>, CSS url() or fetch() paths into public/ do not,
 * so they must go through this helper. Set in next.config.mjs.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
