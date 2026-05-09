import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Algerian flag-inspired palette (modernized).
        brand: {
          50: "#e6f7ee",
          100: "#c2ecd5",
          200: "#8fdcb1",
          300: "#54c98a",
          400: "#22b566",
          500: "#0a9d4f",
          600: "#067e3f",
          700: "#055f30",
          800: "#044122",
          900: "#022a16",
        },
        accent: {
          500: "#c1272d", // Red from Algerian flag
          600: "#a31f25",
        },
        ink: {
          50: "#f7f7f8",
          100: "#eceef1",
          200: "#d6dae0",
          300: "#b3bac5",
          400: "#7e8796",
          500: "#5a6473",
          600: "#3f4856",
          700: "#2c343f",
          800: "#1b2129",
          900: "#0f1318",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Noto Sans Arabic",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 19, 24, 0.04), 0 4px 16px rgba(15, 19, 24, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
