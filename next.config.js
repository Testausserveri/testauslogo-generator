/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
