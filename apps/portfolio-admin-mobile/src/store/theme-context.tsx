import React, { createContext, useContext, useState } from "react";
import { ThemeColors, Typography, type ThemeMode, type ColorPalette } from "@/constants/theme";

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ColorPalette;
  typography: typeof Typography;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  colors: ThemeColors.dark,
  typography: Typography,
  toggleTheme: () => {},
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors = ThemeColors[mode];

  return (
    <ThemeContext.Provider value={{ mode, colors, typography: Typography, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
