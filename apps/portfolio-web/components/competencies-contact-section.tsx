import React from "react";
import Image from "next/image";
import { Target, Mail, Phone, MapPin, ArrowRight, QrCode } from "lucide-react";
import type { KeyCompetencyCategory, ContactSectionData } from "@keshab-bhatt/types";
import { LinkedInIcon } from "./icons";

interface CompetenciesContactSectionProps {
  competenciesTitle: string;
  competencyCategories: KeyCompetencyCategory[];
  contact: ContactSectionData;
}

export function CompetenciesContactSection({
  competenciesTitle,
  competencyCategories,
  contact,
}: CompetenciesContactSectionProps) {
  const columns = React.useMemo(() => {
    if (competencyCategories.length === 9) {
      return [
        [competencyCategories[0], competencyCategories[3], competencyCategories[6]],
        [competencyCategories[1], competencyCategories[4], competencyCategories[7]],
        [competencyCategories[2], competencyCategories[5], competencyCategories[8]],
      ];
    }
    const perCol = Math.ceil(competencyCategories.length / 3);
    return [
      competencyCategories.slice(0, perCol),
      competencyCategories.slice(perCol, perCol * 2),
      competencyCategories.slice(perCol * 2),
    ];
  }, [competencyCategories]);

  return (
    <section id="contact" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div
            id="competencies"
            className="lg:col-span-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs p-6 sm:p-7 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
              <Target className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
              <h2 className="text-base sm:text-[17px] font-bold text-[var(--text-main)] tracking-tight">
                {competenciesTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-subtle)] flex-1">
              {columns.map((col, colIdx) => (
                <div
                  key={colIdx}
                  className={`flex flex-col justify-between space-y-4 sm:space-y-0 ${
                    colIdx === 0
                      ? "sm:pr-5"
                      : colIdx === 1
                      ? "sm:px-5"
                      : "sm:pl-5"
                  }`}
                >
                  {col.map((cat, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <h3 className="font-bold text-[var(--text-main)] text-[12px] sm:text-[13px] flex items-center gap-1.5">
                        <span className="text-[var(--accent-gold)] text-[9px] leading-none select-none">▸</span>
                        <span>{cat.category}</span>
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] leading-snug pl-3">
                        {cat.skills.map((skill, sIdx, arr) => (
                          <React.Fragment key={sIdx}>
                            <span>{skill}</span>
                            {sIdx < arr.length - 1 && (
                              <span className="mx-1 text-[var(--border-subtle)]">|</span>
                            )}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 relative overflow-hidden rounded-2xl bg-[#081226] text-white p-6 sm:p-7 border border-[#1e2f57] shadow-md flex flex-col justify-between min-h-[260px]">
            <Image
              src="/images/hero-bg.png"
              alt="Himalayan panorama"
              fill
              loading="lazy"
              sizes="400px"
              className="object-cover object-left opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081226] via-[#081226]/85 to-[#081226]/40" />

            <div className="relative z-10 space-y-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {contact.ctaTitle}
              </h3>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {contact.ctaDescription}
              </p>
            </div>

            <div className="relative z-10 pt-5">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-executive-primary font-bold text-xs shadow-sm hover:scale-[1.02] transition-transform"
              >
                <span>{contact.ctaButtonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 rounded-2xl bg-[var(--bg-card)] text-[var(--text-main)] p-5 sm:p-6 border border-[var(--border-card)] shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent-gold)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  {contact.cardTitle}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-[var(--text-sub)]">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 hover:text-[var(--accent-gold)] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                  <span className="truncate text-[11.5px]">{contact.email}</span>
                </a>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 hover:text-[var(--accent-gold)] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                  <span className="text-[11.5px]">{contact.phone}</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                  <span className="text-[11.5px]">{contact.location}</span>
                </div>
                <a
                  href={contact.linkedInUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--accent-gold)] transition-colors"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                  <span className="truncate text-[11.5px]">{contact.linkedInDisplay}</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 border-t border-[var(--border-subtle)]">
              <div className="w-13 h-13 bg-[var(--bg-card-inner)] rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-sm border border-[var(--border-subtle)]">
                <QrCode className="w-10 h-10 text-[var(--text-main)]" />
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                {contact.qrNotice}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CompetenciesContactSection;
