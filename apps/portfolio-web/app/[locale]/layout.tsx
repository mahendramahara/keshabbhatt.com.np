import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@keshab-bhatt/types";
import { getSeoConfig } from "@keshab-bhatt/content";

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

  const seo = getSeoConfig(locale as Locale);

  return {
    title: seo.defaultTitle,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "en-US": "/en",
        "ne-NP": "/ne",
      },
    },
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      url: seo.openGraph.url,
      locale: seo.openGraph.locale,
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
