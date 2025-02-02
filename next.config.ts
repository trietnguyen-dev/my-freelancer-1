import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/traces/:path*',
        destination: 'http://localhost:16686/api/traces/:path*',
      },
    ];
  },
};

export default nextConfig;