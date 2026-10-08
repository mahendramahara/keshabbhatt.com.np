"use client";

import React, { useRef } from "react";
import {
  Briefcase,
  Laptop,
  Cpu,
  GraduationCap,
  Building2,
  Landmark,
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  FoundationExperienceItem,
  InstitutionalExperienceItem,
  ProfessionalExperienceItem,
} from "@keshab-bhatt/types";

interface ProfessionalExperienceSectionProps {
  title?: string;
  subtitle?: string;
  foundationTitle?: string;
  foundationItems?: FoundationExperienceItem[];
  institutionalTitle?: string;
  institutionalItems?: InstitutionalExperienceItem[];
  items?: ProfessionalExperienceItem[];
}

export function ProfessionalExperienceSection({
  title = "Professional Experience",
  subtitle = "Practical execution across computer systems, institutional teaching, and financial sector advisory.",
  foundationItems = [],
  institutionalItems = [],
}: ProfessionalExperienceSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const getFoundationIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Laptop className="w-5 h-5 text-[var(--accent-gold)]" />;
      case 1:
        return <Cpu className="w-5 h-5 text-[var(--accent-gold)]" />;
      default:
        return <GraduationCap className="w-5 h-5 text-[var(--accent-gold)]" />;
    }
  };

  const getInstitutionalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Landmark className="w-3.5 h-3.5 text-[var(--accent-gold)]" />;
      case 1:
        return <Building2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" />;
      case 2:
        return <TrendingUp className="w-3.5 h-3.5 text-[var(--accent-gold)]" />;
      default:
        return <Briefcase className="w-3.5 h-3.5 text-[var(--accent-gold)]" />;
    }
  };

  return (
    <section id="experience" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-7">
        
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
            <Briefcase className="w-4 h-4" />
            <span>Career & Applied Track</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-[family-name:var(--font-sans)] tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {foundationItems.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md transition-shadow space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2 rounded-lg bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                    {getFoundationIcon(index)}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-[var(--accent-gold)] bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                    {item.duration}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-[17px] font-bold text-[var(--text-main)] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11.5px] text-[var(--text-muted)] mt-0.5 font-medium">
                    {item.category}
                  </p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-[var(--border-subtle)] space-y-2 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                  {item.gainedTitle || "Gained from this experience:"}
                </p>
                <ul className="space-y-2 text-xs sm:text-[12.5px] text-[var(--text-sub)]">
                  {item.gainedPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="relative pt-1">
          <div className="flex items-center justify-end gap-1.5 pb-2">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="p-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Scroll right"
              className="p-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-colors shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {institutionalItems.map((item, index) => (
              <div
                key={item.id}
                className="snap-start shrink-0 w-[270px] sm:w-[310px] p-3 sm:p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xs hover:border-[var(--accent-gold)]/40 transition-colors flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="p-1 rounded-md bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] shrink-0">
                      {getInstitutionalIcon(index)}
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--accent-gold)] truncate">
                      {item.organization}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-medium text-[var(--text-muted)] bg-[var(--bg-card-inner)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] shrink-0">
                    {item.period}
                  </span>
                </div>

                <div>
                  <h4 className="text-[12.5px] sm:text-[13px] font-bold text-[var(--text-main)] leading-tight truncate">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-start gap-1.5 text-[10.5px] text-[var(--text-sub)] leading-tight pt-1 border-t border-[var(--border-subtle)]">
                  <CheckCircle2 className="w-3 h-3 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    {item.gainedPoints[0]}
                  </span>
                </div>

                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.skills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-[var(--bg-card-inner)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                      >
                        {skill}
                      </span>
                    ))}
                    {item.skills.length > 3 && (
                      <span className="text-[9px] text-[var(--text-muted)] self-center">
                        +{item.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProfessionalExperienceSection;
