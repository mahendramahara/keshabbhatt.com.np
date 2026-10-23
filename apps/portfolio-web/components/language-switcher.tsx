"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import type { Locale } from "@keshab-bhatt/types";
import { EnglishFlagIcon, NepalFlagIcon } from "./header";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname() || "/en";
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button with Flag and Code */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Change language"
        className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-xs font-semibold text-[var(--text-main)] shadow-xs transition-all hover:border-[var(--accent-gold)] focus:outline-none"
      >
        {currentLocale === "ne" ? (
          <>
            <NepalFlagIcon className="w-3.5 h-4" />
            <span>NE</span>
          </>
        ) : (
          <>
            <EnglishFlagIcon className="w-4 h-3" />
            <span>EN</span>
          </>
        )}
        <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-[var(--border-card)] bg-[var(--bg-surface)] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1">
            Language / भाषा
          </div>

          <Link
            href={getTargetUrl("en")}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-left transition-colors ${
              currentLocale === "en"
                ? "bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] font-bold"
                : "text-[var(--text-main)] hover:bg-[var(--bg-card-inner)]"
            }`}
          >
            <EnglishFlagIcon className="w-5 h-3.5 shadow-xs" />
            <div className="flex-1 leading-tight">
              <div className="text-[13px] font-semibold">English</div>
              <div className="text-[10px] text-[var(--text-muted)]">English (EN)</div>
            </div>
            {currentLocale === "en" && <Check className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />}
          </Link>

          <Link
            href={getTargetUrl("ne")}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-left transition-colors ${
              currentLocale === "ne"
                ? "bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] font-bold"
                : "text-[var(--text-main)] hover:bg-[var(--bg-card-inner)]"
            }`}
          >
            <NepalFlagIcon className="w-4 h-5 shadow-xs" />
            <div className="flex-1 leading-tight">
              <div className="text-[13px] font-semibold">नेपाली (Nepali)</div>
              <div className="text-[10px] text-[var(--text-muted)]">नेपाली भाषा (NE)</div>
            </div>
            {currentLocale === "ne" && <Check className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />}
          </Link>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
