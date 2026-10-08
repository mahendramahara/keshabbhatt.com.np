import React from "react";
import {
  GraduationCap,
  Search,
  Award,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import type { EducationItem } from "@keshab-bhatt/types";

interface ResearchEducationSectionProps {
  researchTitle: string;
  researchItems: string[];
  educationTitle: string;
  educationItems: EducationItem[];
  certificationsTitle: string;
  certificationItems: string[];
}

export function ResearchEducationSection({
  researchTitle,
  researchItems,
  educationTitle,
  educationItems,
  certificationsTitle,
  certificationItems,
}: ResearchEducationSectionProps) {
  const displayCertTitle = certificationsTitle
    .replace(" & Professional Development", " & Training")
    .replace(" तथा व्यावसायिक विकास", " तथा तालिम");

  return (
    <section id="education" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
            <BookOpen className="w-4 h-4" />
            <span>Academic & Professional Foundation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] font-[family-name:var(--font-sans)] tracking-tight">
            {educationTitle} & {researchTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-3xl leading-relaxed">
            Rigorous university degrees, empirical research interests, and continuous executive certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:border-[var(--accent-gold)]/40 transition-all space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] min-h-[58px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-[var(--bg-card-inner)] text-[var(--accent-gold)] border border-[var(--border-subtle)] shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] leading-tight truncate">
                    {educationTitle}
                  </h3>
                  <p className="text-[11.5px] text-[var(--text-muted)] mt-0.5 font-medium truncate">
                    University & Secondary Schooling
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[var(--accent-gold)] bg-[var(--bg-card-inner)] px-2.5 py-0.5 rounded border border-[var(--border-subtle)] shrink-0">
                {educationItems.length} Milestones
              </span>
            </div>

            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[var(--accent-gold)] before:via-[var(--accent-gold)]/60 before:to-[var(--accent-gold)]/30 flex-1 flex flex-col justify-between">
              {educationItems.map((edu, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-[var(--accent-gold)] bg-[var(--bg-card)] flex items-center justify-center shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
                  </span>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-gold)]/40 transition-colors space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[13px] sm:text-[13.5px] font-bold text-[var(--text-main)] leading-snug">
                        {edu.degree}
                      </h4>
                    </div>

                    <p className="text-xs font-semibold text-[var(--accent-gold)]">
                      {edu.institution}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--accent-gold)]/40 text-[var(--accent-gold)]">
                        [{edu.period}]
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-sub)]">
                        [{edu.field}]
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div id="research-interests" className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:border-[var(--accent-gold)]/40 transition-all space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] min-h-[58px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-[var(--bg-card-inner)] text-[var(--accent-gold)] border border-[var(--border-subtle)] shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] leading-tight truncate">
                    {researchTitle}
                  </h3>
                  <p className="text-[11.5px] text-[var(--text-muted)] mt-0.5 font-medium truncate">
                    Empirical & Theoretical Inquiry
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[var(--accent-gold)] bg-[var(--bg-card-inner)] px-2.5 py-0.5 rounded border border-[var(--border-subtle)] shrink-0">
                {researchItems.length} Focus Areas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-sub)] flex-1">
              {researchItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-card-inner)]/50 border border-[var(--border-subtle)]/70 hover:border-[var(--accent-gold)]/40 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                  <span className="text-[11.5px] font-medium text-[var(--text-main)] truncate" title={item}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>

          <div id="certifications" className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:border-[var(--accent-gold)]/40 transition-all space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] min-h-[58px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-[var(--bg-card-inner)] text-[var(--accent-gold)] border border-[var(--border-subtle)] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] leading-tight truncate" title={displayCertTitle}>
                    {displayCertTitle}
                  </h3>
                  <p className="text-[11.5px] text-[var(--text-muted)] mt-0.5 font-medium truncate">
                    Executive Programs & Accreditations
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[var(--accent-gold)] bg-[var(--bg-card-inner)] px-2.5 py-0.5 rounded border border-[var(--border-subtle)] shrink-0">
                {certificationItems.length} Programs
              </span>
            </div>

            <div className="space-y-2 flex-1">
              {certificationItems.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-[var(--bg-card-inner)]/50 border border-[var(--border-subtle)]/70 hover:border-[var(--accent-gold)]/40 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                  <span className="text-[11.5px] text-[var(--text-sub)] leading-snug">
                    {cert}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ResearchEducationSection;
