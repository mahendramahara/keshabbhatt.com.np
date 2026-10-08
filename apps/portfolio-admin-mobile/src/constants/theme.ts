import "@/global.css";
import { Platform } from "react-native";

export const ExecutiveTheme = {
  colors: {
    background: "#040e24",
    surface: "#081c42",
    surfaceLight: "#0d2557",
    primary: "#061739",
    gold: "#d4af37",
    goldLight: "#f3e8b4",
    border: "#193262",
    borderLight: "#274885",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    danger: "#ef4444",
    success: "#10b981",
    info: "#38bdf8",
  },
  typography: {
    title: "font-bold text-xl text-slate-100",
    subtitle: "text-xs text-slate-400",
    body: "text-sm text-slate-200",
    label: "text-xs font-semibold uppercase tracking-wider text-amber-300",
  },
};

export const Colors = {
  light: {
    text: "#0f172a",
    background: "#f8fafc",
    backgroundElement: "#f1f5f9",
    backgroundSelected: "#e2e8f0",
    textSecondary: "#64748b",
  },
  dark: {
    text: "#f8fafc",
    background: "#040e24",
    backgroundElement: "#081c42",
    backgroundSelected: "#0d2557",
    textSecondary: "#94a3b8",
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
