import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, Sparkles } from "lucide-react";
import type { Locale, BlogPost, ArticlePreviewItem } from "@keshab-bhatt/types";
import { getPortfolioData } from "@keshab-bhatt/content";
import { Header, Footer, ArticlesListView } from "@/components";
import { BlogService } from "@/services";
import { siteUrl } from "@/config/env";

import { getSeoAlternates } from "@/lib/seo";

interface ArticlesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isNe = locale === "ne";
  const currentLocale = (locale === "ne" ? "ne" : "en") as Locale;

  const title = isNe
    ? "लेख तथा अनुसन्धान विचार | केशव दत्त भट्ट"
    : "Articles & Executive Insights | Keshab Datt Bhatt";
  const description = isNe
    ? "केशव दत्त भट्टद्वारा बैंकिङ, पुँजी बजार, वित्तीय विश्लेषण र रणनीतिक व्यवस्थापनसम्बन्धी लेख तथा विश्लेषणहरू।"
    : "Executive articles, financial sector research, capital markets analysis, and strategic management insights by Keshab Datt Bhatt.";

  const alternates = getSeoAlternates("/articles", currentLocale);

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      "Keshab Bhatt Articles",
      "Banking Analysis Nepal",
      "Capital Markets Insights Nepal",
      "Financial Strategy Articles",
      "NEPSE Stock Market Analysis",
      "Corporate Governance Nepal",
      "Business Consulting Articles"
    ],
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: "Keshab Datt Bhatt Portfolio",
      locale: isNe ? "ne_NP" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          alt: "Articles & Insights - Keshab Datt Bhatt"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-cover.jpg"],
    },
  };
}

function mapBlogToPreview(blog: BlogPost): ArticlePreviewItem {
  const words = blog.content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(2, Math.ceil(words / 180));
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    category: blog.category,
    summary: blog.excerpt,
    keyArgument: blog.excerpt,
    implications: blog.seoDescription || blog.excerpt,
    actionText: blog.locale === "ne" ? "लेख पढ्नुहोस्" : "Read Full Article",
    url: `/articles/${blog.slug}`,
    date: blog.publishedAt ? blog.publishedAt.split("T")[0] : undefined,
    readTime: `${readTimeMinutes} min read`,
    content: blog.content.split("\n\n").filter(Boolean),
    author: blog.author.name,
  };
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ne") {
    notFound();
  }

  const currentLocale = locale as Locale;
  const data = getPortfolioData(currentLocale);
  const isNe = currentLocale === "ne";

  let displayArticles: ArticlePreviewItem[] = [];
  try {
    const dynamicBlogs = await BlogService.getBlogs({
      locale: currentLocale,
      isPublished: true,
      limit: 100,
    });
    displayArticles = dynamicBlogs.data.map(mapBlogToPreview);
  } catch (err) {
    console.error("Failed to load dynamic blogs for articles listing:", err);
  }

  const pageUrl = isNe ? `${siteUrl}/ne/articles` : `${siteUrl}/articles`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isNe ? "लेख तथा अनुसन्धान विचार" : "Articles & Executive Insights",
    description: isNe
      ? "केशव दत्त भट्टद्वारा बैंकिङ, पुँजी बजार, वित्तीय विश्लेषण र रणनीतिक व्यवस्थापनसम्बन्धी लेखहरू।"
      : "Executive articles and financial insights by Keshab Datt Bhatt.",
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Keshab Datt Bhatt Portfolio",
      url: siteUrl,
    },
    about: {
      "@type": "Person",
      name: "Keshab Datt Bhatt",
      jobTitle: "Business Consultant & Financial Sector Leader",
    },
    hasPart: displayArticles.map((art) => ({
      "@type": "BlogPosting",
      headline: art.title,
      description: art.summary,
      url: isNe ? `${siteUrl}/ne/articles/${art.slug || art.id}` : `${siteUrl}/articles/${art.slug || art.id}`,
      author: {
        "@type": "Person",
        name: "Keshab Datt Bhatt",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header
        locale={currentLocale}
        navItems={data.nav}
        downloadCvText={data.hero.downloadCvText}
        cvUrl={data.hero.cvUrl}
      />

      <main className="flex-1 bg-[var(--bg-app)]">
        <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-card-inner)]/50 py-10 sm:py-14">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Link href={isNe ? "/ne" : "/"} className="hover:text-[var(--accent-gold)] flex items-center gap-1 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>{isNe ? "गृहपृष्ठ" : "Home"}</span>
              </Link>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="text-[var(--accent-gold)] font-medium">
                {isNe ? "लेखहरू" : "Articles"}
              </span>
            </nav>

            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--accent-gold-soft)] border border-[var(--accent-gold-border)] text-xs font-semibold text-[var(--accent-gold)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isNe ? "विचार तथा अनुसन्धान" : "Thought Leadership & Insights"}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-main)] font-[family-name:var(--font-sans)]">
                {isNe ? "लेख तथा कार्यकारी विश्लेषणहरू" : "Articles & Financial Sector Insights"}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {isNe
                  ? "बैंकिङ प्रणाली, पुँजी बजार, वित्तीय मूल्यांकन र संस्थागत रणनीतिका विविध आयामहरूमा केन्द्रित अनुसन्धान तथा विश्लेषणहरू।"
                  : "Empirical commentary, valuation frameworks, and corporate advisory perspectives designed for executives, investors, and policymakers."}
              </p>
            </div>

          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ArticlesListView articles={displayArticles} locale={currentLocale} />
          </div>
        </section>
      </main>

      <Footer data={data.footer} locale={currentLocale} />
    </>
  );
}
