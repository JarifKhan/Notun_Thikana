/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // OR use this to fully disable optimization
    unoptimized: true,
  },
};

module.exports = nextConfig;
