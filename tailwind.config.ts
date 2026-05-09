import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Algerian flag-inspired palette, but muted for a modern marketplace look.
        brand: {
          50: "#f0fbf5",
          100: "#dbf6e5",
          200: "#b6edca",
          300: "#82dfa5",
          400: "#4ccb7d",
          500: "#1faa5b", // primary green
          600: "#138647",
          700: "#106a3a",
          800: "#0e5430",
          900: "#0c4527",
        },
        accent: {
          500: "#c8102e", // Algerian red, used sparingly
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,.04), 0 4px 10px rgba(16,24,40,.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
