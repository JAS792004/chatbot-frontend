import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // This will prevent Vercel from failing due to ESLint warnings
  },
};

export default nextConfig;
