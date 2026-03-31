import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    // Only use rewrites in development (local)
    // In production, frontend calls backend directly via NEXT_PUBLIC_* URLs
    // since CORS is already configured on the backend
    if (process.env.NODE_ENV === 'production') {
      return [];
    }

    const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8080";
    const coreServiceUrl = process.env.CORE_SERVICE_URL || "http://localhost:8083";
    const githubServiceUrl = process.env.GITHUB_SERVICE_URL || "http://localhost:8081";
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8082";
    
    return [
      {
        source: "/api/auth/:path*",
        destination: `${authServiceUrl}/auth/:path*`,
      },
      {
        source: "/api/github/:path*",
        destination: `${githubServiceUrl}/:path*`,
      },
      {
        source: "/api/ai/:path*",
        destination: `${aiServiceUrl}/:path*`,
      },
      {
        source: "/api/core/:path*",
        destination: `${coreServiceUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
