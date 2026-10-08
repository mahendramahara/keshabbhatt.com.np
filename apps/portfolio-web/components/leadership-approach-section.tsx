import React from "react";
import Image from "next/image";
import { Users2 } from "lucide-react";
import type { LeadershipApproachData } from "@keshab-bhatt/types";
import { DynamicIcon } from "./dynamic-icon";

interface LeadershipApproachSectionProps {
  data: LeadershipApproachData;
}

export function LeadershipApproachSection({ data }: LeadershipApproachSectionProps) {
  return (
    <section id="leadership" className="py-6 sm:py-8 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-2xl bg-[#081226] text-white p-7 sm:p-9 border border-[#1e2f57] shadow-lg">
          <Image
            src="/images/hero-bg.png"
            alt="Mountain panorama"
            fill
            loading="lazy"
            sizes="1400px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081226]/50 via-[#081226]/85 to-[#081226]/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081226]/85 via-transparent to-[#081226]/40" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[var(--accent-gold-soft)] text-[var(--accent-hero)]">
                  <Users2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-[family-name:var(--font-sans)]">
                  {data.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-[#cbd5e1]">
                {data.summary}
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-xl border border-[#22355e] bg-[#0c1833]/80 backdrop-blur-xs overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#22355e]">
                  {data.traits.slice(0, 5).map((trait) => (
                    <div
                      key={trait.id}
                      className="flex flex-col items-center text-center p-3.5 hover:bg-white/5 transition-colors"
                    >
                      <div className="text-[var(--accent-hero)] mb-2">
                        <DynamicIcon name={trait.icon} className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] xl:text-[11.5px] font-semibold text-white leading-tight">
                        {trait.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px w-full bg-[#22355e]" />

                <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#22355e]">
                  {data.traits.slice(5, 10).map((trait) => (
                    <div
                      key={trait.id}
                      className="flex flex-col items-center text-center p-3.5 hover:bg-white/5 transition-colors"
                    >
                      <div className="text-[var(--accent-hero)] mb-2">
                        <DynamicIcon name={trait.icon} className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] xl:text-[11.5px] font-semibold text-white leading-tight">
                        {trait.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
