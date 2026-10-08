import React from "react";
import { Briefcase, FileSpreadsheet, Edit3, ArrowRight, Building2 } from "lucide-react";
import type {
  ProfessionalExperienceItem,
  WorkResearchItem,
  ArticlePreviewItem
} from "@keshab-bhatt/types";

interface ExperienceWorkArticlesSectionProps {
  experienceTitle: string;
  experienceItems: ProfessionalExperienceItem[];
  workTitle: string;
  workItems: WorkResearchItem[];
  articlesTitle: string;
  articleItems: ArticlePreviewItem[];
}

export function ExperienceWorkArticlesSection({
  experienceTitle,
  experienceItems,
  workTitle,
  workItems,
  articlesTitle,
  articleItems,
}: ExperienceWorkArticlesSectionProps) {
  return (
    <section id="experience" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)]">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] tracking-tight">
                {experienceTitle}
              </h2>
            </div>

            <div className="space-y-4 h-full flex flex-col justify-between">
              {experienceItems.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md transition-shadow h-full flex flex-col justify-between"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-subtle)] items-stretch h-full">
                    
                    <div className="sm:col-span-5 pr-0 sm:pr-4 pb-4 sm:pb-0 flex flex-col justify-center space-y-2.5">
                      <div className="p-2.5 w-fit rounded-xl bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)] shadow-2xs">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-[var(--text-main)] leading-snug">
                          {exp.organization}
                        </h3>
                        <p className="text-xs font-semibold text-[var(--accent-gold)] mt-0.5">
                          {exp.position}
                        </p>
                        <span className="inline-block text-[11px] text-[var(--text-muted)] mt-1.5 bg-[var(--bg-card-inner)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                          Period: {exp.period}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-7 pt-4 sm:pt-0 sm:pl-4 flex flex-col justify-center space-y-2">
                      <div className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-wider text-[var(--accent-gold)]">
                        Scope & Key Responsibilities
                      </div>
                      <ul className="space-y-1.5 text-xs text-[var(--text-sub)]">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] mt-1.5 shrink-0" />
                            <span className="text-[11.5px] leading-tight">{resp}</span>
                          </li>
                        ))}
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] mt-1.5 shrink-0" />
                          <span className="text-[11.5px] leading-tight">{exp.strategicImpact}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] mt-1.5 shrink-0" />
                          <span className="text-[11.5px] leading-tight">{exp.leadershipScope}</span>
                        </li>
                      </ul>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="work-research" className="space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] tracking-tight">
                {workTitle}
              </h2>
            </div>

            <div className="space-y-3 h-full flex flex-col justify-between">
              {workItems.map((work) => (
                <div
                  key={work.id}
                  className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md transition-shadow space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] font-bold text-[11px] flex items-center justify-center shrink-0 border border-[var(--accent-gold-border)]">
                      {work.id}
                    </div>
                    <h3 className="text-xs sm:text-[13px] font-bold text-[var(--text-main)]">
                      {work.title}
                    </h3>
                  </div>

                  <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                    {work.context} • {work.objective} • {work.approach} • {work.findings} • {work.outcome}
                  </p>

                  <div className="text-right">
                    <a
                      href={work.url}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-gold)] hover:underline"
                    >
                      <span>{work.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="articles" className="space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)]">
                <Edit3 className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] tracking-tight">
                {articlesTitle}
              </h2>
            </div>

            <div className="space-y-3 h-full flex flex-col justify-between">
              {articleItems.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md transition-shadow space-y-2 border-l-[3.5px] border-l-[var(--accent-gold)]"
                >
                  <h3 className="text-xs sm:text-[13px] font-bold text-[var(--text-main)]">
                    {art.category}
                  </h3>

                  <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                    {art.title} • {art.summary} • {art.keyArgument} • {art.implications}
                  </p>

                  <div className="text-right">
                    <a
                      href={art.url}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-gold)] hover:underline"
                    >
                      <span>{art.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
