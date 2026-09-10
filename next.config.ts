import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
      },
    ],
  },
    reactStrictMode: false,
};

export default nextConfig;
