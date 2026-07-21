/** @type {import('next').NextConfig} */
const storageHost = new URL(
  process.env.S3_PUBLIC_URL || 'https://storage.eclarine.kr'
).hostname;

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: storageHost, pathname: '/**' }],
  },
};

export default nextConfig;
