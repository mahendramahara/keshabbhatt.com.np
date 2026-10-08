"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Locale, ThemeMode, ThemePalette } from "@keshab-bhatt/types";
import { useTheme } from "./theme-provider";

interface NavLink {
  id: string;
  label: string;
  labelNe: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { id: "home", label: "Home", labelNe: "गृहपृष्ठ", href: "#home" },
  { id: "about", label: "About", labelNe: "परिचय", href: "#about" },
  { id: "expertise", label: "Expertise", labelNe: "विशेषज्ञता", href: "#expertise" },
  { id: "experience", label: "Experience", labelNe: "अनुभव", href: "#experience" },
  { id: "articles", label: "Articles", labelNe: "लेख", href: "#articles" },
  { id: "contact", label: "Contact", labelNe: "सम्पर्क", href: "#contact" },
];

const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "ne", label: "नेपाली", short: "ने" },
];

const MODES: Array<{
  value: ThemeMode;
  label: string;
  labelNe: string;
  Icon: React.FC<{ className?: string }>;
}> = [
  { value: "light", label: "Light", labelNe: "लाइट", Icon: SunIcon },
  { value: "dark", label: "Dark", labelNe: "डार्क", Icon: MoonIcon },
  { value: "system", label: "System", labelNe: "सिस्टम", Icon: MonitorIcon },
];

const PALETTES: Array<{
  id: ThemePalette;
  label: string;
  labelNe: string;
  color: string;
}> = [
  { id: "navy-gold", label: "Navy Gold", labelNe: "नेभी गोल्ड", color: "#f2c46d" },
  { id: "slate-corporate", label: "Slate Corporate", labelNe: "स्लेट कर्पोरेट", color: "#38bdf8" },
  { id: "emerald-wealth", label: "Emerald Wealth", labelNe: "इमराल्ड वेल्थ", color: "#34d399" },
];


function useScrollSpy(ids: string[]): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [active, setActive] = useState(ids[0] || "home");

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return [active, setActive];
}

interface HeaderProps {
  locale?: Locale;
  cvUrl?: string;
  onLanguageChange?: (code: string) => void;
  navItems?: unknown;
  downloadCvText?: string;
}

