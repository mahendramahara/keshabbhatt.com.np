import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, ArrowLeft, Clock, Calendar, Sparkles, User, Share2 } from "lucide-react";
import type { Locale, BlogPost, ArticlePreviewItem } from "@keshab-bhatt/types";
import { getPortfolioData, getArticlesData } from "@keshab-bhatt/content";
import { Header, Footer } from "@/components";
import { BlogService } from "@/services";
import { absoluteUrl, siteUrl } from "@/config/env";

export const dynamicParams = true;

interface ArticleDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "ne"];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const loc of locales) {
    try {
      const blogs = await BlogService.getBlogs({ locale: loc, limit: 100, isPublished: true });
      if (blogs.data.length > 0) {
        for (const blog of blogs.data) {
          params.push({ locale: loc, slug: blog.slug });
        }
      } else {
        const articles = getArticlesData(loc);
        for (const art of articles.items) {
          if (art.slug) {
            params.push({ locale: loc, slug: art.slug });
          }
        }
      }
    } catch {
      const articles = getArticlesData(loc);
      for (const art of articles.items) {
        if (art.slug) {
          params.push({ locale: loc, slug: art.slug });
        }
      }
    }
  }

  return params;
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

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = locale as Locale;
  const articlesData = getArticlesData(currentLocale);

  let title = "Article Not Found | Keshab Datt Bhatt";
  let description = "Article not found.";
  let category = "Finance";

  const dynamicBlog = await BlogService.getBlogBySlug(slug, currentLocale);
  if (dynamicBlog) {
    title = dynamicBlog.seoTitle || `${dynamicBlog.title} | Keshab Datt Bhatt`;
    description = dynamicBlog.seoDescription || dynamicBlog.excerpt;
    category = dynamicBlog.category;
  } else {
    const article = articlesData.items.find((a) => a.slug === slug || a.id === slug);
    if (article) {
      title = `${article.title} | Keshab Datt Bhatt`;
      description = article.summary;
      category = article.category;
    } else {
      return { title };
    }
  }

  return {
    title,
    description,
    keywords: [
      category,
      "Keshab Datt Bhatt",
      "Financial Analysis",
      "Banking Nepal",
      "Capital Markets Insights",
    ],
    alternates: {
      canonical: absoluteUrl(`/${locale}/articles/${slug}`),
      languages: {
        "en-US": absoluteUrl(`/en/articles/${slug}`),
        "ne-NP": absoluteUrl(`/ne/articles/${slug}`),
        "x-default": absoluteUrl(`/en/articles/${slug}`),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/${locale}/articles/${slug}`),
      siteName: "Keshab Datt Bhatt Portfolio",
      locale: currentLocale === "ne" ? "ne_NP" : "en_US",
      type: "article",
      authors: ["Keshab Datt Bhatt"],
      images: [
        {
          url: "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-cover.jpg"],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ne") {
    notFound();
  }

  const currentLocale = locale as Locale;
  const data = getPortfolioData(currentLocale);
  const articlesData = getArticlesData(currentLocale);
  const isNe = currentLocale === "ne";

  let article: ArticlePreviewItem | undefined;
  const dynamicBlog = await BlogService.getBlogBySlug(slug, currentLocale);
  if (dynamicBlog) {
    article = mapBlogToPreview(dynamicBlog);
    BlogService.incrementViews(slug).catch(() => {});
  } else {
    article = articlesData.items.find((a) => a.slug === slug || a.id === slug);
  }

  if (!article) {
    notFound();
  }

  let relatedArticles: ArticlePreviewItem[] = [];
  try {
    const relatedBlogs = await BlogService.getBlogs({
      locale: currentLocale,
      category: article.category,
      isPublished: true,
      limit: 4,
    });
    relatedArticles = relatedBlogs.data
      .filter((b) => b.slug !== slug && b.id !== article.id)
      .slice(0, 3)
      .map(mapBlogToPreview);
  } catch {
    relatedArticles = [];
  }

  if (relatedArticles.length === 0) {
    relatedArticles = articlesData.items
      .filter((a) => a.id !== article.id && a.slug !== slug)
      .slice(0, 3);
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    author: {
      "@type": "Person",
      name: "Keshab Datt Bhatt",
      jobTitle: "Business Consultant & Financial Sector Leader",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Keshab Datt Bhatt",
    },
    datePublished: "2026-01-15T08:00:00+05:45",
    mainEntityOfPage: absoluteUrl(`/${currentLocale}/articles/${slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Header
        locale={currentLocale}
        navItems={data.nav}
        downloadCvText={data.hero.downloadCvText}
        cvUrl={data.hero.cvUrl}
      />

      <main className="flex-1 bg-[var(--bg-app)]">
        <section className="bg-[#061739] text-white py-10 sm:py-14 border-b border-white/10 shadow-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70 flex-wrap">
              <Link href={`/${currentLocale}`} className="hover:text-[var(--accent-hero)] flex items-center gap-1 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>{isNe ? "गृहपृष्ठ" : "Home"}</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-white/40" />
              <Link href={`/${currentLocale}/articles`} className="hover:text-[var(--accent-hero)] transition-colors">
                {isNe ? "लेखहरू" : "Articles"}
              </Link>
              <ChevronRight className="w-3 h-3 text-white/40" />
              <span className="text-[var(--accent-hero)] font-medium truncate max-w-[200px] sm:max-w-xs">
                {article.title}
              </span>
            </nav>

            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="font-semibold text-[var(--accent-hero)] bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-white/70 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.date || "2026"}</span>
              </span>
              <span className="text-white/70 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime || "5 min read"}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight font-[family-name:var(--font-sans)]">
              {article.title}
            </h1>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full border border-[var(--accent-hero)] bg-gradient-to-br from-[#0c1833] to-[#061025] flex items-center justify-center font-[family-name:var(--font-display)] text-sm font-bold text-[var(--accent-hero)] shadow-xs">
                KB
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">
                  {isNe ? "केशव दत्त भट्ट" : "Keshab Datt Bhatt"}
                </div>
                <div className="text-white/70 text-[11px]">
                  {isNe ? "व्यावसायिक सल्लाहकार तथा वित्तीय क्षेत्र विज्ञ" : "Business Consultant & Financial Sector Leader"}
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {article.keyArgument && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] border-l-4 border-l-[var(--accent-gold)] shadow-xs space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{isNe ? "कार्यकारी मुख्य निष्कर्ष" : "Executive Summary & Core Thesis"}</span>
                </div>
                <p className="text-sm sm:text-base font-medium text-[var(--text-main)] leading-relaxed italic">
                  &ldquo;{article.keyArgument}&rdquo;
                </p>
                {article.implications && (
                  <p className="text-xs text-[var(--text-muted)] pt-1">
                    <strong className="text-[var(--text-main)]">{isNe ? "रणनीतिक प्रभाव: " : "Strategic Implication: "}</strong>
                    {article.implications}
                  </p>
                )}
              </div>
            )}

            <div className="p-7 sm:p-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-6">
              {article.content && article.content.length > 0 ? (
                article.content.map((p, idx) => (
                  <p key={idx} className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed font-[family-name:var(--font-sans)]">
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-sm sm:text-base text-[var(--text-sub)] leading-relaxed">
                  {article.summary}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <Link
                href={`/${currentLocale}/articles`}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--text-main)] hover:text-[var(--accent-gold)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isNe ? "सबै लेखहरूमा फर्कनुहोस्" : "Back to All Articles"}</span>
              </Link>
            </div>

            {relatedArticles.length > 0 && (
              <div className="pt-8 space-y-5">
                <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
                  {isNe ? "सम्बन्धित लेख तथा विश्लेषणहरू" : "Related Articles & Analysis"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/${currentLocale}/articles/${rel.slug || rel.id}`}
                      className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent-gold)] transition-all shadow-xs flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-semibold text-[var(--accent-gold)] bg-[var(--accent-gold-soft)] px-2 py-0.5 rounded-full">
                          {rel.category}
                        </span>
                        <h4 className="text-xs sm:text-[13px] font-bold text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1 group-hover:text-[var(--accent-gold)]">
                        <span>{isNe ? "पढ्नुहोस्" : "Read Article"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer data={data.footer} locale={currentLocale} />
    </>
  );
}
