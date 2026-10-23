import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@keshab-bhatt/types";
import { getSeoConfig } from "@keshab-bhatt/content";

import { getSeoAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ne" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ne") {
    return {};
  }

  const currentLocale = locale as Locale;
  const seo = getSeoConfig(currentLocale);
  const alternates = getSeoAlternates("", currentLocale);

  return {
    title: {
      absolute: seo.defaultTitle,
    },
    description: seo.description,
    keywords: seo.keywords,
    alternates,
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      url: alternates.canonical,
      locale: currentLocale === "ne" ? "ne_NP" : "en_US",
      type: "website",
      siteName: seo.openGraph.siteName,
      images: seo.openGraph.images,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ne") {
    notFound();
  }

  return <>{children}</>;
}