export function Header({
  locale = "en",
  cvUrl = "/cv/keshabbhatt.com.np.pdf",
  downloadCvText,
  onLanguageChange,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname() || "/en";

  const [mobileOpen, setMobileOpen] = useState(false);
  const language = locale;
  const { mode, theme: activePalette, setMode, setTheme: setActivePalette } = useTheme();

  const navIds = NAV_LINKS.map((l) => l.id);
  const [active, setActive] = useScrollSpy(navIds);

  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (themeRef.current && !themeRef.current.contains(target)) {
        setThemeOpen(false);
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setThemeOpen(false);
        setLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isHomepage = pathname === `/${language}` || pathname === `/${language}/` || pathname === "/";
  const getLinkHref = (hashHref: string) => (isHomepage ? hashHref : `/${language}${hashHref}`);

  const CurrentThemeIcon = mode === "dark" ? MoonIcon : mode === "light" ? SunIcon : MonitorIcon;

  const chooseLanguage = (code: string) => {
    setLangOpen(false);
    onLanguageChange?.(code);
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const targetPath = pathname.replace(/^\/(en|ne)/, `/${code}`);
    router.push(targetPath + hash);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[#061739] via-[#0a2150] to-[#0c2859] text-white shadow-lg shadow-[#061739]/30">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        <a href={getLinkHref("#home")} className="group flex shrink-0 items-center gap-3" aria-label="Keshab Datt Bhatt – Home">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--accent-hero)] bg-gradient-to-br from-[#0c1833] to-[#061025] shadow-sm">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--accent-hero)]">
              KB
            </span>
          </div>
          <div className="leading-tight">
            <p className="font-[family-name:var(--font-display)] text-[15px] font-bold tracking-[0.14em] uppercase text-white transition-colors group-hover:text-[var(--accent-hero)] sm:text-[16px]">
              {language === "ne" ? "केशव दत्त भट्ट" : "Keshab Datt Bhatt"}
            </p>
            <p className="text-[10.5px] font-medium tracking-wider text-white/70 sm:text-[11px]">
              {language === "ne" ? (
                <>वित्त <span className="mx-1.5 text-[var(--accent-hero)] font-bold">|</span> रणनीति <span className="mx-1.5 text-[var(--accent-hero)] font-bold">|</span> नेतृत्व</>
              ) : (
                <>Finance <span className="mx-1.5 text-[var(--accent-hero)] font-bold">|</span> Strategy <span className="mx-1.5 text-[var(--accent-hero)] font-bold">|</span> Leadership</>
              )}
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-8" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={getLinkHref(link.href)}
                onClick={() => setActive(link.id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-[26px] text-[13px] xl:text-[13.5px] font-medium transition-colors hover:text-[var(--accent-hero)] ${
                  isActive ? "text-[var(--accent-hero)]" : "text-white/90"
                }`}
              >
                {language === "ne" ? link.labelNe : link.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-[14px] h-[2px] rounded-full bg-[var(--accent-hero)]" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={themeRef}>
            <button
              type="button"
              onClick={() => setThemeOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={themeOpen}
              aria-label="Change theme and color palette"
              className="flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-2.5 text-white/90 transition-colors hover:border-[var(--accent-hero)] hover:text-[var(--accent-hero)]"
            >
              <CurrentThemeIcon className="h-[17px] w-[17px]" />
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0"
                style={{
                  backgroundColor:
                    activePalette === "slate-corporate"
                      ? "#38bdf8"
                      : activePalette === "emerald-wealth"
                      ? "#34d399"
                      : "#f2c46d",
                }}
              />
              <ChevronIcon className={`h-3 w-3 transition-transform ${themeOpen ? "rotate-180" : ""}`} />
            </button>

            {themeOpen && (
              <Menu align="right" className="w-56 p-2 space-y-2">
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    {language === "ne" ? "स्वरूप (मोड)" : "Appearance"}
                  </div>
                  <div className="space-y-0.5">
                    {MODES.map(({ value, label, labelNe, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={mode === value}
                        onClick={() => {
                          setMode(value);
                          setThemeOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition-colors hover:bg-white/10 ${
                          mode === value ? "text-[var(--accent-hero)] font-semibold" : "text-white/85"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1">{language === "ne" ? labelNe : label}</span>
                        {mode === value && <CheckIcon className="h-3.5 w-3.5 text-[var(--accent-hero)]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    {language === "ne" ? "रङ विषयवस्तु" : "Color Accent"}
                  </div>
                  <div className="space-y-0.5">
                    {PALETTES.map(({ id, label, labelNe, color }) => (
                      <button
                        key={id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={activePalette === id}
                        onClick={() => {
                          setActivePalette(id);
                          setThemeOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition-colors hover:bg-white/10 ${
                          activePalette === id ? "text-[var(--accent-hero)] font-semibold" : "text-white/85"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/30 shadow-xs shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="flex-1">{language === "ne" ? labelNe : label}</span>
                        {activePalette === id && <CheckIcon className="h-3.5 w-3.5 text-[var(--accent-hero)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </Menu>
            )}
          </div>

          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={langOpen}
              aria-label="Change language"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/90 transition-colors hover:border-[var(--accent-hero)] hover:text-[var(--accent-hero)]"
            >
              <GlobeIcon className="h-[18px] w-[18px]" />
            </button>
            {langOpen && (
              <Menu align="right" className="w-40">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={language === l.code}
                    onClick={() => chooseLanguage(l.code)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/10 hover:text-[var(--accent-hero)] ${
                      language === l.code ? "text-[var(--accent-hero)] font-semibold" : "text-white/90"
                    }`}
                  >
                    {l.label}
                    {language === l.code && <CheckIcon className="h-3.5 w-3.5 text-[var(--accent-hero)]" />}
                  </button>
                ))}
              </Menu>
            )}
          </div>

          <a
            href={cvUrl}
            download="keshabbhatt.com.np.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download CV"
            className="hidden items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold btn-executive-primary sm:inline-flex"
          >
            <DownloadIcon className="h-4 w-4" />
            <span className="inline">
              {downloadCvText || (language === "ne" ? "सिभी डाउनलोड" : "Download CV")}
            </span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 lg:hidden"
          >
            {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <BurgerIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/10 bg-[#071a45] px-4 pb-5 pt-3 lg:hidden" aria-label="Mobile">
          <ul className="grid gap-1 sm:grid-cols-2">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={getLinkHref(l.href)}
                  onClick={() => {
                    setActive(l.id);
                    setMobileOpen(false);
                  }}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10 ${
                    active === l.id ? "text-[var(--accent-hero)] font-semibold" : "text-white/90"
                  }`}
                >
                  {language === "ne" ? l.labelNe : l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span className="font-semibold">{language === "ne" ? "स्वरूप (मोड)" : "Appearance"}:</span>
              <div className="flex items-center gap-1.5">
                {MODES.map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border ${
                      mode === value
                        ? "border-[var(--accent-hero)] text-[var(--accent-hero)] bg-white/10 font-medium"
                        : "border-white/20 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/80">
              <span className="font-semibold">{language === "ne" ? "रङ विषयवस्तु" : "Accent"}:</span>
              <div className="flex items-center gap-1.5">
                {PALETTES.map(({ id, label, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActivePalette(id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${
                      activePalette === id
                        ? "border-[var(--accent-hero)] text-[var(--accent-hero)] bg-white/10 font-medium"
                        : "border-white/20 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span>{label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <a
            href={cvUrl}
            download="keshabbhatt.com.np.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold btn-executive-primary sm:hidden"
          >
            <DownloadIcon className="h-4 w-4" />
            {downloadCvText || (language === "ne" ? "सिभी डाउनलोड" : "Download CV")}
          </a>
        </nav>
      )}
    </header>
  );
}

function Menu({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      role="menu"
      className={`absolute top-full z-50 mt-1 min-w-[11rem] rounded-xl border border-white/10 bg-[#0a2150] p-1.5 shadow-xl shadow-black/40 ${
        align === "right" ? "right-0" : "left-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} strokeWidth={2.2} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} strokeWidth={2.4} className={className}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} strokeWidth={2.2} className={className}>
      <path d="M12 3v12m0 0-4.500-4.500M12 15l4.500-4.500M4 20h16" />
    </svg>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.600 2.500 4 5.600 4 9s-1.400 6.500-4 9c-2.600-2.500-4-5.600-4-9s1.400-6.500 4-9Z" />
    </svg>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M20 14.500A8 8 0 0 1 9.500 4 8 8 0 1 0 20 14.500Z" />
    </svg>
  );
}

function MonitorIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function BurgerIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export default Header;
