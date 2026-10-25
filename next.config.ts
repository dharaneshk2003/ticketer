// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.convex.cloud", // Allow all convex.cloud subdomains
      },
    ],
    domains: [
      "little-eagle-943.convex.cloud",
      "scintillating-minnow-468.convex.cloud",
    ],
    unoptimized: true, // Disable optimization to avoid CORS issues for PDF rendering
  },
  eslint: {
    ignoreDuringBuilds: true, // Allow builds to proceed even with ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // Allow builds even if there are TypeScript errors
  },
  // Optional: if you want to customize webpack for libraries like html2pdf.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // disable fs module on client-side
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
