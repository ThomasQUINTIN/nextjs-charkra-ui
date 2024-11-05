import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  env: {
    NEXT_PUBLIC_URL:
      process.env.NEXTAUTH_URL != undefined
        ? process.env.NEXTAUTH_URL
        : process.env.VERCEL_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
        : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
};

export default nextConfig;
