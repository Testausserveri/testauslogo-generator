/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/:text",
        destination: "/api/:text"
      }
    ]
  }
}

module.exports = nextConfig
