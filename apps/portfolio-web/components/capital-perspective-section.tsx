import React from "react";
import Image from "next/image";
import { BarChart3, Settings } from "lucide-react";
import type { CapitalMarketPerspectiveData, AnalyticalFrameworkData } from "@keshab-bhatt/types";

interface CapitalPerspectiveSectionProps {
  perspective: CapitalMarketPerspectiveData;
  framework: AnalyticalFrameworkData;
}

export function CapitalPerspectiveSection({ perspective, framework }: CapitalPerspectiveSectionProps) {
  return (
    <section id="perspective" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-6 relative overflow-hidden rounded-2xl bg-[#081226] text-white p-6 sm:p-7 border border-[#1e2f57] shadow-md flex flex-col justify-between">
            <Image
              src="/images/hero-bg.png"
              alt="Capital markets backdrop"
              fill
              loading="lazy"
              sizes="600px"
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#081226]/90 via-[#081226]/85 to-[#081226]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081226]/90 via-transparent to-[#081226]/50" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-[var(--accent-hero)]" />
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {perspective.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/15 gap-4 pt-1 text-xs text-[#cbd5e1]">
                <div className="pr-0 sm:pr-3">
                  <ul className="space-y-2.5">
                    {perspective.columns[0]?.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-[12px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hero)] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 sm:pt-0 sm:pl-3">
                  <ul className="space-y-2.5">
                    {perspective.columns[1]?.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-[12px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-hero)] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)]">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] tracking-tight">
                {framework.title}
              </h2>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 py-3">
              {framework.steps.map((st) => (
                <div key={st.step} className="flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] font-bold text-xs flex items-center justify-center mb-1.5 shadow-xs border border-[var(--accent-gold-border)]">
                    {st.step}
                  </div>
                  <span className="text-[10.5px] font-semibold text-[var(--text-main)] leading-tight">
                    {st.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3.5 border-t border-[var(--border-subtle)] space-y-2 text-xs">
              <div className="text-[11.5px] font-bold text-[var(--text-main)] uppercase tracking-wider">
                Applied to:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--text-sub)]">
                <ul className="space-y-1.5">
                  {framework.appliedToLeft.map((app, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11.5px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1.5">
                  {framework.appliedToRight.map((app, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11.5px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
