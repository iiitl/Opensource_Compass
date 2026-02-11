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
        destination: "http://localhost:8080/auth/:path*",
      },
      {
        source: "/api/github/:path*",
        destination: "http://localhost:8081/:path*",
      },
      {
        source: "/api/ai/:path*",
        destination: "http://localhost:8082/:path*",
      },
      {
        source: "/api/core/:path*",
        destination: "http://localhost:8083/:path*",
      },
    ];
  },
};

export default nextConfig;
