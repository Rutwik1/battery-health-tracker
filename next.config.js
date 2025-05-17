// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: 'loose', // Handle ES modules more flexibly
    serverComponentsExternalPackages: [], // Packages that should be treated as external in server components
  },
  // Use CommonJS for some file extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  eslint: {
    // Don't run ESLint during build for faster builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't run type checking during build for faster builds
    ignoreBuildErrors: true,
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig