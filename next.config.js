/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  swcCompress: false,
  images: {
    domains: [
      "localhost",
      "zlite-uat.hutechweb.com",
      "zlite-uat.s3.ap-south-1.amazonaws.com",
      "zlite-uat.s3.amazonaws.com",
      "zef-discovery.s3.ap-south-1.amazonaws.com",
      "zef-discovery.s3.amazonaws.com",
      "43.204.121.9",
      "discover.zlite.in",
      "zlite-production.s3.amazonaws.com",
      "zlite-production.s3.ap-south-1.amazonaws.com",
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  distDir: "build",
};

module.exports = nextConfig;
