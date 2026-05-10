import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: undefined,
  },
  webpack: (config) => config,
};

export default nextConfig;
