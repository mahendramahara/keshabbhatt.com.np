"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, Calendar, ArrowRight, Sparkles, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import type { ArticlePreviewItem, Locale } from "@keshab-bhatt/types";

interface ArticlesListViewProps {
  articles: ArticlePreviewItem[];
  locale?: Locale;
}

const ITEMS_PER_PAGE = 9;

export function ArticlesListView({ articles, locale = "en" }: ArticlesListViewProps) {
  const isNe = locale === "ne";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategory === "all" || art.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={isNe ? "शीर्षक वा विषय खोज्नुहोस्..." : "Search articles by title, topic, or keyword..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] shadow-xs transition-colors"
          />
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-[var(--accent-gold)] text-[#0a0f1d] shadow-xs"
                : "border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-sub)] hover:border-[var(--accent-gold)]"
            }`}
          >
            {isNe ? "सबै लेखहरू" : "All Articles"} ({articles.length})
          </button>

          {categories.map((cat) => {
            const count = articles.filter((a) => a.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[var(--accent-gold)] text-[#0a0f1d] shadow-xs"
                    : "border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-sub)] hover:border-[var(--accent-gold)]"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-3">
        <span>
          {isNe ? "देखाइएको:" : "Showing:"}{" "}
          <strong className="text-[var(--text-main)]">
            {filteredArticles.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)}
          </strong>{" "}
          {isNe ? "जम्मा" : "of"} <strong className="text-[var(--text-main)]">{filteredArticles.length}</strong> {isNe ? "लेखहरू" : "articles"}
        </span>

        {totalPages > 1 && (
          <span>
            {isNe ? "पृष्ठ" : "Page"} {safeCurrentPage} {isNe ? "मध्य" : "of"} {totalPages}
          </span>
        )}
      </div>

      {currentArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-3">
          <BookOpen className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
          <p className="text-sm font-semibold text-[var(--text-main)]">
            {isNe ? "कुनै लेख फेला परेन।" : "No articles found matching your criteria."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-xs font-semibold text-[var(--accent-gold)] hover:underline"
          >
            {isNe ? "फिल्टर रिसेट गर्नुहोस्" : "Reset filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {currentArticles.map((art, index) => {
            const articleUrl = art.slug
              ? `/${locale}/articles/${art.slug}`
              : `/${locale}/articles`;

            return (
              <article
                key={art.id || index}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] border-t-[3px] border-t-[var(--accent-gold)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold text-[var(--accent-gold)] bg-[var(--accent-gold-soft)] px-2.5 py-0.5 rounded-full border border-[var(--accent-gold-border)] truncate max-w-[200px]">
                      {art.category}
                    </span>
                    <span className="text-[var(--text-muted)] flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {art.readTime || "5 min read"}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[var(--text-main)] leading-snug line-clamp-2">
                    <Link
                      href={articleUrl}
                      className="hover:text-[var(--accent-gold)] transition-colors"
                    >
                      {art.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>

                  {art.keyArgument && (
                    <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{isNe ? "मुख्य निष्कर्ष" : "Core Insight"}</span>
                      </div>
                      <p className="text-[11.5px] text-[var(--text-sub)] leading-normal line-clamp-2">
                        {art.keyArgument}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>{art.date || "2026"}</span>
                  </span>

                  <Link
                    href={articleUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent-gold)] hover:underline"
                  >
                    <span>{art.actionText || (isNe ? "पूरा लेख पढ्नुहोस्" : "Read Full Article")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            aria-label="Previous page"
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-[var(--accent-gold)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{isNe ? "अघिल्लो" : "Previous"}</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                  safeCurrentPage === page
                    ? "bg-[var(--accent-gold)] text-[#0a0f1d] shadow-xs"
                    : "border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-sub)] hover:border-[var(--accent-gold)]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            aria-label="Next page"
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-[var(--accent-gold)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span className="hidden sm:inline">{isNe ? "पछिल्लो" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}

export default ArticlesListView;
