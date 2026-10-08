import React from "react";
import { Settings, ShieldCheck } from "lucide-react";
import type { ExpertiseItem, PhilosophyItem } from "@keshab-bhatt/types";
import { DynamicIcon } from "./dynamic-icon";

interface ExpertiseSectionProps {
  expertiseTitle: string;
  expertiseItems: ExpertiseItem[];
  philosophyTitle: string;
  philosophyItems: PhilosophyItem[];
}

export function ExpertiseSection({
  expertiseTitle,
  expertiseItems,
  philosophyTitle,
  philosophyItems,
}: ExpertiseSectionProps) {
  return (
    <section id="expertise" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)] shadow-xs">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
                {expertiseTitle}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch h-full">
              {expertiseItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-center text-center p-3.5 sm:p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md hover:border-[var(--accent-gold-border)] transition-all min-h-[125px]"
                >
                  <div className="p-2.5 rounded-lg bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)] mb-2.5 shadow-2xs">
                    <DynamicIcon name={item.icon} className="w-5 h-5 text-[var(--accent-blue-icon)]" />
                  </div>
                  <h3 className="text-[12px] sm:text-[12.5px] font-semibold text-[var(--text-main)] leading-snug">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)] shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
                {philosophyTitle}
              </h2>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-2.5 h-full flex flex-col justify-between">
              {philosophyItems.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs border border-[var(--accent-gold-border)]">
                    {p.id}
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-[var(--text-sub)] leading-tight">
                    {p.text}
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

export default ExpertiseSection;
