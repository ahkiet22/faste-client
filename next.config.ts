import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@iconify/react',
      '@radix-ui/react-icons',
      '@tanstack/react-query',
      'date-fns',
      'recharts',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
