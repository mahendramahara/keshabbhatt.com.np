"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Palette, Check } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { ThemePalette } from "@keshab-bhatt/types";

interface PaletteOption {
  id: ThemePalette;
  label: string;
  color: string;
}

const palettes: PaletteOption[] = [
  { id: "navy-gold", label: "Navy Gold", color: "#f2c46d" },
  { id: "slate-corporate", label: "Slate Corporate", color: "#38bdf8" },
  { id: "emerald-wealth", label: "Emerald Wealth", color: "#34d399" },
];

export function ThemeSwitcher() {
  const { effectiveMode, theme, toggleMode, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-1.5" ref={menuRef}>
      <button
        onClick={toggleMode}
        type="button"
        aria-label="Toggle light or dark mode"
        className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-colors"
      >
        {effectiveMode === "dark" ? (
          <Sun className="w-4 h-4 text-[var(--accent-gold)]" />
        ) : (
          <Moon className="w-4 h-4 text-[var(--accent-gold)]" />
        )}
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          aria-label="Select color palette theme"
          className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--accent-gold)] transition-colors flex items-center gap-1"
        >
          <Palette className="w-4 h-4 text-[var(--accent-gold)]" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-2xl p-2 z-50">
            <div className="text-xs font-semibold px-2 py-1 text-[var(--text-muted)] uppercase tracking-wider">
              Color Palette
            </div>
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setTheme(p.id);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  theme === p.id
                    ? "bg-[var(--accent-gold-soft)] text-[var(--text-main)]"
                    : "text-[var(--text-sub)] hover:bg-[var(--bg-surface)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>{p.label}</span>
                </div>
                {theme === p.id && <Check className="w-3.5 h-3.5 text-[var(--accent-gold)]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
