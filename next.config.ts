import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Tell Next.js to bundle content & data directories into serverless functions.
   * Required on Vercel so that /api/search, /api/messages (local-json fallback),
   * and the thoughts page can read markdown files at runtime.
   */
  outputFileTracingIncludes: {
    "/api/search": ["./content/posts/**/*.md"],
    "/api/messages": ["./data/**"],
    "/thoughts": ["./content/thoughts/**/*.md"],
  },

  /**
   * Silence the Turbopack "missing peer dep" warning for ioredis.
   * ioredis is only imported at runtime when REDIS_URL is set.
   */
  serverExternalPackages: ["ioredis", "nodemailer"],
};

export default nextConfig;
