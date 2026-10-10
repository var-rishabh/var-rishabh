/**
 * Served from GitHub Pages as a project site:
 * https://var-rishabh.github.io/var-rishabh/
 * so every route and asset lives under /var-rishabh.
 */
const basePath = "/var-rishabh";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export for GitHub Pages (no Node server).
  output: "export",
  basePath,
  // Exposed to client code for plain <a>/<img> paths into public/, which
  // (unlike next/link and next/image) don't get basePath automatically.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Transpile three.js examples/addons that ship as untranspiled ESM.
  transpilePackages: ["three"],
  images: {
    // GitHub Pages has no image-optimisation server.
    unoptimized: true,
    // Add remote patterns here if project thumbnails are served from a CDN.
    remotePatterns: [],
  },
};

export default nextConfig;
