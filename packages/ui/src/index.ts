export const themeTokens = {
  colors: {
    primary: "#0f172a",
    primaryHover: "#1e293b",
    accent: "#2563eb",
    background: "#ffffff",
    surface: "#f8fafc",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    border: "#e2e8f0",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
} as const;

export type ThemeTokens = typeof themeTokens;
