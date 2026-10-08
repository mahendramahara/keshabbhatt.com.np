import React from "react";
import type { FooterData, Locale } from "@keshab-bhatt/types";

interface FooterProps {
  data: FooterData;
  locale: Locale;
}

export function Footer({ data, locale }: FooterProps) {
  const isNe = locale === "ne";

  return (
    <footer className="w-full bg-[#071022] text-[#94a3b8] py-10 border-t border-[#162444]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border border-[var(--accent-hero)] bg-gradient-to-br from-[#0c1833] to-[#061025] flex items-center justify-center font-[family-name:var(--font-display)] text-base font-bold text-[var(--accent-hero)] shadow-xs">
              KB
            </div>
            <div>
              <div className="text-sm font-bold font-[family-name:var(--font-display)] uppercase tracking-wider text-white">
                {isNe ? "केशव दत्त भट्ट" : "Keshab Datt Bhatt"}
              </div>
              <div className="text-[10px] text-[#cbd5e1] font-medium tracking-wider flex items-center gap-1.5 mt-0.5">
                {isNe ? (
                  <>वित्त <span className="text-[var(--accent-hero)] font-bold">|</span> रणनीति <span className="text-[var(--accent-hero)] font-bold">|</span> नेतृत्व</>
                ) : (
                  <>Finance <span className="text-[var(--accent-hero)] font-bold">|</span> Strategy <span className="text-[var(--accent-hero)] font-bold">|</span> Leadership</>
                )}
              </div>
            </div>
          </div>

          <p className="font-serif italic text-xs sm:text-[13px] text-[#cbd5e1] text-center max-w-md">
            &ldquo;{data.quote}&rdquo;
          </p>

          <div className="flex flex-col items-center md:items-end gap-1.5 text-xs text-[#cbd5e1]">
            <div className="flex items-center gap-2.5 font-medium">
              <a href="#home" className="hover:text-[var(--accent-hero)] transition-colors">
                {isNe ? "गृहपृष्ठ" : "Home"}
              </a>
              <span className="text-[var(--accent-hero)] font-bold">|</span>
              <a href="#about" className="hover:text-[var(--accent-hero)] transition-colors">
                {isNe ? "परिचय" : "About"}
              </a>
              <span className="text-[var(--accent-hero)] font-bold">|</span>
              <a href="#contact" className="hover:text-[var(--accent-hero)] transition-colors">
                {isNe ? "सम्पर्क" : "Contact"}
              </a>
            </div>
            <div className="text-[11px] text-[#64748b]">
              &copy; {data.copyright}
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
