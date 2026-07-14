/** @type {import('next').NextConfig} */
const storageHost = new URL(
  process.env.S3_PUBLIC_URL || 'https://storage.eclarine.77-42-124-130.sslip.io'
).hostname;

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: storageHost, pathname: '/**' }],
  },
};

export default nextConfig;
