import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Turbopack (default in Next.js 16)
  // Empty config to acknowledge we're using Turbopack
  turbopack: {},
  
  // Transpile packages that need it
  transpilePackages: [
    '@privy-io/react-auth',
    '@walletconnect/ethereum-provider',
    '@walletconnect/utils',
  ],
  
  // Experimental features for app router
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
};

export default nextConfig;
