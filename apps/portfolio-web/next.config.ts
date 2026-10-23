import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    "@keshab-bhatt/content",
    "@keshab-bhatt/types",
    "@keshab-bhatt/ui",
    "@keshab-bhatt/validation",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "unload=*",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/articles",
        destination: "/articles",
        permanent: true,
      },
      {
        source: "/en/articles/:slug*",
        destination: "/articles/:slug*",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: false,
      },
      {
        source: "/:locale(en|ne)/admin",
        destination: "/admin/dashboard",
        permanent: false,
      },
      {
        source: "/:locale(en|ne)/admin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/cv/keshabbhatt.com.np.pdf",
        destination: "/api/cv/download",
      },
      {
        source: "/cv/keshab-datt-bhatt-cv.pdf",
        destination: "/api/cv/download",
      },
      {
        source: "/cv/active.pdf",
        destination: "/api/cv/download",
      },
    ];
  },
};

export default nextConfig;
