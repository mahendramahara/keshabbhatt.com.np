import React from "react";
import { FileSpreadsheet, CheckCircle2, Target, Compass, Lightbulb } from "lucide-react";
import type { WorkResearchItem } from "@keshab-bhatt/types";

interface WorkResearchSectionProps {
  title?: string;
  subtitle?: string;
  items: WorkResearchItem[];
}

export function WorkResearchSection({
  title = "Selected Work & Research",
  subtitle = "Empirical case studies, market analysis, and corporate advisory deliverables",
  items,
}: WorkResearchSectionProps) {
  return (
    <section id="work-research" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Empirical Advisory Deliverables</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-[family-name:var(--font-sans)] tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {items.map((work, index) => {
            const formattedIndex = work.id < 10 ? `0${work.id}` : `${work.id}`;

            return (
              <div
                key={work.id}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:border-[var(--accent-gold)]/40 hover:shadow-md transition-all space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[var(--bg-card-inner)] text-[var(--accent-gold)] font-bold text-xs font-mono flex items-center justify-center border border-[var(--border-subtle)] shrink-0">
                      {formattedIndex}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--bg-card-inner)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)] truncate">
                      {work.context}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-[19px] font-bold text-[var(--text-main)] leading-snug font-[family-name:var(--font-sans)]">
                    {work.title}
                  </h3>

                  <div className="space-y-3 pt-2 text-xs sm:text-[12.5px]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                        <Target className="w-3.5 h-3.5 shrink-0" />
                        <span>Objective</span>
                      </div>
                      <p className="text-[var(--text-sub)] leading-relaxed pl-5">
                        {work.objective}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                        <Compass className="w-3.5 h-3.5 shrink-0" />
                        <span>Approach</span>
                      </div>
                      <p className="text-[var(--text-sub)] leading-relaxed pl-5">
                        {work.approach}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                        <span>Findings</span>
                      </div>
                      <p className="text-[var(--text-sub)] leading-relaxed pl-5">
                        {work.findings}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Delivered</span>
                  </div>
                  <p className="text-xs sm:text-[12.5px] text-[var(--text-main)] font-medium leading-relaxed">
                    {work.outcome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WorkResearchSection;
