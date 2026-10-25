import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
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
