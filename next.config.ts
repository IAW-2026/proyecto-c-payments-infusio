import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  trailingSlash: false,
  images: {
    formats: ["image/webp"],
  },
};

export default nextConfig;
