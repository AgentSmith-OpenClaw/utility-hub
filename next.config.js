/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static site generation - creates standalone HTML files
  distDir: 'build',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
