/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ibb.co",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "via.placeholder.com",
      "twkqjhsoxiktglspades.supabase.co",
    ],
  },
};

module.exports = nextConfig;
