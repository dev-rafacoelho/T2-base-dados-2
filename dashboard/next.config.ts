import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: "loose"
  },
  webpack: (config: any) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
};

export default nextConfig;
