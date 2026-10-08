"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Edit3, ChevronLeft, ChevronRight, ArrowRight, Clock, Calendar, Sparkles } from "lucide-react";
import type { ArticlePreviewItem, Locale } from "@keshab-bhatt/types";

interface ArticlesSectionProps {
  title?: string;
  subtitle?: string;
  viewAllText?: string;
  items: ArticlePreviewItem[];
  locale?: Locale;
}

export function ArticlesSection({
  title = "Articles & Insights",
  subtitle = "Thought leadership, financial sector research, and strategic perspectives.",
  viewAllText = "See All Articles by Myself",
  items,
  locale = "en",
}: ArticlesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayItems = items.slice(0, 9);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="articles" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)] shadow-xs shrink-0 mt-0.5">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight font-[family-name:var(--font-sans)]">
                {title}
              </h2>
              <p className="text-xs sm:text-[13px] text-[var(--text-muted)] mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-semibold text-[var(--text-muted)] mr-2 hidden sm:inline-block">
              {displayItems.length} Featured Articles
            </span>
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="p-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="p-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          tabIndex={0}
          aria-label="Horizontal list of articles"
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 focus:outline-none"
          style={{ scrollbarWidth: "thin" }}
        >
          {displayItems.map((art, index) => {
            const articleUrl = art.slug
              ? `/${locale}/articles/${art.slug}`
              : `/${locale}/articles`;

            return (
              <div
                key={art.id || index}
                className="w-[320px] sm:w-[370px] shrink-0 snap-start p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] border-t-[3px] border-t-[var(--accent-gold)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
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

                  <h3 className="text-sm sm:text-[15px] font-bold text-[var(--text-main)] leading-snug line-clamp-2">
                    <Link
                      href={articleUrl}
                      className="hover:text-[var(--accent-gold)] transition-colors"
                    >
                      {art.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>

                  {art.keyArgument && (
                    <div className="p-3 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Core Insight</span>
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
                    <span>{art.actionText || (locale === "ne" ? "थप हेर्नुहोस्" : "See More")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            href={`/${locale}/articles`}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl btn-executive-primary font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default ArticlesSection;
