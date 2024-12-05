import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-red': '#FF3B30',
        'dark-gray': '#1C1C1E',
        'medium-gray': '#2C2C2E',
        'light-gray': '#3A3A3C',
      },
      backgroundImage: {
        'gradient-radial': "radial-gradient(var(--tw-gradient-stops))",
        'gradient-conic': "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'gradient-dark': 'linear-gradient(to bottom right, #000000, #1C1C1E)',
      },
      boxShadow: {
        'neon-glow': '0 0 10px rgba(255, 59, 48, 0.5), 0 0 20px rgba(255, 59, 48, 0.3), 0 0 30px rgba(255, 59, 48, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 14s linear infinite',
        'fade-in': 'fadeIn 3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
