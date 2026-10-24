import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, ArrowLeft, Clock, Calendar, Sparkles, User, BookOpen, Tag, FileText, Share2 } from "lucide-react";
import { LinkedInIcon, TwitterIcon, WhatsAppIcon } from "@/components/icons";
import type { Locale, BlogPost, ArticlePreviewItem } from "@keshab-bhatt/types";
import { getPortfolioData } from "@keshab-bhatt/content";
import { Header, Footer } from "@/components";
import { BlogService } from "@/services";
import { siteUrl } from "@/config/env";
import { renderSafeMarkdown } from "@/lib/markdown";

import { getSeoAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

interface ArticleDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "ne"];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const loc of locales) {
    try {
      const blogs = await BlogService.getBlogs({ locale: loc, limit: 100, isPublished: true });
      for (const blog of blogs.data) {
        if (blog.slug) {
          params.push({ locale: loc, slug: blog.slug });
        }
      }
    } catch {
      // Build-time without active DB
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

  const dynamicBlog = await BlogService.getBlogBySlug(slug, currentLocale);
  if (!dynamicBlog) {
    return { title: { absolute: "Article Not Found | Keshab Datt Bhatt" } };
  }

  const title = dynamicBlog.seoTitle || `${dynamicBlog.title} | Keshab Datt Bhatt`;
  const description = dynamicBlog.seoDescription || dynamicBlog.excerpt;
  const category = dynamicBlog.category;
  const alternates = getSeoAlternates(`/articles/${slug}`, currentLocale);

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      category,
      "Keshab Datt Bhatt",
      "Financial Analysis",
      "Banking Nepal",
      "Capital Markets Insights",
    ],
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
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
  const isNe = currentLocale === "ne";

  const dynamicBlog = await BlogService.getBlogBySlug(slug, currentLocale);
  if (!dynamicBlog) {
    notFound();
  }

  const article: ArticlePreviewItem = mapBlogToPreview(dynamicBlog);
  BlogService.incrementViews(slug).catch(() => {});

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

