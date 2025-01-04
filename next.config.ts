import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "little-eagle-943.convex.cloud", // Replace with your actual hostname
      },
      {
        protocol: "https",
        hostname: "scintillating-minnow-468.convex.cloud", // Add additional hostnames as needed
      },
    ],
    domains: [
      "little-eagle-943.convex.cloud",
      "scintillating-minnow-468.convex.cloud", // Allow images from specific domains
    ],
    unoptimized: true, // If CORS is still problematic, disable image optimization
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during the build process
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during the build process
  },
};

export default nextConfig;
