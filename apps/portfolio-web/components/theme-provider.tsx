"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { ThemeMode, ThemePalette } from "@keshab-bhatt/types";

interface ThemeContextType {
  mode: ThemeMode;
  effectiveMode: "dark" | "light";
  theme: ThemePalette;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: ThemePalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("storage", callback);
  window.addEventListener("kb_theme_change", callback);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("kb_theme_change", callback);
    mq.removeEventListener("change", callback);
  };
}

function getModeSnapshot(): ThemeMode {
  try {
    const val = localStorage.getItem("kb_theme_mode");
    if (val === "dark" || val === "light" || val === "system") {
      return val;
    }
    return "system";
  } catch {
    return "system";
  }
}

function getModeServerSnapshot(): ThemeMode {
  return "system";
}

function getThemeSnapshot(): ThemePalette {
  try {
    const val = localStorage.getItem("kb_theme_palette");
    if (val === "slate-corporate" || val === "emerald-wealth") {
      return val;
    }
    return "navy-gold";
  } catch {
    return "navy-gold";
  }
}

function getThemeServerSnapshot(): ThemePalette {
  return "navy-gold";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getModeSnapshot, getModeServerSnapshot);
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getThemeServerSnapshot);

  const isClient = typeof window !== "undefined";
  const systemPrefersDark = isClient ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
  const effectiveMode: "dark" | "light" = mode === "system" ? (systemPrefersDark ? "dark" : "light") : mode;

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", effectiveMode);
    document.documentElement.classList.toggle("dark", effectiveMode === "dark");
  }, [effectiveMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setMode = (newMode: ThemeMode) => {
    try {
      localStorage.setItem("kb_theme_mode", newMode);
      window.dispatchEvent(new Event("kb_theme_change"));
    } catch {
      // Safe fallback when localStorage is unavailable
    }
  };

  const toggleMode = () => {
    setMode(effectiveMode === "dark" ? "light" : "dark");
  };

  const setTheme = (newTheme: ThemePalette) => {
    try {
      localStorage.setItem("kb_theme_palette", newTheme);
      window.dispatchEvent(new Event("kb_theme_change"));
    } catch {
      // Safe fallback when localStorage is unavailable
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, effectiveMode, theme, toggleMode, setMode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
