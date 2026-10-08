import React from "react";
import Image from "next/image";
import { UserCheck, Target, ArrowRight, BarChart2, User } from "lucide-react";
import type { ExecutiveProfileData, ValuePropositionData } from "@keshab-bhatt/types";

interface ExecutiveProfileSectionProps {
  profile: ExecutiveProfileData;
  proposition: ValuePropositionData;
}

export function ExecutiveProfileSection({ profile, proposition }: ExecutiveProfileSectionProps) {
  return (
    <section id="about" className="py-7 sm:py-9 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)] shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
                  {profile.title}
                </h2>
              </div>
              <p className="text-xs sm:text-[13.5px] leading-relaxed text-[var(--text-sub)]">
                {profile.body}
              </p>
            </div>

            <div className="pt-6">
              <a
                href={profile.readMoreUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent-gold-border)] transition-all shadow-xs"
              >
                <span>{profile.readMoreText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--accent-blue-soft)] text-[var(--accent-blue-icon)] shadow-xs">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight">
                  {proposition.title}
                </h2>
              </div>
              <p className="text-xs sm:text-[13.5px] leading-relaxed text-[var(--text-sub)]">
                {proposition.body}
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-3.5">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--bg-card)] text-[11px] font-semibold text-[var(--text-main)] shadow-xs border border-[var(--border-card)]">
                  <Target className="w-3 h-3 text-[var(--accent-blue-icon)]" />
                  Strategy
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--bg-card)] text-[11px] font-semibold text-[var(--text-main)] shadow-xs border border-[var(--border-card)]">
                  <BarChart2 className="w-3 h-3 text-[var(--accent-blue-icon)]" />
                  Analysis
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--bg-card)] text-[11px] font-semibold text-[var(--text-main)] shadow-xs border border-[var(--border-card)]">
                  <User className="w-3 h-3 text-[var(--accent-blue-icon)]" />
                  Leadership
                </span>
              </div>

              <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-[var(--accent-blue-icon)]">
                <span>{proposition.workflow[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-blue-icon)] opacity-70" />
                <span>{proposition.workflow[1]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-blue-icon)] opacity-70" />
                <span>{proposition.workflow[2]}</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-2xl bg-[#081226] text-white p-7 sm:p-8 shadow-md flex flex-col justify-between border border-[#1e2f57]">
            <Image
              src="/images/hero-bg.png"
              alt="Himalayan mountains"
              fill
              loading="lazy"
              sizes="450px"
              className="object-cover object-left"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#081226]/40 via-[#081226]/75 to-[#081226]/95" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081226]/80 via-transparent to-[#081226]/30" />

            <div className="relative z-10">
              <span className="block font-serif text-5xl leading-none text-[var(--accent-hero)]">&ldquo;</span>
              <blockquote className="mt-1 font-serif italic text-xl sm:text-[22px] leading-snug text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                {proposition.featuredQuote.text}
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 text-right">
              <span className="font-signature text-3xl sm:text-4xl text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {proposition.featuredQuote.author}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ExecutiveProfileSection;
