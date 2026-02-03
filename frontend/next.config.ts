import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path*`,
      },
      {
        source: "/api/medicines/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medicines/:path*`,
      },
      {
        source: "/api/orders/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/:path*`,
      },
      {
        source: "/api/categories/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medicines/categories`,
      }
    ];
  },
};

export default nextConfig;
