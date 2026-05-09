import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Tajawal", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b"
        },
        sand: {
          50: "#fdfaf3",
          100: "#f7efdc",
          200: "#ecdfbb",
          300: "#dcc88a",
          400: "#c9aa57",
          500: "#b48f3a",
          600: "#92702c",
          700: "#705425",
          800: "#4d3a1e",
          900: "#2c2113"
        }
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(0,0,0,0.15)"
      }
    }
  },
  plugins: []
};

export default config;
