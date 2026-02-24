/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static site generation - creates standalone HTML files
  distDir: 'build',
  trailingSlash: false, // Enforce no trailing slash to prevent duplicate URLs
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
