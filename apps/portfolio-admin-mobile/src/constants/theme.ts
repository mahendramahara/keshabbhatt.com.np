import { Platform } from "react-native";

export type ThemeMode = "dark" | "light";

export interface ColorPalette {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceBorder: string;
  borderSubtle: string;
  textMain: string;
  textMuted: string;
  textSecondary: string;
  gold: string;
  goldSoft: string;
  goldBorder: string;
  danger: string;
  dangerSoft: string;
  dangerBorder: string;
  success: string;
  successSoft: string;
  successBorder: string;
  cardBg: string;
  inputBg: string;
  tabBarBg: string;
  tabBarBorder: string;
}

export const ThemeColors: Record<ThemeMode, ColorPalette> = {
  dark: {
    background: "#040e24",
    backgroundSecondary: "#061536",
    surface: "#081c42",
    surfaceElevated: "#0d2557",
    surfaceBorder: "#193262",
    borderSubtle: "#142952",
    textMain: "#f8fafc",
    textMuted: "#94a3b8",
    textSecondary: "#cbd5e1",
    gold: "#c98516",
    goldSoft: "rgba(201, 133, 22, 0.15)",
    goldBorder: "rgba(201, 133, 22, 0.35)",
    danger: "#ef4444",
    dangerSoft: "rgba(239, 68, 68, 0.15)",
    dangerBorder: "rgba(239, 68, 68, 0.3)",
    success: "#10b981",
    successSoft: "rgba(16, 185, 129, 0.15)",
    successBorder: "rgba(16, 185, 129, 0.3)",
    cardBg: "#081c42",
    inputBg: "#051330",
    tabBarBg: "#05122e",
    tabBarBorder: "#142952",
  },
  light: {
    background: "#f8fafc",
    backgroundSecondary: "#f1f5f9",
    surface: "#ffffff",
    surfaceElevated: "#f8fafc",
    surfaceBorder: "#e2e8f0",
    borderSubtle: "#cbd5e1",
    textMain: "#0f172a",
    textMuted: "#64748b",
    textSecondary: "#334155",
    gold: "#b45309",
    goldSoft: "rgba(180, 83, 9, 0.12)",
    goldBorder: "rgba(180, 83, 9, 0.3)",
    danger: "#dc2626",
    dangerSoft: "rgba(220, 38, 38, 0.12)",
    dangerBorder: "rgba(220, 38, 38, 0.25)",
    success: "#059669",
    successSoft: "rgba(5, 150, 105, 0.12)",
    successBorder: "rgba(5, 150, 105, 0.25)",
    cardBg: "#ffffff",
    inputBg: "#f1f5f9",
    tabBarBg: "#ffffff",
    tabBarBorder: "#e2e8f0",
  },
};

export const Typography = {
  headerTitle: "text-lg font-bold tracking-tight",
  headerSubtitle: "text-xs font-normal",
  cardTitle: "text-base font-semibold",
  cardSubtitle: "text-xs font-normal",
  metricValue: "text-2xl font-bold tracking-tight",
  metricLabel: "text-xs font-medium uppercase tracking-wider",
  body: "text-sm leading-relaxed",
  caption: "text-xs leading-normal",
  badge: "text-[11px] font-semibold tracking-wider uppercase",
  inputLabel: "text-xs font-semibold uppercase tracking-wider",
};

export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "Georgia",
    mono: "Menlo",
  },
  android: {
    sans: "Roboto",
    serif: "serif",
    mono: "monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    mono: "monospace",
  },
});
