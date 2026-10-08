import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Mukta, Playfair_Display, Caveat, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components";
import { startKeepAliveScheduler } from "@/lib";
import { absoluteUrl, siteUrl } from "@/config";

if (typeof window === "undefined") {
  startKeepAliveScheduler();
}

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-mukta",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Keshab Datt Bhatt | Business Consultant & Financial Sector Professional",
    template: "%s | Keshab Datt Bhatt"
  },
  description: "Official executive portfolio of Keshab Datt Bhatt: Business Consultant, Business Coach, and Financial Sector Leader in Kathmandu, Nepal.",
  keywords: [
    "Keshab Bhatt",
    "Keshab Datt Bhatt",
    "Business Consultant Nepal",
    "Business Coach Nepal",
    "Management Consultant Kathmandu",
    "Banking and Capital Markets Nepal",
    "Financial Strategy",
    "Investment Analysis"
  ],
  authors: [{ name: "Keshab Datt Bhatt", url: siteUrl }],
  creator: "Keshab Datt Bhatt",
  publisher: "Keshab Datt Bhatt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/en",
    languages: {
      "en-US": "/en",
      "ne-NP": "/ne",
    },
  },
  openGraph: {
    title: "Keshab Datt Bhatt | Business Consultant & Financial Sector Leader",
    description: "Official portfolio of Keshab Datt Bhatt: Business Consultant, Business Coach, and Capital Markets Specialist in Nepal.",
    url: absoluteUrl("/en"),
    siteName: "Keshab Datt Bhatt Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Keshab Datt Bhatt - Executive Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Keshab Datt Bhatt | Business Consultant & Strategy Leader",
    description: "Business Consultant, Business Coach, and Banking/Capital Markets Specialist in Nepal.",
    images: ["/images/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="navy-gold"
      data-mode="light"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${mukta.variable} ${playfairDisplay.variable} ${cinzel.variable} ${caveat.variable} h-full`}
    >
      <head>
        <meta name="theme-color" content="#0b152d" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('kb_theme_mode')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.setAttribute('data-mode',d?'dark':'light');var p=localStorage.getItem('kb_theme_palette')||'navy-gold';document.documentElement.setAttribute('data-theme',p);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[var(--bg-app)] text-[var(--text-main)] antialiased transition-colors duration-300"
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
