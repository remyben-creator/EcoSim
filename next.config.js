/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:path*",        // frontend API path
            destination: "http://localhost:5000/api/:path*", // backend server
          },
        ]
      : [];
  },
};

module.exports = nextConfig;