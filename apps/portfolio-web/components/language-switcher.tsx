"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import type { Locale } from "@keshab-bhatt/types";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname() || "/en";

  const getTargetUrl = (targetLocale: Locale) => {
    if (pathname.startsWith("/en")) {
      return pathname.replace(/^\/en/, `/${targetLocale}`);
    }
    if (pathname.startsWith("/ne")) {
      return pathname.replace(/^\/ne/, `/${targetLocale}`);
    }
    return `/${targetLocale}`;
  };

  return (
    <div className="flex items-center gap-1 border border-[var(--border-subtle)] rounded-lg p-0.5 bg-[var(--bg-surface)] text-xs font-medium">
      <Globe className="w-3.5 h-3.5 ml-2 text-[var(--accent-gold)]" />
      <Link
        href={getTargetUrl("en")}
        className={`px-2 py-1 rounded transition-colors ${
          currentLocale === "en"
            ? "bg-[var(--accent-gold)] text-[var(--text-inverted)] font-semibold shadow-sm"
            : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
        }`}
        aria-label="Switch to English"
      >
        EN
      </Link>
      <Link
        href={getTargetUrl("ne")}
        className={`px-2 py-1 rounded transition-colors ${
          currentLocale === "ne"
            ? "bg-[var(--accent-gold)] text-[var(--text-inverted)] font-semibold shadow-sm"
            : "text-[var(--text-sub)] hover:text-[var(--text-main)]"
        }`}
        aria-label="Switch to Nepali (नेपाली)"
      >
        नेपा
      </Link>
    </div>
  );
}
