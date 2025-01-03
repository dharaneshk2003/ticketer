import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Config options here */
  images: {
    remotePatterns: [
      {
        hostname: "little-eagle-943.convex.cloud",
        protocol: "https",
      },
    ],
  },
  eslint: {
    // Ignore ESLint errors during the build process
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during the build process
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
