"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArticlesScrollControlsProps {
  containerId: string;
  totalCount: number;
}

export function ArticlesScrollControls({
  containerId,
  totalCount,
}: ArticlesScrollControlsProps) {
  const scroll = (direction: "left" | "right") => {
    const el = document.getElementById(containerId);
    if (el) {
      const scrollAmount = direction === "left" ? -380 : 380;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center gap-2 self-end sm:self-auto">
      <span className="text-xs font-semibold text-[var(--text-muted)] mr-2 hidden sm:inline-block">
        {totalCount} Featured Articles
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
  );
}

export default ArticlesScrollControls;
