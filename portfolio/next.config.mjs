/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile three.js examples/addons that ship as untranspiled ESM.
  transpilePackages: ["three"],
  images: {
    // Add remote patterns here if project thumbnails are served from a CDN.
    remotePatterns: [],
  },
};

export default nextConfig;
