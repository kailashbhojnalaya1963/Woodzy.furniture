import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder. The home directory contains a stray
  // package-lock.json (it is an accidental git repo), which otherwise makes
  // Next infer the wrong root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // owner-uploaded product photos in Supabase Storage
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
