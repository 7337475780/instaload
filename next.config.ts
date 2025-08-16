import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net", // Instagram fallback CDN
      },
      {
        protocol: "https",
        hostname: "**.fna.fbcdn.net", // another FB CDN
      },
    ],
  },
};

export default nextConfig;
