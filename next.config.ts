import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  eslint: {
    // 🚀 Ignore ESLint errors during builds (Vercel will not fail deployment)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
