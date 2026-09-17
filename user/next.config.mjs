/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.BACKEND_URL || (isProd ? 'http://backend:5000' : 'http://127.0.0.1:5000');
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
