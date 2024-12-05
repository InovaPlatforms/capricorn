/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'z-assets.s3.us-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ]
  }
}

export default nextConfig
