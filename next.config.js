const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

if (process.argv.includes('dev')) {
  initOpenNextCloudflareForDev();
}
module.exports = nextConfig;
