import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@keshab-bhatt/content",
    "@keshab-bhatt/types",
    "@keshab-bhatt/ui",
    "@keshab-bhatt/validation",
  ],
};

export default nextConfig;
