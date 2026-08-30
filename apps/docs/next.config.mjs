/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@design-wiki/registry"],
  compress: true,
  async headers() {
    return [
      {
        source: "/r/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/(llms.txt|llms-full.txt)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

