/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is now enabled by default in Next.js 16+
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
