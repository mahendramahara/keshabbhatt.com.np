import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Keshab Datt Bhatt | Executive Portfolio",
    short_name: "Keshab Bhatt",
    description: "Official executive portfolio of Keshab Datt Bhatt: Business Consultant, Business Coach, and Financial Sector Leader in Nepal.",
    start_url: "/en",
    display: "standalone",
    background_color: "#061739",
    theme_color: "#0b152d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
