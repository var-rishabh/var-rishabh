/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile three.js examples/addons that ship as untranspiled ESM.
  transpilePackages: ["three"],
  images: {
    // Add remote patterns here if project thumbnails are served from a CDN.
    remotePatterns: [],
  },
  webpack: (config) => {
    // Allow importing GLSL shader files directly (e.g. `import frag from './shader.frag'`).
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader"],
    });
    return config;
  },
};

export default nextConfig;
