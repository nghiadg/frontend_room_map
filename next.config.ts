import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Sharp is used for image processing in API routes (server-side only)
  serverExternalPackages: ["sharp"],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
