module.exports = {
    images: {
      domains: ["res.cloudinary.com"],
    },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      }
    ]
  }
}