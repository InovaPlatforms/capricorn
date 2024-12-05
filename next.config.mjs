/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['picsum.photos', 'z-assets.s3.us-west-1.amazonaws.com'],
  },
  experimental: {
    missingSuspenseWithCSRError: false,
  },
};

export default nextConfig;
