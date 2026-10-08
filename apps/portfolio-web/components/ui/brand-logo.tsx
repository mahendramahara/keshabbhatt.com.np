import React from "react";
import Link from "next/link";
import type { Locale } from "@keshab-bhatt/types";

interface BrandLogoProps {
  locale: Locale;
  showSubtitle?: boolean;
  className?: string;
}

export function BrandLogo({ locale, showSubtitle = true, className = "" }: BrandLogoProps) {
  const isNe = locale === "ne";

  return (
    <Link href={`/${locale}`} className={`flex items-center gap-3.5 group ${className}`}>
      <div className="w-11 h-11 rounded-lg border border-[var(--accent-gold-border)] bg-[var(--bg-surface)] flex items-center justify-center font-serif text-xl font-bold tracking-tight text-[var(--accent-gold)] shadow-sm group-hover:border-[var(--accent-gold)] transition-colors">
        KB
      </div>
      <div className="flex flex-col">
        <span className="text-base font-semibold tracking-wide text-[var(--text-main)] group-hover:text-[var(--accent-gold)] transition-colors">
          {isNe ? "केशव दत्त भट्ट" : "KESHAB DATT BHATT"}
        </span>
        {showSubtitle && (
          <span className="text-xs font-medium tracking-wider text-[var(--text-muted)] uppercase">
            {isNe ? "वित्त | रणनीति | नेतृत्व" : "Finance | Strategy | Leadership"}
          </span>
        )}
      </div>
    </Link>
  );
}
