/** @type {import('next').NextConfig} */
const path = require('path')

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});


const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/imgs/**',
      },
    ],
  },
}

module.exports = withPWA(nextConfig)
