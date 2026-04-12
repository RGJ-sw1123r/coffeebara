/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
    ],
  },
};

export default nextConfig;
