"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Download, Shield } from "lucide-react";
import type { NavigationItem } from "@keshab-bhatt/types";

interface MobileMenuProps {
  navItems: NavigationItem[];
  downloadCvText: string;
  cvUrl: string;
}

export function MobileMenu({ navItems, downloadCvText, cvUrl }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white/90 hover:border-[var(--accent-hero)] hover:bg-white/10 transition-colors"
        aria-label="Open mobile navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Professional Overlapping Z-Index Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Overlapping Panel */}
          <aside
            className="fixed top-0 bottom-0 right-0 z-[101] w-[86%] max-w-[340px] bg-gradient-to-b from-[#07183d] via-[#091f4c] to-[#040e24] border-l border-white/15 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right"
            aria-label="Mobile Navigation Drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--accent-hero)] bg-gradient-to-br from-[#0c1833] to-[#061025] shadow-xs">
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--accent-hero)]">
                    KB
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white leading-tight">Keshab Datt Bhatt</div>
                  <div className="text-[10px] text-[var(--accent-hero)] font-medium">Executive Portfolio</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              <div>
                <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Navigation
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-[var(--accent-hero)] transition-all"
                    >
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <a
                  href={cvUrl}
                  download="keshabbhatt.com.np.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold btn-executive-primary shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadCvText}</span>
                </a>

                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-medium border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[var(--accent-hero)]" />
                  <span>Admin Portal</span>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-[#040e24]/60 text-[11px] text-white/50 shrink-0">
              © {new Date().getFullYear()} Keshab Datt Bhatt. All rights reserved.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
