import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // If a public API base is provided, don't proxy; let the client call it directly.
    if (
      process.env.NEXT_PUBLIC_API_BASE_URL &&
      process.env.NEXT_PUBLIC_API_BASE_URL.trim() !== ""
    ) {
      return [];
    }
    const backendOrigin = process.env.BACKEND_ORIGIN || "http://localhost:5500";
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
