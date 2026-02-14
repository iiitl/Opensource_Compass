import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.AUTH_SERVICE_URL || "http://localhost:8080"}/auth/:path*`,
      },
      {
        source: "/api/github/:path*",
        destination: `${process.env.GITHUB_SERVICE_URL || "http://localhost:8081"}/:path*`,
      },
      {
        source: "/api/ai/:path*",
        destination: `${process.env.AI_SERVICE_URL || "http://localhost:8082"}/:path*`,
      },
      {
        source: "/api/core/:path*",
        destination: `${process.env.CORE_SERVICE_URL || "http://localhost:8083"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
