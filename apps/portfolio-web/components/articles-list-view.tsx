"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Filter,
  X,
  Layers,
  FolderOpen,
} from "lucide-react";
import type { ArticlePreviewItem, Locale } from "@keshab-bhatt/types";

interface ArticlesListViewProps {
  articles: ArticlePreviewItem[];
  locale?: Locale;
}

const ITEMS_PER_PAGE = 6;

export function ArticlesListView({ articles, locale = "en" }: ArticlesListViewProps) {
  const isNe = locale === "ne";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const listTopRef = useRef<HTMLDivElement>(null);

  // Extract unique categories and counts from the articles
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      if (a.category) {
        counts[a.category] = (counts[a.category] || 0) + 1;
      }
    });
    return counts;
  }, [articles]);

  const categoryList = useMemo(() => Object.keys(categoryStats), [categoryStats]);

  // Filter articles based on active category and search query
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

  // Compute pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // If the database has 0 published articles in this locale
  if (articles.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-4 max-w-xl mx-auto shadow-xs">
        <div className="w-14 h-14 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex items-center justify-center mx-auto shadow-xs">
          <BookOpen className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-[var(--text-main)]">
            {isNe ? "कुनै लेख प्रकाशित छैन" : "No Published Articles Available"}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            {isNe
              ? "यस भाषामा हाल कुनै लेख प्रकाशित गरिएको छैन। नयाँ लेखहरू प्रकाशित भएपछि यहाँ स्वतः उपलब्ध हुनेछन्।"
              : "No executive articles have been published in this language yet. New publications will appear here as soon as they are published."}
          </p>
        </div>
      </div>
    );
  }

  const isFiltered = selectedCategory !== "all" || searchQuery.trim().length > 0;

  return (
    <div ref={listTopRef} className="space-y-6 scroll-mt-24">
      {/* Mobile Category Quick Bar (Horizontal scroll on mobile devices) */}
      <div className="lg:hidden space-y-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={isNe ? "लेख वा विषय खोज्नुहोस्..." : "Search articles..."}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === "all"
                ? "bg-[var(--accent-gold)] text-[#0a0f1d] shadow-xs"
                : "border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-sub)] hover:border-[var(--accent-gold)]"
            }`}
          >
            {isNe ? "सबै लेखहरू" : "All Articles"} ({articles.length})
          </button>
          {categoryList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-[var(--accent-gold)] text-[#0a0f1d] shadow-xs"
                  : "border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-sub)] hover:border-[var(--accent-gold)]"
              }`}
            >
              {cat} ({categoryStats[cat]})
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: Categories & Filters Sidebar (col-span-4) */}
        <aside className="hidden lg:block lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Search Box */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              {isNe ? "खोज्नुहोस्" : "Search Insights"}
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={isNe ? "शीर्षक, विषय वा शब्द..." : "Title, topic, or keyword..."}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-inner)] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] shadow-xs transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Navigation Card */}
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                <Filter className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>{isNe ? "श्रेणीहरू" : "Categories"}</span>
              </div>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-[var(--accent-gold)] hover:underline"
                >
                  {isNe ? "रिसेट" : "Reset"}
                </button>
              )}
            </div>

            {/* Vertical Category Button List */}
            <div className="space-y-1.5">
              {/* All Articles Option */}
              <button
                type="button"
                onClick={() => handleCategorySelect("all")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  selectedCategory === "all"
                    ? "bg-[var(--accent-gold)] text-[#0a0f1d] shadow-xs"
                    : "text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isNe ? "सबै प्रकाशित लेखहरू" : "All Articles"}</span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                    selectedCategory === "all"
                      ? "bg-[#0a0f1d]/15 text-[#0a0f1d] font-bold"
                      : "bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                  }`}
                >
                  {articles.length}
                </span>
              </button>

              {/* Individual Category Buttons */}
              {categoryList.map((cat) => {
                const count = categoryStats[cat];
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left ${
                      isSelected
                        ? "bg-[var(--accent-gold)] text-[#0a0f1d] font-bold shadow-xs"
                        : "text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <FolderOpen className="w-4 h-4 shrink-0 opacity-75" />
                      <span className="truncate">{cat}</span>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-mono shrink-0 ${
                        isSelected
                          ? "bg-[#0a0f1d]/15 text-[#0a0f1d] font-bold"
                          : "bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Archive Insights Card */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card-inner)]/50 border border-[var(--border-subtle)] space-y-2.5 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5 text-[var(--accent-gold)] font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isNe ? "प्रकाशन सारांश" : "Archive Summary"}</span>
            </div>
            <p className="leading-relaxed">
              {isNe
                ? "यहाँ प्रस्तुत सम्पूर्ण लेख तथा अनुसन्धानहरू वास्तविक बैंकिङ, पुँजी बजार र वित्तीय विश्लेषणमा आधारित छन्।"
                : "All research papers and executive articles reflect practical banking governance, capital markets valuation, and corporate finance strategies."}
            </p>
          </div>
        </aside>

        {/* RIGHT COLUMN: Article Card Boxes Grid & Pagination (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Status & Metrics Bar */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[var(--text-main)]">
                {selectedCategory === "all" ? (isNe ? "सबै लेखहरू" : "All Categories") : selectedCategory}
              </span>
              <span>•</span>
              <span>
                {isNe ? "देखाइएको:" : "Showing:"}{" "}
                <strong className="text-[var(--text-main)]">
                  {filteredArticles.length === 0 ? 0 : startIndex + 1} -{" "}
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)}
                </strong>{" "}
                {isNe ? "जम्मा" : "of"}{" "}
                <strong className="text-[var(--text-main)]">{filteredArticles.length}</strong>{" "}
                {isNe ? "लेखहरू" : "articles"}
              </span>
            </div>

            {totalPages > 1 && (
              <span className="font-medium shrink-0">
                {isNe ? "पृष्ठ" : "Page"} {safeCurrentPage} {isNe ? "मध्य" : "of"} {totalPages}
              </span>
            )}
          </div>

          {/* Empty Search/Filter State */}
          {currentArticles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-3">
              <BookOpen className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[var(--text-main)]">
                {isNe ? "कुनै लेख फेला परेन।" : "No articles found matching your criteria."}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[var(--accent-gold)] hover:underline"
              >
                {isNe ? "सबै फिल्टर रिसेट गर्नुहोस्" : "Reset all filters"}
              </button>
            </div>
          ) : (
            /* Professional Article Boxes Card Grid (2 cards per row on tablets/desktop) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {currentArticles.map((art, index) => {
                const articleUrl = art.slug
                  ? (isNe ? `/ne/articles/${art.slug}` : `/articles/${art.slug}`)
                  : (isNe ? "/ne/articles" : "/articles");

                return (
                  <article
                    key={art.id || index}
                    className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md hover:border-[var(--accent-gold)]/40 transition-all duration-200 flex flex-col justify-between space-y-4 group"
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

                      <h2 className="text-base font-bold text-[var(--text-main)] leading-snug line-clamp-2 group-hover:text-[var(--accent-gold)] transition-colors">
                        <Link href={articleUrl} className="transition-colors">
                          {art.title}
                        </Link>
                      </h2>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>

                      {art.keyArgument && art.keyArgument.trim() !== art.summary.trim() && (
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
                        aria-label={`${art.actionText || (isNe ? "पूरा लेख पढ्नुहोस्" : "Read Full Article")}: ${art.title}`}
                      >
                        <span>{art.actionText || (isNe ? "पूरा लेख पढ्नुहोस्" : "Read Full Article")}</span>
                        <span className="sr-only">: {art.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Interactive Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[var(--text-muted)]">
                {isNe ? "पृष्ठ" : "Page"}{" "}
                <strong className="text-[var(--text-main)]">{safeCurrentPage}</strong>{" "}
                {isNe ? "मध्य" : "of"}{" "}
                <strong className="text-[var(--text-main)]">{totalPages}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Previous Page */}
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  aria-label="Previous page"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-[var(--accent-gold)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{isNe ? "अघिल्लो" : "Previous"}</span>
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`min-w-8 h-8 px-2 text-xs font-bold rounded-xl transition-all ${
                        safeCurrentPage === page
                          ? "bg-[var(--accent-gold)] text-[#0a0f1d] shadow-xs"
                          : "border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-sub)] hover:border-[var(--accent-gold)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Page */}
                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  aria-label="Next page"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-[var(--accent-gold)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span className="hidden sm:inline">{isNe ? "पछिल्लो" : "Next"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticlesListView;
