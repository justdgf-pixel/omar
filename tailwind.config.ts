import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', '"Tajawal"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#effaf3',
          100: '#d8f3e0',
          200: '#b3e6c4',
          300: '#80d1a0',
          400: '#4cb878',
          500: '#239e5a',
          600: '#177e47',
          700: '#13643a',
          800: '#114f30',
          900: '#0e3f28',
        },
        accent: {
          DEFAULT: '#d72638',
          dark: '#a31c2a',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
