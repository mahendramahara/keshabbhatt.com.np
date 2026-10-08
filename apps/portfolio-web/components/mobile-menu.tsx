"use client";

import React, { useState } from "react";
import { Menu, X, Download } from "lucide-react";
import type { NavigationItem } from "@keshab-bhatt/types";

interface MobileMenuProps {
  navItems: NavigationItem[];
  downloadCvText: string;
  cvUrl: string;
}

export function MobileMenu({ navItems, downloadCvText, cvUrl }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 right-0 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-6 space-y-4 shadow-2xl z-50">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-semibold text-[var(--text-sub)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-surface)] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <a
              href={cvUrl}
              download="keshabbhatt.com.np.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-[var(--text-inverted)] font-semibold text-xs shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadCvText}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