    if (relatedArticles.length === 0) {
      const otherBlogs = await BlogService.getBlogs({
        locale: currentLocale,
        isPublished: true,
        limit: 4,
      });
      relatedArticles = otherBlogs.data
        .filter((b) => b.slug !== slug && b.id !== article.id)
        .slice(0, 3)
        .map(mapBlogToPreview);
    }
  } catch {
    relatedArticles = [];
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
    mainEntityOfPage: isNe ? `${siteUrl}/ne/articles/${slug}` : `${siteUrl}/articles/${slug}`,
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
        {/* Top Breadcrumb & Article Header Section */}
        <section className="pt-8 sm:pt-12 pb-6 border-b border-[var(--border-subtle)] bg-[var(--bg-card-inner)]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)] flex-wrap">
              <Link href={isNe ? "/ne" : "/"} className="hover:text-[var(--accent-gold)] flex items-center gap-1 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>{isNe ? "गृहपृष्ठ" : "Home"}</span>
              </Link>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <Link href={isNe ? "/ne/articles" : "/articles"} className="hover:text-[var(--accent-gold)] transition-colors">
                {isNe ? "लेखहरू" : "Articles"}
              </Link>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="text-[var(--accent-gold)] font-medium truncate max-w-[200px] sm:max-w-xs">
                {article.title}
              </span>
            </nav>

            {/* Badges & Publication Meta */}
            <div className="flex items-center gap-2.5 text-xs flex-wrap">
              <span className="font-semibold text-[var(--accent-gold)] bg-[var(--accent-gold-soft)] border border-[var(--accent-gold-border)] px-3 py-0.5 rounded-full">
                {article.category}
              </span>
              <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.date || "2026"}</span>
              </span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime || "5 min read"}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-main)] leading-snug font-[family-name:var(--font-sans)]">
              {article.title}
            </h1>
          </div>
        </section>

        {/* 2-Column Reader Workspace */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* LEFT COLUMN: Main Formatted Article (col-span-8) */}
              <div className="lg:col-span-8 space-y-7">
                {/* Core Thesis / Executive Takeaway Card */}
                {article.keyArgument && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isNe ? "कार्यकारी मुख्य निष्कर्ष" : "Executive Core Thesis"}</span>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-[var(--text-main)] leading-relaxed italic">
                      &ldquo;{article.keyArgument}&rdquo;
                    </p>
                    {article.implications && article.implications.trim() !== article.keyArgument.trim() && (
                      <p className="text-xs text-[var(--text-muted)] pt-1">
                        <strong className="text-[var(--text-main)]">{isNe ? "रणनीतिक प्रभाव: " : "Strategic Implication: "}</strong>
                        {article.implications}
                      </p>
                    )}
                  </div>
                )}

                {/* Formatted Article Body */}
                <article className="p-6 sm:p-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs">
                  {dynamicBlog && dynamicBlog.content ? (
                    <div
                      className="article-executive-reader prose dark:prose-invert max-w-none text-[var(--text-sub)] text-[15px] sm:text-[17px] leading-[1.85] font-[family-name:var(--font-sans)]"
                      dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(dynamicBlog.content) }}
                    />
                  ) : article.content && article.content.length > 0 ? (
                    <div
                      className="article-executive-reader prose dark:prose-invert max-w-none text-[var(--text-sub)] text-[15px] sm:text-[17px] leading-[1.85] font-[family-name:var(--font-sans)]"
                      dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(article.content.join("\n\n")) }}
                    />
                  ) : (
                    <p className="text-[15px] sm:text-[17px] leading-[1.85] text-[var(--text-sub)] font-[family-name:var(--font-sans)]">
                      {article.summary}
                    </p>
                  )}
                </article>

                {/* Tags Pills */}
                {dynamicBlog?.tags && dynamicBlog.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{isNe ? "विषयहरू:" : "Topics:"}</span>
                    </span>
                    {dynamicBlog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-[var(--text-sub)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Sharing Bar */}
                <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] flex-wrap">
                  <span className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    <span>{isNe ? "यो लेख साझा गर्नुहोस्:" : "Share this insight:"}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(isNe ? `${siteUrl}/ne/articles/${slug}` : `${siteUrl}/articles/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-xs text-[var(--text-sub)] hover:text-[var(--accent-gold)] transition-colors flex items-center gap-1.5 font-medium shadow-2xs"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(isNe ? `${siteUrl}/ne/articles/${slug}` : `${siteUrl}/articles/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on X"
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-xs text-[var(--text-sub)] hover:text-[var(--accent-gold)] transition-colors flex items-center gap-1.5 font-medium shadow-2xs"
                    >
                      <TwitterIcon className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                      <span>X</span>
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${isNe ? `${siteUrl}/ne/articles/${slug}` : `${siteUrl}/articles/${slug}`}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on WhatsApp"
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-xs text-[var(--text-sub)] hover:text-[var(--accent-gold)] transition-colors flex items-center gap-1.5 font-medium shadow-2xs"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Back to All Articles */}
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <Link
                    href={isNe ? "/ne/articles" : "/articles"}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--text-main)] hover:text-[var(--accent-gold)] transition-colors p-2.5 rounded-xl hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-subtle)]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{isNe ? "सबै लेखहरूमा फर्कनुहोस्" : "Back to All Articles"}</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Author Information & Quick Highlights (col-span-4) */}
              <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                
                {/* Author Card */}
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{isNe ? "लेखक परिचय" : "About the Author"}</span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-gold)]/20 to-[var(--accent-gold)]/5 border border-[var(--accent-gold)]/30 flex items-center justify-center font-[family-name:var(--font-display)] text-base font-bold text-[var(--accent-gold)] shadow-xs shrink-0">
                      KB
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-main)]">
                        {dynamicBlog?.author?.name || (isNe ? "केशव दत्त भट्ट" : "Keshab Datt Bhatt")}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                        {dynamicBlog?.author?.role || (isNe ? "व्यावसायिक सल्लाहकार तथा वित्तीय क्षेत्र विज्ञ" : "Business Consultant & Financial Sector Leader")}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-sub)] leading-relaxed border-t border-[var(--border-subtle)]/70 pt-3">
                    {isNe
                      ? "बैंकिङ सञ्चालन, पुँजी बजार, संस्थागत वित्तीय अनुशासन र वित्तीय रिपोर्टिङमा गहिरो विशेषज्ञता।"
                      : "Specialized in financial sector governance, capital markets analysis, banking operations, and corporate advisory."}
                  </p>

                  <div className="pt-1">
                    <Link
                      href={isNe ? "/ne#contact" : "/#contact"}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[var(--bg-card-inner)] hover:bg-[var(--accent-gold)] hover:text-[#0a0f1d] text-xs font-semibold text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] transition-all shadow-2xs"
                    >
                      <span>{isNe ? "सम्पर्क गर्नुहोस्" : "Connect with Author"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Quick Highlighted Details */}
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isNe ? "द्रुत सारांश र विवरण" : "Quick Article Highlights"}</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]/60">
                      <span className="text-[var(--text-muted)]">{isNe ? "श्रेणी" : "Category"}</span>
                      <span className="font-semibold text-[var(--accent-gold)]">{article.category}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]/60">
                      <span className="text-[var(--text-muted)]">{isNe ? "पढ्ने समय" : "Reading Time"}</span>
                      <span className="font-semibold text-[var(--text-main)]">{article.readTime || "5 min read"}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]/60">
                      <span className="text-[var(--text-muted)]">{isNe ? "प्रकाशन मिति" : "Published Date"}</span>
                      <span className="font-semibold text-[var(--text-main)]">{article.date || "2026"}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-[var(--text-muted)]">{isNe ? "भाषा" : "Language"}</span>
                      <span className="font-semibold text-[var(--text-main)] uppercase">
                        {dynamicBlog?.locale || currentLocale}
                      </span>
                    </div>
                  </div>

                  {/* Summary / Excerpt preview */}
                  {article.summary && (
                    <div className="mt-2 p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs text-[var(--text-sub)] leading-relaxed">
                      <span className="font-bold text-[var(--text-main)] block mb-1">
                        {isNe ? "कार्यकारी संक्षेप:" : "Executive Overview:"}
                      </span>
                      {article.summary}
                    </div>
                  )}
                </div>

                {/* Quick CV Download card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-inner)] border border-[var(--border-card)] shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                    <FileText className="w-4 h-4 text-[var(--accent-gold)]" />
                    <span>{isNe ? "कार्यकारी बायोडाटा (CV)" : "Executive Curriculum Vitae"}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {isNe
                      ? "केशव दत्त भट्टको विस्तृत वित्तीय तथा व्यवस्थापकीय पृष्ठभूमि अध्ययन गर्नुहोस्।"
                      : "Review professional qualifications, capital market credentials, and career achievements."}
                  </p>
                  <Link
                    href={data.hero.cvUrl || "/cv/keshab-bhatt-cv.pdf"}
                    target="_blank"
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-gold)] hover:underline pt-1"
                  >
                    <span>{isNe ? "बायोडाटा डाउनलोड गर्नुहोस्" : "Download CV (PDF)"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </aside>

            </div>

            {/* Related Articles & Analysis Grid */}
            {relatedArticles.length > 0 && (
              <div className="pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-[var(--border-subtle)] space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
                  {isNe ? "सम्बन्धित लेख तथा विश्लेषणहरू" : "Related Articles & Strategic Insights"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/${currentLocale}/articles/${rel.slug || rel.id}`}
                      className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent-gold)]/40 transition-all shadow-xs flex flex-col justify-between space-y-3 group hover:shadow-md"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-semibold text-[var(--accent-gold)] bg-[var(--accent-gold-soft)] px-2.5 py-0.5 rounded-full border border-[var(--accent-gold-border)]">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                          {rel.summary}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1 group-hover:text-[var(--accent-gold)] pt-1">
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
