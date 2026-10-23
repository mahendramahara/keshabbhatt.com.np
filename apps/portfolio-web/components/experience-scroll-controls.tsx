"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ExperienceScrollControlsProps {
  containerId: string;
}

export function ExperienceScrollControls({ containerId }: ExperienceScrollControlsProps) {
  const scroll = (direction: "left" | "right") => {
    const el = document.getElementById(containerId);
    if (el) {
      const scrollAmount = direction === "left" ? -320 : 320;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5 pb-2">
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="p-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-colors shadow-2xs cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="p-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-colors shadow-2xs cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default ExperienceScrollControls;
