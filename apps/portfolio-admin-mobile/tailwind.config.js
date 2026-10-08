/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#040e24",
          900: "#061739",
          850: "#081b45",
          800: "#0d2044",
          700: "#142d5e",
          600: "#1e3d7a",
        },
        gold: {
          400: "#f3e8b4",
          500: "#d4af37",
          600: "#b89628",
        },
        executive: {
          bg: "#061739",
          card: "#081c42",
          cardBorder: "#193262",
          gold: "#d4af37",
          text: "#f8fafc",
          muted: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};
