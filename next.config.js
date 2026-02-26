/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export only for production builds; dev mode runs as normal Next.js server
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  distDir: 'build',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
