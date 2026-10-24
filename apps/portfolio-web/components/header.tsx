"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

  // Lock body scrolling when mobile side menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isHomepage = pathname === "/" || pathname === "/ne" || pathname === "/en";
  const getLinkHref = (hashHref: string) => {
    if (isHomepage) return hashHref;
    return language === "ne" ? `/ne${hashHref}` : `/${hashHref}`;
  };

  const CurrentThemeIcon = mode === "dark" ? MoonIcon : mode === "light" ? SunIcon : MonitorIcon;

  const chooseLanguage = (code: string) => {
    setLangOpen(false);
    onLanguageChange?.(code);
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    let targetPath = pathname;
    if (code === "ne") {
      if (!targetPath.startsWith("/ne")) {
        const clean = targetPath.replace(/^\/en/, "");
        targetPath = clean === "" || clean === "/" ? "/ne" : `/ne${clean}`;
      }
    } else {
      targetPath = targetPath.replace(/^\/ne/, "") || "/";
    }

    router.push(targetPath + hash);
  };

  return (
    <>
      <header className="sticky top-0 z-50 transition-colors duration-200 header-theme">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Name */}
          <a href={getLinkHref("#home")} className="group flex min-w-0 items-center gap-2.5 sm:gap-3 shrink-0" aria-label="Keshab Datt Bhatt – Home">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105 header-logo-box">
              <span className="font-[family-name:var(--font-display)] text-base sm:text-lg font-bold tracking-tight">
                KB
              </span>
            </div>
            <div className="leading-tight min-w-0">
              <p className="font-[family-name:var(--font-display)] text-[14px] sm:text-[16px] font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase transition-colors header-brand-title truncate">
                {language === "ne" ? "केशव दत्त भट्ट" : "Keshab Datt Bhatt"}
              </p>
              <p className="text-[10px] sm:text-[11px] font-medium tracking-wider header-brand-sub truncate">
                {language === "ne" ? (
                  <>वित्त <span className="mx-1.5 font-bold header-brand-pipe">|</span> रणनीति <span className="mx-1.5 font-bold header-brand-pipe">|</span> नेतृत्व</>
                ) : (
                  <>Finance <span className="mx-1.5 font-bold header-brand-pipe">|</span> Strategy <span className="mx-1.5 font-bold header-brand-pipe">|</span> Leadership</>
                )}
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-5 lg:flex xl:gap-8" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={getLinkHref(link.href)}
                  onClick={() => setActive(link.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-[26px] text-[13px] xl:text-[13.5px] font-medium transition-colors ${
                    isActive ? "header-nav-active" : "header-nav-link"
                  }`}
                >
                  {language === "ne" ? link.labelNe : link.label}
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-[14px] h-[2px] rounded-full header-nav-indicator" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Dropdown - Hidden on mobile screens, visible on desktop */}
            <div className="relative hidden lg:block" ref={themeRef}>
              <button
                type="button"
                onClick={() => setThemeOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={themeOpen}
                aria-label="Change theme and color palette"
                className="flex h-9 items-center gap-1.5 rounded-full px-2.5 transition-colors header-util-btn"
              >
                <CurrentThemeIcon className="h-[17px] w-[17px]" />
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0 shadow-xs"
                  style={{
                    backgroundColor:
                      activePalette === "slate-corporate"
                        ? "#38bdf8"
                        : activePalette === "emerald-wealth"
                        ? "#34d399"
                        : "#f2c46d",
                  }}
                />
                <ChevronIcon className={`h-3 w-3 transition-transform header-util-chevron ${themeOpen ? "rotate-180" : ""}`} />
              </button>

              {themeOpen && (
                <Menu align="right" className="w-56 p-2 space-y-2">
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider header-menu-header">
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
                          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition-colors ${
                            mode === value ? "header-menu-item-active" : "header-menu-item"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1">{language === "ne" ? labelNe : label}</span>
                          {mode === value && (
                            <CheckIcon className="h-3.5 w-3.5 header-brand-pipe" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px w-full header-menu-divider" />

                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider header-menu-header">
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
                          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition-colors ${
                            activePalette === id ? "header-menu-item-active" : "header-menu-item"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/30 shadow-xs shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="flex-1">{language === "ne" ? labelNe : label}</span>
                          {activePalette === id && (
                            <CheckIcon className="h-3.5 w-3.5 header-brand-pipe" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </Menu>
              )}
            </div>

            {/* Language Switcher - Hidden on mobile screens, visible on desktop */}
            <div className="relative hidden lg:block" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                aria-label="Change language"
                className="flex h-9 items-center gap-1.5 rounded-full px-2.5 transition-all select-none header-util-btn"
              >
                {language === "ne" ? (
                  <>
                    <NepalFlagIcon className="w-3.5 h-4" />
                    <span className="font-bold text-[12px] tracking-wide header-util-text">NE</span>
                  </>
                ) : (
                  <>
                    <EnglishFlagIcon className="w-4 h-3" />
                    <span className="font-bold text-[12px] tracking-wide header-util-text">EN</span>
                  </>
                )}
                <ChevronIcon className={`h-3 w-3 transition-transform header-util-chevron ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <Menu align="right" className="w-56 p-1.5 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-b mb-1 header-menu-header">
                    Language / भाषा
                  </div>

                  {/* English Option */}
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={language === "en"}
                    onClick={() => chooseLanguage("en")}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                      language === "en" ? "header-menu-item-active" : "header-menu-item"
                    }`}
                  >
                    <EnglishFlagIcon className="w-5 h-3.5 shadow-xs" />
                    <div className="flex-1 leading-tight">
                      <div className="text-[13px] font-semibold header-brand-title">English</div>
                      <div className="text-[10px] header-menu-subtext">English (EN)</div>
                    </div>
                    {language === "en" && (
                      <CheckIcon className="h-4 w-4 shrink-0 header-brand-pipe" />
                    )}
                  </button>

                  {/* Nepali Option */}
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={language === "ne"}
                    onClick={() => chooseLanguage("ne")}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                      language === "ne" ? "header-menu-item-active" : "header-menu-item"
                    }`}
                  >
                    <NepalFlagIcon className="w-4 h-5 shadow-xs" />
                    <div className="flex-1 leading-tight">
                      <div className="text-[13px] font-semibold header-brand-title">नेपाली (Nepali)</div>
                      <div className="text-[10px] header-menu-subtext">नेपाली भाषा (NE)</div>
                    </div>
                    {language === "ne" && (
                      <CheckIcon className="h-4 w-4 shrink-0 header-brand-pipe" />
                    )}
                  </button>
                </Menu>
              )}
            </div>

            {/* Desktop CV Download - Hidden on mobile, visible on desktop */}
            <a
              href={cvUrl}
              download="keshabbhatt.com.np.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download CV"
              className="hidden items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold btn-executive-primary lg:inline-flex"
            >
              <DownloadIcon className="h-4 w-4" />
              <span className="inline">
                {downloadCvText || (language === "ne" ? "सिभी डाउनलोड" : "Download CV")}
              </span>
            </a>

            {/* Mobile Menu Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors lg:hidden header-util-btn"
            >
              <BurgerIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* PROFESSIONAL OVERLAPPING MOBILE SIDE DRAWER (Z-INDEX 100+)               */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Fullscreen Backdrop Dimmer */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Overlapping Slide-in Panel */}
          <aside
            className="fixed top-0 bottom-0 right-0 z-[101] w-[86%] max-w-[360px] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right header-drawer-panel"
            aria-label="Mobile Navigation Drawer"
          >
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0 header-drawer-top">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg shadow-xs header-logo-box">
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold">
                    KB
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight header-brand-title">
                    {language === "ne" ? "केशव दत्त भट्ट" : "Keshab Datt Bhatt"}
                  </div>
                  <div className="text-[10px] font-medium header-brand-pipe">
                    {language === "ne" ? "कार्यकारी पोर्टल" : "Executive Portfolio"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors header-drawer-close"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {/* Navigation Links */}
              <div>
                <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider header-menu-header">
                  {language === "ne" ? "पृष्ठ मेनु" : "Navigation"}
                </div>
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => {
                    const isActive = active === link.id;
                    return (
                      <li key={link.id}>
                        <a
                          href={getLinkHref(link.href)}
                          onClick={() => {
                            setActive(link.id);
                            setMobileOpen(false);
                          }}
                          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                            isActive ? "header-drawer-link-active" : "header-drawer-link"
                          }`}
                        >
                          <span>{language === "ne" ? link.labelNe : link.label}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Language Selection Section with Flags */}
              <div className="p-3.5 rounded-xl space-y-2.5 header-drawer-box">
                <div className="text-[10.5px] font-bold uppercase tracking-wider header-menu-header">
                  {language === "ne" ? "भाषा छान्नुहोस् (Language)" : "Language"}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      chooseLanguage("en");
                      setMobileOpen(false);
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      language === "en" ? "header-drawer-btn-active" : "header-drawer-btn"
                    }`}
                  >
                    <EnglishFlagIcon className="w-4 h-3 shrink-0" />
                    <span>English (EN)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      chooseLanguage("ne");
                      setMobileOpen(false);
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      language === "ne" ? "header-drawer-btn-active" : "header-drawer-btn"
                    }`}
                  >
                    <NepalFlagIcon className="w-3.5 h-4 shrink-0" />
                    <span>नेपाली (NE)</span>
                  </button>
                </div>
              </div>

              {/* Appearance & Color Accent Options */}
              <div className="p-3.5 rounded-xl space-y-3.5 header-drawer-box">
                {/* Appearance Mode */}
                <div className="space-y-1.5">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider header-menu-header">
                    {language === "ne" ? "स्वरूप (मोड)" : "Appearance"}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {MODES.map(({ value, label, labelNe, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setMode(value)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${
                          mode === value ? "header-drawer-btn-active" : "header-drawer-btn"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{language === "ne" ? labelNe : label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Accent */}
                <div className="space-y-1.5 pt-2.5 border-t header-menu-divider">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider header-menu-header">
                    {language === "ne" ? "रङ विषयवस्तु (Accent)" : "Color Accent"}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PALETTES.map(({ id, label, labelNe, color }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActivePalette(id)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          activePalette === id ? "header-drawer-btn-active" : "header-drawer-btn"
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs border border-black/20" style={{ backgroundColor: color }} />
                        <span className="truncate">{language === "ne" ? labelNe.split(" ")[0] : label.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t header-menu-divider">
                <a
                  href={cvUrl}
                  download="keshabbhatt.com.np.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold btn-executive-primary shadow-md"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>{downloadCvText || (language === "ne" ? "सिभी डाउनलोड गर्नुहोस्" : "Download CV")}</span>
                </a>

                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-colors header-drawer-btn"
                >
                  <ShieldIcon className="h-3.5 w-3.5 header-brand-pipe" />
                  <span>Admin Portal</span>
                </Link>
              </div>
            </div>

            {/* Drawer Bottom Footer */}
            <div className="p-4 text-[11px] flex flex-col gap-1 shrink-0 header-drawer-footer">
              <div>Kathmandu, Nepal • contact@keshabbhatt.com.np</div>
              <div className="text-[10px] opacity-70">© {new Date().getFullYear()} Keshab Datt Bhatt</div>
            </div>
          </aside>
        </div>
      )}
    </>
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
      className={`absolute top-full z-50 mt-1 min-w-[11rem] rounded-xl p-1.5 shadow-2xl transition-colors header-menu-card ${
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

export function EnglishFlagIcon({ className = "w-4 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={`shrink-0 rounded-[2px] shadow-xs ${className}`}>
      <clipPath id="uk-flag-clip">
        <rect width="60" height="40" rx="2" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4.5" />
        <path d="M30,0 v40 M0,20 h60" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  );
}

export function NepalFlagIcon({ className = "w-3.5 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 30" className={`shrink-0 drop-shadow-xs ${className}`}>
      <polygon
        points="2,1 22,14 8,14 20,28 2,28"
        fill="#DC143C"
        stroke="#003893"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M5,8 A 3,3 0 0,0 10,8 A 3,2.5 0 0,1 6,6 Z"
        fill="#FFFFFF"
      />
      <circle cx="7.5" cy="7.5" r="1.1" fill="#FFFFFF" />
      <circle cx="7.5" cy="21" r="2.5" fill="#FFFFFF" />
      <path
        d="M7.5,17.5 L7.5,24.5 M4,21 L11,21 M5,18.5 L10,23.5 M5,23.5 L10,18.5"
        stroke="#FFFFFF"
        strokeWidth="0.8"
      />
    </svg>
  );
}

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
      <path d="M20 6 9 17l-5-5" />
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

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
